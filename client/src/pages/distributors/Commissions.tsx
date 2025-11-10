import { DollarSign } from "lucide-react";

export default function Commissions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          العمولات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: حساب وإدارة عمولات الوكلاء
      </p>
    </div>
  );
}
