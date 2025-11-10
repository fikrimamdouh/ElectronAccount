import { PackageCheck } from "lucide-react";

export default function GoodsReceipt() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          استلام البضاعة
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة استلام البضاعة من الموردين
      </p>
    </div>
  );
}
