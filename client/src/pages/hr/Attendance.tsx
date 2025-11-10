import { Clock } from "lucide-react";

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الحضور والانصراف
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة الحضور والانصراف
      </p>
    </div>
  );
}
