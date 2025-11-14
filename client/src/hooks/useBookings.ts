import { useQuery } from "@tanstack/react-query";
import { type Booking } from "@shared/schema";

export function useBookings() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  return {
    bookings: bookings ?? [],
    isLoading,
  };
}

