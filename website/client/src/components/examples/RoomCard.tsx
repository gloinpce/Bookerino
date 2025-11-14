import { RoomCard } from "../room-card";

export default function RoomCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <RoomCard
        id="1"
        name="Deluxe Suite 301"
        type="Deluxe Suite"
        capacity={2}
        price="150"
        status="available"
      />
    </div>
  );
}
