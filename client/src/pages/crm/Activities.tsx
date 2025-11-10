import { Activity } from "lucide-react";

export default function Activities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الأنشطة والاتصالات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تسجيل المكالمات والاجتماعات والمهام
      </p>
    </div>
  );
}
