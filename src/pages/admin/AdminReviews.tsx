import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Search, 
  RefreshCw,
  Star,
  MoreHorizontal,
  Eye,
  EyeOff,
  MessageSquare,
  CheckCircle,
  Award
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_public: boolean | null;
  is_verified: boolean | null;
  is_featured: boolean | null;
  admin_response: string | null;
  created_at: string;
  customers: { first_name: string; last_name: string } | null;
  bookings: { booking_number: string } | null;
  technicians: { id: string } | null;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          content,
          is_public,
          is_verified,
          is_featured,
          admin_response,
          created_at,
          customers (first_name, last_name),
          bookings (booking_number),
          technicians (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews((data || []) as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({ title: 'Error', description: 'Failed to fetch reviews', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_public: !review.is_public })
        .eq('id', review.id);

      if (error) throw error;
      
      toast({ 
        title: 'Success', 
        description: `Review ${!review.is_public ? 'published' : 'hidden'}` 
      });
      fetchReviews();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({ title: 'Error', description: 'Failed to update review', variant: 'destructive' });
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_featured: !review.is_featured })
        .eq('id', review.id);

      if (error) throw error;
      
      toast({ 
        title: 'Success', 
        description: `Review ${!review.is_featured ? 'featured' : 'unfeatured'}` 
      });
      fetchReviews();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({ title: 'Error', description: 'Failed to update review', variant: 'destructive' });
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          admin_response: adminResponse,
          admin_responded_at: new Date().toISOString()
        })
        .eq('id', selectedReview.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Response submitted' });
      setResponseDialogOpen(false);
      setAdminResponse('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({ title: 'Error', description: 'Failed to submit response', variant: 'destructive' });
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  };

  const filteredReviews = reviews.filter(review => {
    if (statusFilter === 'public' && !review.is_public) return false;
    if (statusFilter === 'hidden' && review.is_public) return false;
    if (statusFilter === 'featured' && !review.is_featured) return false;
    if (statusFilter === 'pending' && review.is_public) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      review.title?.toLowerCase().includes(query) ||
      review.content?.toLowerCase().includes(query) ||
      review.customers?.first_name.toLowerCase().includes(query)
    );
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">{getAverageRating()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="text-2xl font-bold">{reviews.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.is_public).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="text-2xl font-bold text-purple-600">
            {reviews.filter(r => r.is_featured).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="public">Published</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchReviews}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    {review.customers?.first_name} {review.customers?.last_name}
                  </TableCell>
                  <TableCell>{review.bookings?.booking_number || '-'}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      {review.title && (
                        <p className="font-medium truncate">{review.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.content || 'No comment'}
                      </p>
                      {review.admin_response && (
                        <div className="mt-1 text-xs text-primary flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Response added
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={review.is_public ? 'published' : 'hidden'} />
                      {review.is_featured && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                          <Award className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(review.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleVisibility(review)}>
                          {review.is_public ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Hide Review
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish Review
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(review)}>
                          <Award className="mr-2 h-4 w-4" />
                          {review.is_featured ? 'Remove from Featured' : 'Add to Featured'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedReview(review);
                          setAdminResponse(review.admin_response || '');
                          setResponseDialogOpen(true);
                        }}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {review.admin_response ? 'Edit Response' : 'Add Response'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Add a public response to this customer review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {selectedReview?.customers?.first_name} {selectedReview?.customers?.last_name}
                </span>
                {selectedReview && renderStars(selectedReview.rating)}
              </div>
              <p className="text-sm">{selectedReview?.content}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Your Response</label>
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Thank you for your feedback..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitResponse}>Submit Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
