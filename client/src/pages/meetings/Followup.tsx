import { Clock } from "lucide-react";

export default function MeetingFollowup() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          المتابعة والتنفيذ
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: متابعة تنفيذ قرارات الاجتماعات
      </p>
    </div>
  );
}
