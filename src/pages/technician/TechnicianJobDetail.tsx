import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Camera,
  Navigation,
  Play,
  CheckCircle,
  Loader2,
  X,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type BookingStatus = Database['public']['Enums']['booking_status'];

const STATUS_FLOW: BookingStatus[] = ['assigned', 'confirmed', 'en_route', 'in_progress', 'completed'];

export default function TechnicianJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(first_name, last_name, phone, email),
        service:services(name, icon, base_price, estimated_duration_minutes),
        address:customer_addresses(street, apartment, city, state, zip, latitude, longitude, special_instructions)
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load job details',
        variant: 'destructive',
      });
      navigate('/technician/jobs');
      return;
    }

    setJob(data);
    setNotes(data.technician_notes || '');
    setFinalPrice(data.final_price?.toString() || data.service?.base_price?.toString() || '');
    setLoading(false);
  };

  const getNextStatus = (currentStatus: BookingStatus): BookingStatus | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[currentIndex + 1];
  };

  const getStatusButtonText = (status: BookingStatus) => {
    const texts: Record<BookingStatus, string> = {
      assigned: 'Confirm Job',
      confirmed: 'Start Route',
      en_route: 'Arrive & Start',
      in_progress: 'Complete Job',
      completed: 'Completed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
    };
    return texts[status] || 'Update Status';
  };

  const getStatusIcon = (status: BookingStatus) => {
    const icons: Record<BookingStatus, any> = {
      assigned: CheckCircle,
      confirmed: Navigation,
      en_route: Play,
      in_progress: CheckCircle,
      completed: CheckCircle,
      pending: Clock,
      cancelled: X,
      rescheduled: Clock,
    };
    return icons[status] || CheckCircle;
  };

  const handleStatusUpdate = async () => {
    if (!job) return;

    const nextStatus = getNextStatus(job.status);
    if (!nextStatus) return;

    setUpdating(true);

    const updateData: any = {
      status: nextStatus,
      technician_notes: notes,
      updated_at: new Date().toISOString(),
    };

    // Add timestamps for specific status changes
    if (nextStatus === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (nextStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
      updateData.final_price = parseFloat(finalPrice) || job.service?.base_price;
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', job.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status Updated',
        description: `Job is now ${nextStatus.replace('_', ' ')}`,
      });
      fetchJob();
    }

    setUpdating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${job.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('job-photos')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('job-photos')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
      
      toast({
        title: 'Photos Uploaded',
        description: `${files.length} photo(s) uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    setUploading(false);
  };

  const openMaps = () => {
    if (!job?.address) return;
    const { street, city, state, zip, latitude, longitude } = job.address;
    
    if (latitude && longitude) {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    } else {
      const address = encodeURIComponent(`${street}, ${city}, ${state} ${zip}`);
      window.open(`https://maps.google.com/?q=${address}`, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      en_route: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const nextStatus = getNextStatus(job.status);
  const StatusIcon = nextStatus ? getStatusIcon(job.status) : CheckCircle;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/technician/jobs')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">#{job.booking_number}</h1>
            <Badge className={getStatusColor(job.status)}>
              {job.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground">{job.service?.name}</p>
        </div>
      </div>

      {/* Priority Alert */}
      {job.priority !== 'normal' && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          job.priority === 'emergency' ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'
        }`}>
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium capitalize">{job.priority} Priority Service</span>
        </div>
      )}

      {/* Schedule & Address */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(new Date(job.scheduled_date), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">{job.time_slot_label}</p>
            </div>
          </div>

          {job.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">
                  {job.address.street}
                  {job.address.apartment && `, ${job.address.apartment}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.address.city}, {job.address.state} {job.address.zip}
                </p>
                {job.address.special_instructions && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: {job.address.special_instructions}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={openMaps}>
                <Navigation className="h-4 w-4 mr-1" />
                Navigate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">
            {job.customer?.first_name} {job.customer?.last_name}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${job.customer?.phone}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone className="h-4 w-4" />
              {job.customer?.phone}
            </a>
            <a
              href={`mailto:${job.customer?.email}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {job.customer?.email}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Problem Description */}
      {job.problem_description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Problem Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{job.problem_description}</p>
            {job.selected_issues && job.selected_issues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.selected_issues.map((issue: string, i: number) => (
                  <Badge key={i} variant="outline">{issue}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technician Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add notes about the work performed, parts used, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          
          {/* Photo Upload */}
          <div>
            <Label className="mb-2 block">Work Photos</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={url} alt={`Work photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    <span className="text-xs mt-1">Add</span>
                  </>
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Final Price (show when completing) */}
          {job.status === 'in_progress' && (
            <div>
              <Label htmlFor="finalPrice">Final Price ($)</Label>
              <Input
                id="finalPrice"
                type="number"
                step="0.01"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Button */}
      {nextStatus && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t md:relative md:bottom-0 md:p-0 md:border-0 md:bg-transparent">
          <Button
            className="w-full h-12 text-lg"
            onClick={handleStatusUpdate}
            disabled={updating}
          >
            {updating ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <StatusIcon className="h-5 w-5 mr-2" />
            )}
            {getStatusButtonText(job.status)}
          </Button>
        </div>
      )}
    </div>
  );
}
