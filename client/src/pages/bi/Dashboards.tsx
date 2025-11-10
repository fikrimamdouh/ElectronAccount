import { LayoutDashboard } from "lucide-react";

export default function BIDashboards() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          لوحات التحكم التحليلية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: لوحات تحكم تفاعلية للتحليلات
      </p>
    </div>
  );
}
