import { RotateCcw } from "lucide-react";

export default function PurchaseReturns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          مرتجعات المشتريات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة مرتجعات المشتريات
      </p>
    </div>
  );
}
