import { Coins } from "lucide-react";

export default function SettingsCurrencies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Coins className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة العملات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة العملات وأسعار الصرف
      </p>
    </div>
  );
}
