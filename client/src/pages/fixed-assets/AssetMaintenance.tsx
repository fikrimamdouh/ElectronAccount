import { Wrench } from "lucide-react";

export default function AssetMaintenance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          صيانة الأصول
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة صيانة الأصول
      </p>
    </div>
  );
}
