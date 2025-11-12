import { ArrowLeftRight } from "lucide-react";

export default function BankReconciliation() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { description: "رصيد الحساب البنكي حسب البيان البنكي", amount: 150000, type: "bank" },
    { description: "إضافة: الإيداعات تحت التحصيل", amount: 10000, type: "adjustment" },
    { description: "خصم: الشيكات المستحقة غير المقدمة", amount: -5000, type: "adjustment" },
    { description: "رصيد الحساب البنكي المعدل", amount: 155000, type: "adjusted" },
    { description: "رصيد الحساب حسب الدفاتر", amount: 160000, type: "book" },
    { description: "خصم: رسوم بنكية غير مسجلة", amount: -3000, type: "adjustment" },
    { description: "إضافة: فوائد بنكية غير مسجلة", amount: 2000, type: "adjustment" },
    { description: "رصيد الحساب حسب الدفاتر المعدل", amount: 159000, type: "adjusted" },
  ];

  // Note: In a real scenario, ensure adjusted balances match for reconciliation

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          التسويات البنكية
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ (ريال)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const amountColor = item.amount >= 0 ? "text-green-600" : "text-red-600";
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${item.type === "adjustment" ? amountColor : "text-gray-500"}`}>
                    {item.amount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}