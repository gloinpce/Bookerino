import { useQuery } from "@tanstack/react-query";
import { type Room, type Booking, type Review } from "@shared/schema";
import { StatCard } from "@/components/stat-card";
import { BookingCard } from "@/components/booking-card";
import { Calendar, DollarSign, Hotel, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const isLoading = roomsLoading || bookingsLoading || reviewsLoading;

  const roomsList = rooms ?? [];
  const bookingsList = bookings ?? [];
  const reviewsList = reviews ?? [];

  const getRoomName = (roomId: string) => {
    return roomsList.find((r) => r.id === roomId)?.name || "Camera necunoscută";
  };

  const stats = {
    totalBookings: bookingsList.length,
    availableRooms: roomsList.filter((r) => r.status === "available").length,
    totalRooms: roomsList.length,
    revenue: bookingsList
      .reduce((sum, b) => {
        const price = parseFloat(b.totalPrice || "0");
        return sum + (Number.isFinite(price) ? price : 0);
      }, 0)
      .toFixed(2),
    averageRating: reviewsList.length > 0
      ? (reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsList.length).toFixed(1)
      : "0.0",
    totalReviews: reviewsList.length,
  };

  const recentBookings = [...bookingsList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const recentReviews = [...reviewsList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Panou de Control</h1>
          <p className="text-muted-foreground">Bine ai venit la sistemul de management hotelier</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[120px]" data-testid="skeleton-stat-0" />
              <Skeleton className="h-[120px]" data-testid="skeleton-stat-1" />
              <Skeleton className="h-[120px]" data-testid="skeleton-stat-2" />
              <Skeleton className="h-[120px]" data-testid="skeleton-stat-3" />
            </>
          ) : (
            <>
              <StatCard
                title="Total Rezervări"
                value={stats.totalBookings}
                change={`${stats.totalBookings} rezervări active`}
                icon={Calendar}
              />
              <StatCard
                title="Camere Disponibile"
                value={stats.availableRooms}
                change={`Din ${stats.totalRooms} camere totale`}
                icon={Hotel}
              />
              <StatCard
                title="Venit Total"
                value={`${stats.revenue} RON`}
                change="Din toate rezervările"
                icon={DollarSign}
              />
              <StatCard
                title="Rating Mediu"
                value={stats.averageRating}
                change={`Pe baza a ${stats.totalReviews} recenzii`}
                icon={Star}
              />
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rezervări Recente</CardTitle>
                <CardDescription>Ultimele tale rezervări</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingsLoading ? (
                  <>
                    <Skeleton className="h-[150px]" data-testid="skeleton-booking-0" />
                    <Skeleton className="h-[150px]" data-testid="skeleton-booking-1" />
                    <Skeleton className="h-[150px]" data-testid="skeleton-booking-2" />
                  </>
                ) : recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      id={booking.id}
                      guestName={booking.guestName}
                      guestEmail={booking.guestEmail}
                      roomName={getRoomName(booking.roomId)}
                      checkIn={new Date(booking.checkIn)}
                      checkOut={new Date(booking.checkOut)}
                      status={booking.status as "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled"}
                      totalPrice={booking.totalPrice}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-bookings">
                    Nu există rezervări încă
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recenzii Recente</CardTitle>
              <CardDescription>Ultimele feedback-uri de la oaspeți</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewsLoading ? (
                <>
                  <Skeleton className="h-[60px]" data-testid="skeleton-review-0" />
                  <Skeleton className="h-[60px]" data-testid="skeleton-review-1" />
                  <Skeleton className="h-[60px]" data-testid="skeleton-review-2" />
                </>
              ) : recentReviews.length > 0 ? (
                recentReviews.map((review) => {
                  const reviewDate = review.createdAt ? new Date(review.createdAt) : new Date();
                  return (
                    <div
                      key={review.id}
                      className="flex items-center justify-between pb-3 border-b last:border-0"
                      data-testid={`review-item-${review.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{review.guestName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < (review.rating || 0)
                                  ? "fill-chart-4 text-chart-4"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(reviewDate, "MMM d")}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-reviews">
                  Nu există recenzii încă
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
