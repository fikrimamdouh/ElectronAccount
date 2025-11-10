import { FileCheck } from "lucide-react";

export default function DailyInvoices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الفواتير اليومية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض جميع فواتير المبيعات اليومية
      </p>
    </div>
  );
}
