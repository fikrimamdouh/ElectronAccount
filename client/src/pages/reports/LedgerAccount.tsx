import { FileText } from "lucide-react";

export default function LedgerAccount() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          كشف حساب أستاذ
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض كشف حساب أستاذ تفصيلي
      </p>
    </div>
  );
}
