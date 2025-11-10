import { BookOpen } from "lucide-react";

export default function ChartOfAccounts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          دليل الحسابات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض وإدارة دليل الحسابات الكامل
      </p>
    </div>
  );
}
