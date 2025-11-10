import { Building2 } from "lucide-react";

export default function SettingsBranches() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة الفروع
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة فروع الشركة
      </p>
    </div>
  );
}
