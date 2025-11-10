import { ClipboardCheck } from "lucide-react";

export default function Inspections() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الفحوصات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إجراء فحوصات الجودة وتسجيل النتائج
      </p>
    </div>
  );
}
