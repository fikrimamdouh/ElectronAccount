import { RotateCcw } from "lucide-react";

export default function ItemMovement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          حركة الأصناف
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقرير حركة الأصناف التفصيلي
      </p>
    </div>
  );
}
