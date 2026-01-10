import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, MoreHorizontal, RefreshCw, Edit, Trash2, Eye, FileText, HelpCircle, MessageSquare } from 'lucide-react';

interface BlogPost { id: string; title: string; slug: string; excerpt: string | null; content: string; is_published: boolean | null; is_featured: boolean | null; category: string | null; created_at: string; }
interface FAQ { id: string; question: string; answer: string; category: string | null; is_active: boolean | null; display_order: number | null; }
interface Testimonial { id: string; customer_name: string; customer_title: string | null; content: string; rating: number | null; is_active: boolean | null; is_featured: boolean | null; }

export default function AdminContent() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '', is_active: true });
  const [testimonialForm, setTestimonialForm] = useState({ customer_name: '', customer_title: '', content: '', rating: 5, is_active: true, is_featured: false });
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: '', is_published: false, is_featured: false });
  const { toast } = useToast();

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [blogRes, faqRes, testimonialRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('faq_items').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
      ]);
      setBlogPosts(blogRes.data || []);
      setFaqs(faqRes.data || []);
      setTestimonials(testimonialRes.data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch content', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleSaveFaq = async () => {
    try {
      if (selectedFaq) {
        await supabase.from('faq_items').update(faqForm).eq('id', selectedFaq.id);
      } else {
        await supabase.from('faq_items').insert(faqForm);
      }
      toast({ title: 'Success', description: selectedFaq ? 'FAQ updated' : 'FAQ created' });
      setFaqDialogOpen(false);
      setSelectedFaq(null);
      setFaqForm({ question: '', answer: '', category: '', is_active: true });
      fetchContent();
    } catch { toast({ title: 'Error', description: 'Failed to save FAQ', variant: 'destructive' }); }
  };

  const handleSaveTestimonial = async () => {
    try {
      if (selectedTestimonial) {
        await supabase.from('testimonials').update(testimonialForm).eq('id', selectedTestimonial.id);
      } else {
        await supabase.from('testimonials').insert(testimonialForm);
      }
      toast({ title: 'Success', description: selectedTestimonial ? 'Testimonial updated' : 'Testimonial created' });
      setTestimonialDialogOpen(false);
      setSelectedTestimonial(null);
      setTestimonialForm({ customer_name: '', customer_title: '', content: '', rating: 5, is_active: true, is_featured: false });
      fetchContent();
    } catch { toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' }); }
  };

  const handleSaveBlog = async () => {
    try {
      const data = { ...blogForm, published_at: blogForm.is_published ? new Date().toISOString() : null };
      if (selectedBlogPost) {
        await supabase.from('blog_posts').update(data).eq('id', selectedBlogPost.id);
      } else {
        await supabase.from('blog_posts').insert(data);
      }
      toast({ title: 'Success', description: selectedBlogPost ? 'Blog post updated' : 'Blog post created' });
      setBlogDialogOpen(false);
      setSelectedBlogPost(null);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: '', is_published: false, is_featured: false });
      fetchContent();
    } catch { toast({ title: 'Error', description: 'Failed to save blog post', variant: 'destructive' }); }
  };

  const handleDelete = async (type: 'blog' | 'faq' | 'testimonial', id: string) => {
    try {
      const table = type === 'blog' ? 'blog_posts' : type === 'faq' ? 'faq_items' : 'testimonials';
      await supabase.from(table).delete().eq('id', id);
      toast({ title: 'Success', description: 'Deleted successfully' });
      fetchContent();
    } catch { toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Content Management</h1><p className="text-muted-foreground">Manage blogs, FAQs and testimonials</p></div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><FileText className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{blogPosts.length}</p><p className="text-sm text-muted-foreground">Blog Posts</p></div></div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"><HelpCircle className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{faqs.length}</p><p className="text-sm text-muted-foreground">FAQs</p></div></div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><MessageSquare className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold">{testimonials.length}</p><p className="text-sm text-muted-foreground">Testimonials</p></div></div>
      </div>

      <Tabs defaultValue="blog">
        <TabsList><TabsTrigger value="blog">Blog Posts</TabsTrigger><TabsTrigger value="faqs">FAQs</TabsTrigger><TabsTrigger value="testimonials">Testimonials</TabsTrigger></TabsList>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button onClick={() => { setSelectedBlogPost(null); setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: '', is_published: false, is_featured: false }); setBlogDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" />New Post</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell><p className="font-medium">{post.title}</p></TableCell>
                    <TableCell>{post.category || '-'}</TableCell>
                    <TableCell><StatusBadge status={post.is_published ? 'published' : 'draft'} /></TableCell>
                    <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedBlogPost(post); setBlogForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content, category: post.category || '', is_published: post.is_published ?? false, is_featured: post.is_featured ?? false }); setBlogDialogOpen(true); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete('blog', post.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button onClick={() => { setSelectedFaq(null); setFaqForm({ question: '', answer: '', category: '', is_active: true }); setFaqDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add FAQ</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell><p className="font-medium">{faq.question}</p></TableCell>
                    <TableCell>{faq.category || '-'}</TableCell>
                    <TableCell><StatusBadge status={faq.is_active ? 'active' : 'inactive'} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedFaq(faq); setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category || '', is_active: faq.is_active ?? true }); setFaqDialogOpen(true); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete('faq', faq.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={fetchContent}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button onClick={() => { setSelectedTestimonial(null); setTestimonialForm({ customer_name: '', customer_title: '', content: '', rating: 5, is_active: true, is_featured: false }); setTestimonialDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button>
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Content</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell><p className="font-medium">{t.customer_name}</p></TableCell>
                    <TableCell className="max-w-xs"><p className="line-clamp-2">{t.content}</p></TableCell>
                    <TableCell>{t.rating}★</TableCell>
                    <TableCell><StatusBadge status={t.is_active ? 'active' : 'inactive'} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedTestimonial(t); setTestimonialForm({ customer_name: t.customer_name, customer_title: t.customer_title || '', content: t.content, rating: t.rating || 5, is_active: t.is_active ?? true, is_featured: t.is_featured ?? false }); setTestimonialDialogOpen(true); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete('testimonial', t.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{selectedBlogPost ? 'Edit Post' : 'New Post'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} /></div>
            <div><Label>Excerpt</Label><Textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} /></div>
            <div><Label>Content</Label><Textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} rows={6} /></div>
            <div><Label>Category</Label><Input value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} /></div>
            <div className="flex gap-6"><div className="flex items-center gap-2"><Switch checked={blogForm.is_published} onCheckedChange={(c) => setBlogForm({ ...blogForm, is_published: c })} /><Label>Published</Label></div><div className="flex items-center gap-2"><Switch checked={blogForm.is_featured} onCheckedChange={(c) => setBlogForm({ ...blogForm, is_featured: c })} /><Label>Featured</Label></div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setBlogDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveBlog}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{selectedFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Question</Label><Input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} /></div>
            <div><Label>Answer</Label><Textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} rows={4} /></div>
            <div><Label>Category</Label><Input value={faqForm.category} onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={faqForm.is_active} onCheckedChange={(c) => setFaqForm({ ...faqForm, is_active: c })} /><Label>Active</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setFaqDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveFaq}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{selectedTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Customer Name</Label><Input value={testimonialForm.customer_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_name: e.target.value })} /></div>
            <div><Label>Customer Title</Label><Input value={testimonialForm.customer_title} onChange={(e) => setTestimonialForm({ ...testimonialForm, customer_title: e.target.value })} /></div>
            <div><Label>Testimonial</Label><Textarea value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} rows={4} /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} /></div>
            <div className="flex gap-6"><div className="flex items-center gap-2"><Switch checked={testimonialForm.is_active} onCheckedChange={(c) => setTestimonialForm({ ...testimonialForm, is_active: c })} /><Label>Active</Label></div><div className="flex items-center gap-2"><Switch checked={testimonialForm.is_featured} onCheckedChange={(c) => setTestimonialForm({ ...testimonialForm, is_featured: c })} /><Label>Featured</Label></div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveTestimonial}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
