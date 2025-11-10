import { Package } from "lucide-react";

export default function StockBalance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          أرصدة المخزون
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض أرصدة المخزون الحالية
      </p>
    </div>
  );
}
