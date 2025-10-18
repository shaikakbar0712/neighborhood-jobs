import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<'job_poster' | 'job_seeker' | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  useEffect(() => {
    if (userRole && user) {
      if (userRole === 'job_poster') {
        fetchMyJobs();
      } else {
        fetchMyApplications();
      }
      
      // Set up real-time subscription AFTER userRole is known
      const channel = supabase
        .channel('dashboard-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'jobs'
          },
          () => {
            if (userRole === 'job_poster') fetchMyJobs();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'applications'
          },
          () => {
            if (userRole === 'job_poster') fetchMyJobs();
            else fetchMyApplications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userRole, user]);

  const fetchUserRole = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .single();

    if (data) {
      setUserRole(data.role as 'job_poster' | 'job_seeker');
    }
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications (
          id,
          status,
          seeker_id,
          profiles (name)
        )
      `)
      .eq('poster_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error loading jobs",
        description: error.message,
        variant: "destructive"
      });
    }

    setJobs(data || []);
    setLoading(false);
  };

  const fetchMyApplications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          description,
          category,
          location,
          pay,
          status
        )
      `)
      .eq('seeker_id', user?.id)
      .order('applied_at', { ascending: false });

    setApplications(data || []);
    setLoading(false);
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Application ${status}`,
      });
      fetchMyJobs();
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Job marked as ${status}`,
      });
      fetchMyJobs();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {userRole === 'job_poster' ? 'Poster Dashboard' : 'Seeker Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'job_poster' 
              ? 'Manage your job posts and applications' 
              : 'Track your job applications'}
          </p>
        </div>

        {userRole === 'job_poster' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Jobs</h2>
              <Button onClick={() => navigate('/post-job')}>
                <Briefcase className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.location} • ${job.pay}/hour</CardDescription>
                      </div>
                      <Badge>{job.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    
                    {job.applications && job.applications.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Applications ({job.applications.length})</h4>
                        {job.applications.map((app: any) => (
                          <div key={app.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{app.profiles?.name}</p>
                              <Badge variant="outline" className="mt-1">{app.status}</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/reviews?userId=${app.seeker_id}`)}
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No applications yet</p>
                    )}

                    <div className="flex gap-2 mt-4">
                      {job.status === 'open' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateJobStatus(job.id, 'completed')}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Applications</h2>
              <Button onClick={() => navigate('/browse')}>
                Browse More Jobs
              </Button>
            </div>

            <div className="grid gap-6">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{app.jobs?.title}</CardTitle>
                        <CardDescription>
                          {app.jobs?.location} • ${app.jobs?.pay}/hour
                        </CardDescription>
                      </div>
                      <Badge>{app.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{app.jobs?.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}