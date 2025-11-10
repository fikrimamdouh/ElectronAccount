import { Banknote } from "lucide-react";

export default function CashFlowStatement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Banknote className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          قائمة التدفقات النقدية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: قائمة التدفقات النقدية - التدفقات التشغيلية والاستثمارية والتمويلية
      </p>
    </div>
  );
}
