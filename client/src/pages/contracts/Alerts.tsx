import { MessageSquare } from "lucide-react";

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تنبيهات العقود
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تنبيهات انتهاء وتجديد العقود
      </p>
    </div>
  );
}
