import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Star,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Plus
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_public: boolean | null;
  admin_response: string | null;
  created_at: string;
  bookings: { booking_number: string; services: { name: string } | null } | null;
}

interface PendingReview {
  id: string;
  booking_number: string;
  services: { name: string } | null;
  completed_at: string;
}

export default function CustomerPortalReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchPendingReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!customer) return;

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          content,
          is_public,
          admin_response,
          created_at,
          bookings (booking_number, services (name))
        `)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews((data || []) as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!customer) return;

      // Get completed bookings without reviews
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          completed_at,
          services (name)
        `)
        .eq('customer_id', customer.id)
        .eq('status', 'completed')
        .is('rating', null)
        .order('completed_at', { ascending: false })
        .limit(5);

      setPendingReviews((bookings || []) as PendingReview[]);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!customer) return;

      // Create review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: selectedBooking.id,
          customer_id: customer.id,
          rating,
          content: reviewContent,
          is_public: true,
        });

      if (reviewError) throw reviewError;

      // Update booking rating
      await supabase
        .from('bookings')
        .update({ rating, reviewed_at: new Date().toISOString() })
        .eq('id', selectedBooking.id);

      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
      setReviewDialogOpen(false);
      setRating(5);
      setReviewContent('');
      fetchReviews();
      fetchPendingReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground">Share your experience and view your feedback</p>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Leave a Review
            </CardTitle>
            <CardDescription>Share your experience from recent services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReviews.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border"
                >
                  <div>
                    <p className="font-medium">{booking.services?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.booking_number} • Completed {booking.completed_at && format(new Date(booking.completed_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setReviewDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Write Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Feedback you've submitted</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchReviews}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Reviews Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your reviews will appear here after you rate your services
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{review.bookings?.services?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.bookings?.booking_number}
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {review.content && (
                    <p className="text-sm mb-3">{review.content}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {review.is_public ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Published
                      </span>
                    ) : (
                      <span>Pending review</span>
                    )}
                  </div>

                  {review.admin_response && (
                    <div className="mt-3 p-3 rounded bg-muted">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <MessageSquare className="h-4 w-4" />
                        Response from CoolFix Pro
                      </div>
                      <p className="text-sm">{review.admin_response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience for {selectedBooking?.services?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">How would you rate this service?</p>
              {renderStars(rating, true, setRating)}
              <p className="text-sm mt-2">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Your Review (optional)</label>
              <Textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
