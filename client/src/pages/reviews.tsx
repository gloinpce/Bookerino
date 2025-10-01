import { ReviewCard } from "@/components/review-card";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Reviews() {
  const mockReviews = [
    {
      id: "1",
      guestName: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely wonderful stay! The room was spotless, staff was incredibly friendly, and the location was perfect. Would definitely recommend to anyone visiting.",
      response: "Thank you for your wonderful review, Sarah! We're delighted you enjoyed your stay.",
      createdAt: new Date("2024-09-28"),
    },
    {
      id: "2",
      guestName: "Michael Chen",
      rating: 4,
      comment: "Great hotel with excellent amenities. The breakfast buffet was fantastic. Only minor issue was the Wi-Fi speed in the room.",
      createdAt: new Date("2024-09-25"),
    },
    {
      id: "3",
      guestName: "Emma Williams",
      rating: 5,
      comment: "Exceeded all expectations! The suite was luxurious, and the view was breathtaking. The concierge team went above and beyond.",
      response: "We're thrilled to hear about your exceptional experience, Emma! Thank you for choosing us.",
      createdAt: new Date("2024-09-22"),
    },
    {
      id: "4",
      guestName: "David Martinez",
      rating: 3,
      comment: "Decent stay overall. The room was clean but could use some updating. Service was good, though the check-in process took longer than expected.",
      createdAt: new Date("2024-09-20"),
    },
    {
      id: "5",
      guestName: "Jennifer Lee",
      rating: 5,
      comment: "Perfect for a business trip! Great workspace in the room, fast internet, and the business center was well-equipped.",
      createdAt: new Date("2024-09-18"),
    },
  ];

  const averageRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground">Manage guest feedback and responses</p>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
            <Star className="h-5 w-5 fill-chart-4 text-chart-4" />
            <span className="text-2xl font-bold" data-testid="text-average-rating">{averageRating}</span>
            <span className="text-sm text-muted-foreground">({mockReviews.length} reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              className="pl-9"
              data-testid="input-search-reviews"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]" data-testid="select-rating-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
