import { FolderKanban } from "lucide-react";

export default function ProjectsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderKanban className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة المشاريع
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض وإدارة جميع المشاريع
      </p>
    </div>
  );
}
