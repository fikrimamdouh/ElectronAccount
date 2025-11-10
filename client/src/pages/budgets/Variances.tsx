import { AlertTriangle } from "lucide-react";

export default function Variances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تحليل الانحرافات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تحليل الفروقات بين الفعلي والمخطط
      </p>
    </div>
  );
}
