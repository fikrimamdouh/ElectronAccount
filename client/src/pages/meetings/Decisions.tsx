import { CheckCircle } from "lucide-react";

export default function MeetingDecisions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          القرارات والتوصيات
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: متابعة قرارات وتوصيات الاجتماعات
      </p>
    </div>
  );
}
