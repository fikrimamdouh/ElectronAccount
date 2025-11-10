import { XCircle } from "lucide-react";

export default function NonConformance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <XCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          عدم المطابقة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تسجيل ومعالجة حالات عدم المطابقة
      </p>
    </div>
  );
}
