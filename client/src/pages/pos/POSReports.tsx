import { FileBarChart } from "lucide-react";

export default function POSReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileBarChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقارير نقاط البيع
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقارير مبيعات نقاط البيع التفصيلية
      </p>
    </div>
  );
}
