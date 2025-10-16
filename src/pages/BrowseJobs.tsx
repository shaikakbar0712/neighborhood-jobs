import { useState } from "react";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock data
const mockJobs = [
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
    description: "Need help with lawn mowing, weeding, and basic garden maintenance every weekend.",
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
  {
    id: "4",
    title: "Package Delivery Helper",
    category: "Delivery",
    location: "Various",
    pay: "$15/delivery",
    duration: "Flexible",
    description: "Need reliable person for local package deliveries. Own transport preferred.",
    postedBy: "Mike's Store",
  },
  {
    id: "5",
    title: "Guitar Lessons",
    category: "Tutoring",
    location: "Eastside",
    pay: "$25/hour",
    duration: "1 hour/week",
    description: "Beginner looking for guitar lessons. Acoustic guitar, basic chords and songs.",
    postedBy: "Tom R.",
  },
  {
    id: "6",
    title: "Furniture Assembly",
    category: "Handyman",
    location: "Northside",
    pay: "$40/job",
    duration: "2 hours",
    description: "Need help assembling IKEA furniture. Tools will be provided.",
    postedBy: "Emma S.",
  },
];

export default function BrowseJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">Find the perfect opportunity in your community</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Tutoring">Tutoring</SelectItem>
              <SelectItem value="Gardening">Gardening</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Handyman">Handyman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
