import { Folder } from "lucide-react";

export default function DocumentCategories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Folder className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تصنيف المستندات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تنظيم المستندات في فئات
      </p>
    </div>
  );
}
