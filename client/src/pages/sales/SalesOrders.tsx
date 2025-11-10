import { ShoppingBag } from "lucide-react";

export default function SalesOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          أوامر البيع
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة أوامر البيع والطلبات
      </p>
    </div>
  );
}
