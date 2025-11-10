import { FileOutput } from "lucide-react";

export default function SalesCustomerStatement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileOutput className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          كشف حساب عميل
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: كشف حساب تفصيلي للعميل
      </p>
    </div>
  );
}
