import { Factory } from "lucide-react";

export default function ProductionLines() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Factory className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          خطوط الإنتاج
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة خطوط الإنتاج والمراحل
      </p>
    </div>
  );
}
