import { FolderOpen } from "lucide-react";

export default function DocumentStorage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تخزين المستندات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تخزين وإدارة المستندات الإلكترونية
      </p>
    </div>
  );
}
