import { ArrowLeftRight } from "lucide-react";

export default function Movements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          حركات المخزون
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تتبع حركات المخزون والتحويلات
      </p>
    </div>
  );
}
