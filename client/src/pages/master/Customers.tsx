import { UserPlus } from "lucide-react";

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة بيانات العملاء
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة بيانات العملاء والحسابات المدينة
      </p>
    </div>
  );
}
