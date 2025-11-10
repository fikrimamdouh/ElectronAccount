import { PackageX } from "lucide-react";

export default function AssetDisposal() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageX className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          استبعاد الأصول
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: استبعاد أو بيع الأصول
      </p>
    </div>
  );
}
