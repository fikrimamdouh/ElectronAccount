import { ArrowRightLeft } from "lucide-react";

export default function TransferBalances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          ترحيل الأرصدة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: ترحيل الأرصدة للفترة المالية الجديدة
      </p>
    </div>
  );
}
