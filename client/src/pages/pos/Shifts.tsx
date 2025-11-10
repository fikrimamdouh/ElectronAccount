import { Clock } from "lucide-react";

export default function Shifts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة الورديات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة ورديات العمل والمناوبات
      </p>
    </div>
  );
}
