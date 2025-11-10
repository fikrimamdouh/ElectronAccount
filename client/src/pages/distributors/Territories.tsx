import { MapPin } from "lucide-react";

export default function Territories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          المناطق الجغرافية
        </h1>
      </div>
      <p className="text-muted-foreground">
        قريباً: تحديد مناطق عمل الوكلاء
      </p>
    </div>
  );
}
