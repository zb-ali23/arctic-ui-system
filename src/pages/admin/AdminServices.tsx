import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  RefreshCw,
  Edit,
  Package,
  DollarSign,
  Clock,
  Trash2
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  price_type: string | null;
  estimated_duration_minutes: number | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  is_emergency: boolean | null;
  display_order: number | null;
  category_id: string | null;
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    base_price: 0,
    estimated_duration_minutes: 60,
    is_active: true,
    is_popular: false,
    is_emergency: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: editForm.name,
          slug: editForm.slug,
          description: editForm.description,
          short_description: editForm.short_description,
          base_price: editForm.base_price,
          estimated_duration_minutes: editForm.estimated_duration_minutes,
          is_active: editForm.is_active,
          is_popular: editForm.is_popular,
          is_emergency: editForm.is_emergency,
        })
        .eq('id', selectedService.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Service updated successfully' });
      setEditDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const handleCreateService = async () => {
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          name: editForm.name,
          slug: editForm.slug || editForm.name.toLowerCase().replace(/\s+/g, '-'),
          description: editForm.description,
          short_description: editForm.short_description,
          base_price: editForm.base_price,
          estimated_duration_minutes: editForm.estimated_duration_minutes,
          is_active: editForm.is_active,
          is_popular: editForm.is_popular,
          is_emergency: editForm.is_emergency,
        });

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Service created successfully' });
      setCreateDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({ title: 'Error', description: 'Failed to create service', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;
      
      toast({ 
        title: 'Success', 
        description: `Service ${!service.is_active ? 'activated' : 'deactivated'}` 
      });
      fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setEditForm({
      name: '',
      slug: '',
      description: '',
      short_description: '',
      base_price: 0,
      estimated_duration_minutes: 60,
      is_active: true,
      is_popular: false,
      is_emergency: false,
    });
  };

  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services & Pricing</h1>
          <p className="text-muted-foreground">Manage service offerings and pricing</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Services</p>
              <p className="text-2xl font-bold">{services.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Active Services</p>
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.is_active).length}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Emergency Services</p>
              <p className="text-2xl font-bold text-red-600">
                {services.filter(s => s.is_emergency).length}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Avg. Price</p>
              <p className="text-2xl font-bold">
                ${Math.round(services.reduce((acc, s) => acc + s.base_price, 0) / services.length || 0)}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchServices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id} className={!service.is_active ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {service.short_description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{service.base_price}</span>
                          {service.price_type && (
                            <span className="text-xs text-muted-foreground">/{service.price_type}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{service.estimated_duration_minutes || 60} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={service.is_active ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.is_popular && (
                            <Badge variant="default" className="text-xs">Popular</Badge>
                          )}
                          {service.is_emergency && (
                            <Badge variant="destructive" className="text-xs">Emergency</Badge>
                          )}
                        </div>
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
                              setSelectedService(service);
                              setEditForm({
                                name: service.name,
                                slug: service.slug,
                                description: service.description || '',
                                short_description: service.short_description || '',
                                base_price: service.base_price,
                                estimated_duration_minutes: service.estimated_duration_minutes || 60,
                                is_active: service.is_active ?? true,
                                is_popular: service.is_popular ?? false,
                                is_emergency: service.is_emergency ?? false,
                              });
                              setEditDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(service)}>
                              <Package className="mr-2 h-4 w-4" />
                              {service.is_active ? 'Deactivate' : 'Activate'}
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell>
                        <StatusBadge status={category.is_active ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell>{category.display_order}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen || createDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setEditDialogOpen(false);
          setCreateDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Edit Service' : 'Create Service'}</DialogTitle>
            <DialogDescription>
              {selectedService ? 'Update service details' : 'Add a new service to your offerings'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                placeholder="auto-generated-from-name"
              />
            </div>
            <div>
              <Label>Short Description</Label>
              <Input
                value={editForm.short_description}
                onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base Price ($)</Label>
                <Input
                  type="number"
                  value={editForm.base_price}
                  onChange={(e) => setEditForm({ ...editForm, base_price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={editForm.estimated_duration_minutes}
                  onChange={(e) => setEditForm({ ...editForm, estimated_duration_minutes: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Popular Service</Label>
              <Switch
                checked={editForm.is_popular}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_popular: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Emergency Service</Label>
              <Switch
                checked={editForm.is_emergency}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_emergency: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              setCreateDialogOpen(false);
            }}>Cancel</Button>
            <Button onClick={selectedService ? handleUpdateService : handleCreateService}>
              {selectedService ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
