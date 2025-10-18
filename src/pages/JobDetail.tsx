import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, User, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSeeker, setIsSeeker] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkUserRole();
      checkApplicationStatus();
    }
  }, [user, id]);

  const fetchJob = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles (name)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Job not found",
        variant: "destructive"
      });
      navigate("/browse");
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  const checkUserRole = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .single();

    setIsSeeker(data?.role === 'job_seeker');
  };

  const checkApplicationStatus = async () => {
    const { data } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('seeker_id', user?.id)
      .maybeSingle();

    setHasApplied(!!data);
  };

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!isSeeker) {
      toast({
        title: "Error",
        description: "You must be a job seeker to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    setApplying(true);

    const { error } = await supabase
      .from('applications')
      .insert({
        job_id: id,
        seeker_id: user.id,
        status: 'pending'
      });

    setApplying(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Application Submitted!",
        description: "The job poster will contact you soon.",
      });
      setHasApplied(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Job not found</p>
          <Button onClick={() => navigate("/browse")} className="mt-4">
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-3xl">{job.title}</CardTitle>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {job.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-secondary" />
                    <span className="font-bold text-secondary">${job.pay}/hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Apply for this job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="w-10 h-10 p-2 rounded-full bg-primary text-primary-foreground" />
                  <div>
                    <p className="font-semibold">Posted by</p>
                    <p className="text-sm text-muted-foreground">{job.profiles?.name || 'Anonymous'}</p>
                  </div>
                </div>
                
                {hasApplied ? (
                  <Button className="w-full" size="lg" disabled>
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleApply}
                    disabled={applying || !isSeeker}
                  >
                    {applying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {user ? 'Apply Now' : 'Sign In to Apply'}
                  </Button>
                )}
                
                {!isSeeker && user && (
                  <p className="text-xs text-destructive text-center">
                    You need a job seeker account to apply for jobs
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground text-center">
                  By applying, you agree to share your contact information with the job poster.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}