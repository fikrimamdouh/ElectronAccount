import { Target } from "lucide-react";

export default function KPIs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          مؤشرات الأداء الرئيسية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تتبع مؤشرات الأداء KPIs
      </p>
    </div>
  );
}
