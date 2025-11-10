import { Banknote } from "lucide-react";

export default function Payroll() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Banknote className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الرواتب
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة رواتب الموظفين
      </p>
    </div>
  );
}
