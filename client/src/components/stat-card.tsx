import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: any;
  trend?: "up" | "down";
}

export function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend === "up" ? "text-chart-3" : trend === "down" ? "text-chart-5" : ""}>
              {change}
            </span>{" "}
            vs last week
          </p>
        )}
      </CardContent>
    </Card>
  );
}
