import { Users } from "lucide-react";

export default function SettingsUsers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          المستخدمين والصلاحيات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة مستخدمي النظام وصلاحياتهم
      </p>
    </div>
  );
}
