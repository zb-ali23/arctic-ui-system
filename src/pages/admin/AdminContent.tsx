import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Plus, 
  MoreHorizontal,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  FileText,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  category: string | null;
  created_at: string;
  published_at: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string | null;
  content: string;
  rating: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  service_type: string | null;
}

export default function AdminContent() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  // Form states
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: '',
    is_active: true,
  });
  const [testimonialForm, setTestimonialForm] = useState({
    customer_name: '',
    customer_title: '',
    content: '',
    rating: 5,
    is_active: true,
    is_featured: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [blogRes, faqRes, testimonialRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('faq_items').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
      ]);

      if (blogRes.error) throw blogRes.error;
      if (faqRes.error) throw faqRes.error;
      if (testimonialRes.error) throw testimonialRes.error;

      setBlogPosts(blogRes.data || []);
      setFaqs(faqRes.data || []);
      setTestimonials(testimonialRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({ title: 'Error', description: 'Failed to fetch content', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFaq = async () => {
    try {
      if (selectedFaq) {
        const { error } = await supabase
          .from('faq_items')
          .update(faqForm)
          .eq('id', selectedFaq.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ updated' });
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert(faqForm);
        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ created' });
      }
      setFaqDialogOpen(false);
      resetFaqForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({ title: 'Error', description: 'Failed to save FAQ', variant: 'destructive' });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const { error } = await supabase.from('faq_items').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'FAQ deleted' });
      fetchContent();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({ title: 'Error', description: 'Failed to delete FAQ', variant: 'destructive' });
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      if (selectedTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialForm)
          .eq('id', selectedTestimonial.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Testimonial updated' });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(testimonialForm);
        if (error) throw error;
        toast({ title: 'Success', description: 'Testimonial created' });
      }
      setTestimonialDialogOpen(false);
      resetTestimonialForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Testimonial deleted' });
      fetchContent();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  const resetFaqForm = () => {
    setFaqForm({ question: '', answer: '', category: '', is_active: true });
    setSelectedFaq(null);
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      customer_name: '',
      customer_title: '',
      content: '',
      rating: 5,
      is_active: true,
      is_featured: false,
    });
    setSelectedTestimonial(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage website content, blogs, FAQs and testimonials</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{blogPosts.length}</p>
            <p className="text-sm text-muted-foreground">Blog Posts</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{faqs.length}</p>
            <p className="text-sm text-muted-foreground">FAQs</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{testimonials.length}</p>
            <p className="text-sm text-muted-foreground">Testimonials</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="blog">
        <TabsList>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                      </TableCell>
                      <TableCell>{post.category || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={post.is_published ? 'published' : 'draft'} />
                      </TableCell>
                      <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => { resetFaqForm(); setFaqDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <p className="font-medium line-clamp-2">{faq.question}</p>
                      </TableCell>
                      <TableCell>{faq.category || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={faq.is_active ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell>{faq.display_order}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedFaq(faq);
                              setFaqForm({
                                question: faq.question,
                                answer: faq.answer,
                                category: faq.category || '',
                                is_active: faq.is_active ?? true,
                              });
                              setFaqDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteFaq(faq.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => { resetTestimonialForm(); setTestimonialDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No testimonials found
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{testimonial.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.customer_title}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2">{testimonial.content}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={star <= (testimonial.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={testimonial.is_active ? 'active' : 'inactive'} />
                          {testimonial.is_featured && (
                            <span className="text-xs text-purple-600">Featured</span>
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
                              setSelectedTestimonial(testimonial);
                              setTestimonialForm({
                                customer_name: testimonial.customer_name,
                                customer_title: testimonial.customer_title || '',
                                content: testimonial.content,
                                rating: testimonial.rating || 5,
                                is_active: testimonial.is_active ?? true,
                                is_featured: testimonial.is_featured ?? false,
                              });
                              setTestimonialDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
      </Tabs>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>
              {selectedFaq ? 'Update this FAQ entry' : 'Add a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={faqForm.category}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                placeholder="e.g., Billing, Services"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={faqForm.is_active}
                onCheckedChange={(checked) => setFaqForm({ ...faqForm, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFaq}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>
              {selectedTestimonial ? 'Update this testimonial' : 'Add a new customer testimonial'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <Input
                value={testimonialForm.customer_name}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Customer Title/Location</Label>
              <Input
                value={testimonialForm.customer_title}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_title: e.target.value })}
                placeholder="e.g., Homeowner, Miami FL"
              />
            </div>
            <div>
              <Label>Testimonial</Label>
              <Textarea
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={testimonialForm.is_active}
                onCheckedChange={(checked) => setTestimonialForm({ ...testimonialForm, is_active: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch
                checked={testimonialForm.is_featured}
                onCheckedChange={(checked) => setTestimonialForm({ ...testimonialForm, is_featured: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTestimonial}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
