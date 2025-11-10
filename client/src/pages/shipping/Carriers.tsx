import { Truck } from "lucide-react";

export default function Carriers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          شركات الشحن
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: إدارة شركات الشحن والناقلين
      </p>
    </div>
  );
}
