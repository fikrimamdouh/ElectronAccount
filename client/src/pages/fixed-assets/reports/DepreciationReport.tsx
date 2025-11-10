import { TrendingDown } from "lucide-react";

export default function DepreciationReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingDown className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقرير الإهلاك
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقرير إهلاك الأصول
      </p>
    </div>
  );
}
