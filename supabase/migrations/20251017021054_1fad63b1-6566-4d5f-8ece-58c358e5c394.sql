
-- Add foreign key constraint from applications.seeker_id to profiles.id
ALTER TABLE public.applications 
ADD CONSTRAINT fk_applications_seeker_profile
FOREIGN KEY (seeker_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON public.applications(seeker_id);
