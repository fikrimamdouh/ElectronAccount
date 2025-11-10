import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({ title, value, icon, trend, color = "bg-primary" }: StatCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={`card-stat-${title.replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2" data-testid="text-stat-title">
            {title}
          </p>
          <p className="text-3xl font-bold font-mono" data-testid="text-stat-value">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <ArrowUpIcon className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                data-testid="text-stat-trend"
              >
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`} data-testid="icon-stat">
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
