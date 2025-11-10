import { Scale } from "lucide-react";

export default function RiskAssessment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقييم المخاطر
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تقييم وتحليل مستوى المخاطر
      </p>
    </div>
  );
}
