import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  pay: string;
  duration: string;
  description: string;
  postedBy: string;
}

export const JobCard = ({
  id,
  title,
  category,
  location,
  pay,
  duration,
  description,
  postedBy,
}: JobCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 text-secondary font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{pay}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Posted by {postedBy}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="default"
          onClick={() => navigate(`/job/${id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
