import { Eye } from "lucide-react";

export default function RiskMonitoring() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          المتابعة والرصد
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: متابعة ورصد المخاطر وخطط المعالجة
      </p>
    </div>
  );
}
