import { Award } from "lucide-react";

export default function QualityControl() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          مراقبة الجودة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: مراقبة جودة الإنتاج
      </p>
    </div>
  );
}
