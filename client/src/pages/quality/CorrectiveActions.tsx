import { Tool } from "lucide-react";

export default function CorrectiveActions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tool className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الإجراءات التصحيحية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة الإجراءات التصحيحية والوقائية
      </p>
    </div>
  );
}
