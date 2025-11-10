import { Receipt } from "lucide-react";

export default function CashReceipts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          سندات القبض
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة سندات القبض النقدية
      </p>
    </div>
  );
}
