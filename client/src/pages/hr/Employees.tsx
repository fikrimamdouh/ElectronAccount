import { UserCircle } from "lucide-react";

export default function Employees() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          بيانات الموظفين
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة بيانات الموظفين
      </p>
    </div>
  );
}
