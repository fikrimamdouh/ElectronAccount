import { Wallet } from "lucide-react";

export default function AccountBalances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          أرصدة الحسابات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض أرصدة الحسابات البنكية والصناديق
      </p>
    </div>
  );
}
