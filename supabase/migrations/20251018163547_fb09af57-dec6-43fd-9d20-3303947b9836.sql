-- Add foreign key constraints from reviews table to profiles table
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_reviewer_profile
FOREIGN KEY (reviewer_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_reviewee_profile
FOREIGN KEY (reviewee_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);