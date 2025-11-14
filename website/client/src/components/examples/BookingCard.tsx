import { BookingCard } from "../booking-card";

export default function BookingCardExample() {
  return (
    <div className="p-4 max-w-md">
      <BookingCard
        id="1"
        guestName="Sarah Johnson"
        guestEmail="sarah.j@email.com"
        roomName="Deluxe Suite 301"
        checkIn={new Date("2024-10-15")}
        checkOut={new Date("2024-10-18")}
        status="confirmed"
        totalPrice="450.00"
      />
    </div>
  );
}
