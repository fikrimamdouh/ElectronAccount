import { Shield } from "lucide-react";

export default function RiskMitigation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          خطط المعالجة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: وضع خطط معالجة المخاطر
      </p>
    </div>
  );
}
