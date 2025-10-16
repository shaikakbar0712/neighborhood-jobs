import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - would come from backend
const mockJobData: Record<string, any> = {
  "1": {
    title: "Math Tutor Needed",
    category: "Tutoring",
    location: "Downtown",
    pay: "$20/hour",
    duration: "2-3 hours/week",
    description: "Looking for a patient math tutor for high school algebra. The student is in 10th grade and needs help with algebra concepts, homework, and test preparation. We prefer someone with teaching experience or strong math background. Flexible schedule - can work around the tutor's availability. Sessions can be at our home or local library.",
    postedBy: "Sarah M.",
    requirements: ["Strong math skills", "Patient and encouraging", "Flexible schedule"],
  },
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const job = mockJobData[id || "1"];

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

  const handleApply = () => {
    toast({
      title: "Application Submitted!",
      description: "The job poster will contact you soon.",
    });
  };

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
                    <span className="font-bold text-secondary">{job.pay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{job.duration}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>

                {job.requirements && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {job.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                    <p className="text-sm text-muted-foreground">{job.postedBy}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
                
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
