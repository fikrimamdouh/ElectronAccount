import { Download } from "lucide-react";

export default function DataExport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Download className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تصدير البيانات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تصدير البيانات بصيغ متعددة
      </p>
    </div>
  );
}
