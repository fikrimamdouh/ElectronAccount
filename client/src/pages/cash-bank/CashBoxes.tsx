import { useQuery } from "@tanstack/react-query";
import { Loader2, Wallet } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Account } from "@shared/schema";

export default function CashBoxes() {
  // الخطوة 1: جلب البيانات الحقيقية من الخادم باستخدام useQuery
  const {
    data: cashAccounts = [], // اسم المتغير الآن cashAccounts
    isLoading,
    isError,
    error,
  } = useQuery<Account[]>({
    // هذا هو عنوان API الجديد الذي سنقوم بإنشائه في الخادم
    queryKey: ["/api/accounts/cash-boxes"], 
  });

  // الخطوة 2: حساب الرصيد الإجمالي من البيانات الحقيقية
  const totalBalance = cashAccounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الصناديق
        </h1>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رمز الحساب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم الصندوق
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرصيد
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* الخطوة 3: عرض حالات التحميل والخطأ والبيانات */}
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري تحميل بيانات الصناديق...</span>
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-destructive">
                  حدث خطأ أثناء جلب البيانات: {error.message}
                </td>
              </tr>
            )}
            {!isLoading && !isError && cashAccounts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  لم يتم العثور على حسابات صناديق. (تأكد من تعريف حسابات من نوع "أصول" وتصنيف "نقدية")
                </td>
              </tr>
            )}
            {!isLoading && !isError &&
              cashAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-gray-500">
                    {account.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-gray-700">
                    {parseFloat(account.balance).toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {account.isActive ? "نشط" : "موقوف"}
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td className="px-6 py-4 text-right text-sm text-gray-900" colSpan={2}>
                الإجمالي
              </td>
              <td className="px-6 py-4 text-right text-sm font-mono text-gray-900">
                {totalBalance.toLocaleString("ar-SA", { style: "currency", currency: "SAR" })}
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
