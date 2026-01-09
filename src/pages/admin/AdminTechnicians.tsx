import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  RefreshCw,
  Star,
  Wrench,
  Calendar,
  Edit,
  ToggleLeft
} from 'lucide-react';

interface Technician {
  id: string;
  user_id: string;
  employee_id: string | null;
  is_active: boolean;
  is_available: boolean;
  rating: number | null;
  total_jobs: number | null;
  completed_jobs: number | null;
  specializations: string[] | null;
  certifications: string[] | null;
  hourly_rate: number | null;
  created_at: string;
}

export default function AdminTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employee_id: '',
    hourly_rate: 0,
    is_active: true,
    is_available: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast({ title: 'Error', description: 'Failed to fetch technicians', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTechnician = async () => {
    if (!selectedTechnician) return;
    
    try {
      const { error } = await supabase
        .from('technicians')
        .update({
          employee_id: editForm.employee_id || null,
          hourly_rate: editForm.hourly_rate || null,
          is_active: editForm.is_active,
          is_available: editForm.is_available,
        })
        .eq('id', selectedTechnician.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Technician updated successfully' });
      setEditDialogOpen(false);
      fetchTechnicians();
    } catch (error) {
      console.error('Error updating technician:', error);
      toast({ title: 'Error', description: 'Failed to update technician', variant: 'destructive' });
    }
  };

  const handleToggleAvailability = async (technician: Technician) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ is_available: !technician.is_available })
        .eq('id', technician.id);

      if (error) throw error;
      
      toast({ 
        title: 'Success', 
        description: `Technician marked as ${!technician.is_available ? 'available' : 'unavailable'}` 
      });
      fetchTechnicians();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (technician: Technician) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ is_active: !technician.is_active })
        .eq('id', technician.id);

      if (error) throw error;
      
      toast({ 
        title: 'Success', 
        description: `Technician ${!technician.is_active ? 'activated' : 'deactivated'}` 
      });
      fetchTechnicians();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const filteredTechnicians = technicians.filter(tech => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tech.employee_id?.toLowerCase().includes(query) ||
      tech.id.toLowerCase().includes(query)
    );
  });

  const getCompletionRate = (completed: number | null, total: number | null) => {
    if (!total || total === 0) return 0;
    return Math.round(((completed || 0) / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
          <p className="text-muted-foreground">Manage technician profiles and performance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Technician
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Technicians</p>
          <p className="text-2xl font-bold">{technicians.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {technicians.filter(t => t.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Available Now</p>
          <p className="text-2xl font-bold text-blue-600">
            {technicians.filter(t => t.is_available && t.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Rating</p>
          <p className="text-2xl font-bold">
            {(technicians.reduce((acc, t) => acc + (t.rating || 0), 0) / technicians.length || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={fetchTechnicians}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Rate</TableHead>
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
            ) : filteredTechnicians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No technicians found
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnicians.map((tech) => (
                <TableRow key={tech.id} className={!tech.is_active ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <Wrench className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {tech.employee_id || `Tech #${tech.id.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tech.completed_jobs || 0} jobs completed
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={tech.is_active ? 'active' : 'inactive'} />
                      {tech.is_active && (
                        <StatusBadge status={tech.is_available ? 'available' : 'busy'} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(tech.specializations || []).slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs uppercase">
                          {spec}
                        </Badge>
                      ))}
                      {(tech.specializations?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(tech.specializations?.length || 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Completion</span>
                        <span>{getCompletionRate(tech.completed_jobs, tech.total_jobs)}%</span>
                      </div>
                      <Progress value={getCompletionRate(tech.completed_jobs, tech.total_jobs)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{(tech.rating || 0).toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tech.hourly_rate ? `$${tech.hourly_rate}/hr` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedTechnician(tech);
                          setEditForm({
                            employee_id: tech.employee_id || '',
                            hourly_rate: tech.hourly_rate || 0,
                            is_active: tech.is_active,
                            is_available: tech.is_available,
                          });
                          setEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAvailability(tech)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {tech.is_available ? 'Mark Unavailable' : 'Mark Available'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(tech)}>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          {tech.is_active ? 'Deactivate' : 'Activate'}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Technician</DialogTitle>
            <DialogDescription>Update technician information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee ID</Label>
              <Input
                value={editForm.employee_id}
                onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })}
                placeholder="e.g., TECH-001"
              />
            </div>
            <div>
              <Label>Hourly Rate ($)</Label>
              <Input
                type="number"
                value={editForm.hourly_rate}
                onChange={(e) => setEditForm({ ...editForm, hourly_rate: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active Status</Label>
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Available for Jobs</Label>
              <Switch
                checked={editForm.is_available}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_available: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTechnician}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
