import { StatCard } from "../stat-card";
import { Calendar } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <StatCard
        title="Total Bookings"
        value="124"
        change="↑ 12%"
        icon={Calendar}
        trend="up"
      />
    </div>
  );
}
