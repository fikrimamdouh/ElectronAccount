import { LineChart } from "lucide-react";

export default function Forecasts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          التنبؤات المالية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: التنبؤ بالأداء المالي المستقبلي
      </p>
    </div>
  );
}
