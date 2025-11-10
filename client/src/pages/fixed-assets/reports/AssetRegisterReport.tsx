import { FileSpreadsheet } from "lucide-react";

export default function AssetRegisterReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          سجل الأصول
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: سجل الأصول الكامل
      </p>
    </div>
  );
}
