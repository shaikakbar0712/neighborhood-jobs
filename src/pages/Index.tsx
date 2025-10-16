import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Leaf, 
  Sparkles, 
  Truck, 
  Wrench,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const categories = [
  { icon: GraduationCap, title: "Tutoring", count: 45 },
  { icon: Leaf, title: "Gardening", count: 32 },
  { icon: Sparkles, title: "Cleaning", count: 28 },
  { icon: Truck, title: "Delivery", count: 19 },
  { icon: Wrench, title: "Handyman", count: 41 },
];

const featuredJobs = [
  {
    id: "1",
    title: "Math Tutor Needed",
    category: "Tutoring",
    location: "Downtown",
    pay: "$20/hour",
    duration: "2-3 hours/week",
    description: "Looking for a patient math tutor for high school algebra. Flexible schedule.",
    postedBy: "Sarah M.",
  },
  {
    id: "2",
    title: "Weekend Garden Maintenance",
    category: "Gardening",
    location: "Suburbs",
    pay: "$50/session",
    duration: "3-4 hours",
    description: "Need help with lawn mowing, weeding, and basic garden maintenance.",
    postedBy: "John D.",
  },
  {
    id: "3",
    title: "House Cleaning Service",
    category: "Cleaning",
    location: "City Center",
    pay: "$30/hour",
    duration: "4 hours",
    description: "Looking for thorough house cleaning service. Bi-weekly basis.",
    postedBy: "Lisa K.",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect with
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}Local Talent{" "}
                </span>
                for Quick Jobs
              </h1>
              <p className="text-lg text-muted-foreground">
                Find skilled workers in your community or discover flexible job opportunities. 
                From tutoring to handyman services, connect locally and earn together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate("/browse")}
                >
                  <Users className="mr-2" />
                  Find Jobs
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/post-job")}
                >
                  Post a Job
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage}
                alt="Community helping each other"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-muted-foreground">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24h</div>
              <div className="text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Find opportunities in various skill areas
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.title} 
                {...category}
                onClick={() => navigate("/browse")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Jobs</h2>
            <p className="text-muted-foreground text-lg">
              Latest opportunities in your area
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/browse")}
            >
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Getting started is easy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Create Profile</h3>
              <p className="text-muted-foreground">
                Sign up and tell us about your skills or what help you need
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-secondary/10">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">2. Connect</h3>
              <p className="text-muted-foreground">
                Browse jobs or get applications from qualified local workers
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-accent/10">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">3. Get It Done</h3>
              <p className="text-muted-foreground">
                Complete the job safely and rate your experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of community members connecting for local jobs. 
            Whether you're looking to earn or need help, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate("/browse")}
            >
              Browse Jobs
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate("/post-job")}
            >
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 LocalSkills4Hire. Connecting communities, one job at a time.</p>
        </div>
      </footer>
    </div>
  );
}
