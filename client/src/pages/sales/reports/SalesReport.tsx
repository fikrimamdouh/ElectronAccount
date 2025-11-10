import { TrendingUp } from "lucide-react";

export default function SalesReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقرير المبيعات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقرير المبيعات التفصيلي
      </p>
    </div>
  );
}
