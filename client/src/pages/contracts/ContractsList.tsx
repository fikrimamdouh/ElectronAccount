import { FileSignature } from "lucide-react";

export default function ContractsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileSignature className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة العقود
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: عرض وإدارة جميع العقود
      </p>
    </div>
  );
}
