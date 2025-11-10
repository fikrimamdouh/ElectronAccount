import { Landmark } from "lucide-react";

export default function BankAccounts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Landmark className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الحسابات البنكية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة الحسابات البنكية
      </p>
    </div>
  );
}
