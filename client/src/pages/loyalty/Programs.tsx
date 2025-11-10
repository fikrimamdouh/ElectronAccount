import { Gift } from "lucide-react";

export default function LoyaltyPrograms() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gift className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          برامج الولاء
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة برامج الولاء والمكافآت
      </p>
    </div>
  );
}
