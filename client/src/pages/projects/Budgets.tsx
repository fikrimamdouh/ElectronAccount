import { Calculator } from "lucide-react";

export default function Budgets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          ميزانيات المشاريع
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة ميزانيات المشاريع
      </p>
    </div>
  );
}
