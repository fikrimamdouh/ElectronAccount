import { Banknote } from "lucide-react";

export default function CashFlow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Banknote className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          حركة النقدية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقرير حركة النقدية التفصيلي
      </p>
    </div>
  );
}
