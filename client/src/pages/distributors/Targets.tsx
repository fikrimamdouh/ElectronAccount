import { Target } from "lucide-react";

export default function DistributorTargets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الحصص والأهداف
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تحديد أهداف المبيعات للوكلاء
      </p>
    </div>
  );
}
