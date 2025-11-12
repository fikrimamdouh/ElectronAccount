import { useQuery } from "@tanstack/react-query";
import { Calculator, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// سنقوم بتعريف هذا النوع لاحقاً في shared/schema.ts
type AnnualBudgetData = {
  year: number;
  totalBudget: number;
  categories: Record<string, number>;
};

export default function AnnualBudgets() {
  // الخطوة 1: جلب البيانات الحقيقية من الخادم
  const {
    data: annualBudgets = [],
    isLoading,
    isError,
    error,
  } = useQuery<AnnualBudgetData[]>({
    // هذا هو عنوان API الذي سنقوم بإنشائه لاحقاً
    queryKey: ["/api/budgets/annual-summary"], 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            الميزانيات السنوية
          </h1>
        </div>
        {/* يمكن إضافة زر "إضافة ميزانية جديدة" هنا لاحقاً */}
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السنة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجمالي الميزانية
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تفاصيل الفئات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* الخطوة 2: عرض حالات التحميل والخطأ والبيانات */}
            {isLoading && (
              <tr>
                <td colSpan={3} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري تحميل الميزانيات...</span>
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-destructive">
                  حدث خطأ أثناء جلب البيانات: {error.message}
                </td>
              </tr>
            )}
            {!isLoading && !isError && annualBudgets.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-muted-foreground">
                  لم يتم إدخال أي ميزانيات سنوية بعد.
                </td>
              </tr>
            )}
            {!isLoading && !isError &&
              annualBudgets.map((item) => (
                <tr key={item.year}>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-gray-700">
                    {item.totalBudget.toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    <ul className="space-y-1">
                      {Object.entries(item.categories).map(([cat, amount]) => (
                        <li key={cat}>
                          <span className="font-medium text-gray-700">{cat}:</span>{" "}
                          {amount.toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
