import { AlertTriangle } from "lucide-react";

export default function RiskIdentification() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تحديد المخاطر
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تحديد وتسجيل المخاطر المحتملة
      </p>
    </div>
  );
}
