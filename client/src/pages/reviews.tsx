import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Review } from "@shared/schema";
import { ReviewCard } from "@/components/review-card";
import { ReviewResponseDialog } from "@/components/review-response-dialog";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Reviews() {
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const { toast } = useToast();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Succes",
        description: "Recenzia a fost ștearsă cu succes",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge recenzia",
        variant: "destructive",
      });
    },
  });

  const handleRespond = (review: Review) => {
    setSelectedReview(review);
    setResponseDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sigur vrei să ștergi această recenzie?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch =
      searchQuery === "" ||
      review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex-1 overflow-auto" data-scroll-container>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Recenzii</h1>
            <p className="text-muted-foreground">Monitorizează și răspunde la feedback-ul oaspeților</p>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
            <Star className="h-5 w-5 fill-chart-4 text-chart-4" />
            <span className="text-2xl font-bold" data-testid="text-average-rating">{averageRating}</span>
            <span className="text-sm text-muted-foreground">( {reviews?.length || 0} recenzii )</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută recenzii..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-reviews"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-rating-filter">
              <SelectValue placeholder="Filtrare rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate ratingurile</SelectItem>
              <SelectItem value="5">5 Stele</SelectItem>
              <SelectItem value="4">4 Stele</SelectItem>
              <SelectItem value="3">3 Stele</SelectItem>
              <SelectItem value="2">2 Stele</SelectItem>
              <SelectItem value="1">1 Stea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[250px] rounded-lg" data-testid={`skeleton-review-${i}`} />
            ))}
          </div>
        ) : filteredReviews && filteredReviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                guestName={review.guestName}
                rating={review.rating}
                comment={review.comment}
                response={review.response}
                createdAt={new Date(review.createdAt)}
                onRespond={() => handleRespond(review)}
                onDelete={() => handleDelete(review.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-no-reviews">
            <p className="text-muted-foreground">
              {searchQuery || ratingFilter !== "all"
                ? "Nu s-au găsit recenzii care să corespundă filtrelor"
                : "Nu există recenzii încă."}
            </p>
          </div>
        )}
      </div>

      <ReviewResponseDialog
        open={responseDialogOpen}
        onOpenChange={setResponseDialogOpen}
        review={selectedReview}
      />
    </div>
  );
}
