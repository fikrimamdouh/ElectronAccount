import { ClipboardList } from "lucide-react";

export default function PurchaseOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          طلبات الشراء
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة طلبات الشراء
      </p>
    </div>
  );
}
