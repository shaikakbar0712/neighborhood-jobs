import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  onClick?: () => void;
}

export const CategoryCard = ({ icon: Icon, title, count, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{count} jobs available</p>
      </CardContent>
    </Card>
  );
};
