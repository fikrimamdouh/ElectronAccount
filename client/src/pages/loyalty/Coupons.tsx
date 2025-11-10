import { Ticket } from "lucide-react";

export default function Coupons() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الكوبونات والعروض
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة الكوبونات والعروض الترويجية
      </p>
    </div>
  );
}
