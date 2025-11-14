import { ReviewCard } from "../review-card";

export default function ReviewCardExample() {
  return (
    <div className="p-4 max-w-md">
      <ReviewCard
        id="1"
        guestName="Sarah Johnson"
        rating={5}
        comment="Absolutely wonderful stay! The room was spotless, staff was incredibly friendly, and the location was perfect."
        response="Thank you for your wonderful review, Sarah!"
        createdAt={new Date("2024-09-28")}
      />
    </div>
  );
}
