import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// سنقوم بتعريف هذا النوع لاحقاً في shared/schema.ts
type ReconciliationData = {
  description: string;
  amount: number;
  type: "bank" | "book" | "adjustment" | "adjusted";
};

export default function BankReconciliation() {
  // الخطوة 1: الاستعداد لجلب البيانات الحقيقية من الخادم
  const {
    data: reconciliationData = [], // اسم المتغير الآن reconciliationData
    isLoading,
    isError,
    error,
  } = useQuery<ReconciliationData[]>({
    // هذا هو عنوان API الذي سنقوم بإنشائه لاحقاً
    // queryKey يعتمد على معرف التسوية، لذا سنعطله الآن
    queryKey: ["/api/reconciliations", "some-reconciliation-id"], 
    enabled: false, // تعطيل الجلب التلقائي حالياً لأن الواجهة الخلفية غير جاهزة
  });

  // استخدام البيانات الوهمية مؤقتاً طالما لا توجد بيانات حقيقية
  const displayData = isLoading || reconciliationData.length === 0 ? [
    { description: "رصيد الحساب البنكي حسب البيان البنكي", amount: 0, type: "bank" },
    { description: "رصيد الحساب حسب الدفاتر", amount: 0, type: "book" },
  ] : reconciliationData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          التسويات البنكية
        </h1>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* الخطوة 2: عرض حالات التحميل والخطأ والبيانات */}
            {isLoading && (
              <tr>
                <td colSpan={2} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري تحميل بيانات التسوية...</span>
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={2} className="text-center py-10 text-destructive">
                  حدث خطأ أثناء جلب البيانات: {error.message}
                </td>
              </tr>
            )}
            {!isLoading &&
              displayData.map((item, index) => {
                const amountColor = item.amount >= 0 ? "text-green-600" : "text-red-600";
                const isBold = item.type === "adjusted" || item.type === "bank" || item.type === "book";
                return (
                  <tr key={index} className={isBold ? "bg-gray-50" : ""}>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${isBold ? "font-bold text-gray-800" : "text-gray-600"}`}>
                      {item.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-mono ${isBold ? "font-bold" : ""} ${item.type === "adjustment" ? amountColor : "text-gray-800"}`}>
                      {item.amount.toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="text-center text-muted-foreground p-4 border rounded-lg">
        ميزة التسويات البنكية قيد التطوير. الواجهة جاهزة للتكامل مع الواجهة الخلفية (API).
      </div>
    </div>
  );
}
