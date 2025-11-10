import { Calendar } from "lucide-react";

export default function MaintenanceSchedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          جدول الصيانة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: جدولة الصيانة الدورية والوقائية
      </p>
    </div>
  );
}
