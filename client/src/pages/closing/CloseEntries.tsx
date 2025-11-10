import { Lock } from "lucide-react";

export default function CloseEntries() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إقفال القيود
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إقفال قيود نهاية الفترة المالية
      </p>
    </div>
  );
}
