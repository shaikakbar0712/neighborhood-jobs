import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Reviews() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const revieweeId = searchParams.get('userId');
  const [reviews, setReviews] = useState<any[]>([]);
  const [revieweeProfile, setRevieweeProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (revieweeId) {
      fetchReviews();
      fetchRevieweeProfile();
    }
  }, [revieweeId]);

  const fetchRevieweeProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', revieweeId)
      .single();
    
    if (data) {
      setRevieweeProfile(data);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (name)
      `)
      .eq('reviewee_id', revieweeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error loading reviews",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please add a comment",
        variant: "destructive"
      });
      return;
    }

    if (!revieweeId || revieweeId === user?.id) {
      toast({
        title: "Error",
        description: "You cannot review yourself",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: user?.id,
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });
      setComment('');
      setRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!revieweeId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>No User Selected</CardTitle>
              <CardDescription>Please select a user to view their reviews</CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Reviews for {revieweeProfile?.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= parseFloat(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {user?.id !== revieweeId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
              <CardDescription>Share your experience working with this user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Reviews</h2>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No reviews yet. Be the first to leave a review!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{review.profiles?.name}</CardTitle>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                {review.comment && (
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
