import { Star } from "lucide-react";

export default function LoyaltyPoints() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          النقاط والمكافآت
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة نقاط العملاء والمكافآت
      </p>
    </div>
  );
}
