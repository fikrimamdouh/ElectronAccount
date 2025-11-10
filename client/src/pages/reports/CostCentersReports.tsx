import { Target } from "lucide-react";

export default function CostCentersReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقارير مراكز التكلفة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض تقارير مراكز التكلفة التفصيلية
      </p>
    </div>
  );
}
