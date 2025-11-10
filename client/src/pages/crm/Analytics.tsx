import { BarChart3 } from "lucide-react";

export default function CRMAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تحليلات العملاء
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تحليل سلوك العملاء وأداء المبيعات
      </p>
    </div>
  );
}
