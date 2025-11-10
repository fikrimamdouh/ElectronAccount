import { Trophy } from "lucide-react";

export default function LoyaltyTiers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          مستويات العضوية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة مستويات عضوية العملاء
      </p>
    </div>
  );
}
