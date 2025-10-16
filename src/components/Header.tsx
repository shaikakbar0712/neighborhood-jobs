import { Button } from "@/components/ui/button";
import { Briefcase, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            LocalSkills4Hire
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate("/browse")}>
            Browse Jobs
          </Button>
          <Button variant="ghost" onClick={() => navigate("/post-job")}>
            Post a Job
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="hidden sm:flex"
            onClick={() => navigate("/post-job")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Post Job
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
