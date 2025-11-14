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
    <Card className="bg-card-gradient border-card-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-200" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            <span className={trend === "up" ? "text-chart-3" : trend === "down" ? "text-chart-5" : ""}>
              {change}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
