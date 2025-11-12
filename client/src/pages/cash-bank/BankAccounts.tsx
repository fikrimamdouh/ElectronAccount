import { Landmark } from "lucide-react";

export default function BankAccounts() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { bank: "البنك الأهلي السعودي", accountNumber: "SA12345678901234567890", balance: 150000, currency: "ريال" },
    { bank: "بنك الرياض", accountNumber: "SA09876543210987654321", balance: 250000, currency: "ريال" },
    { bank: "البنك السعودي الفرنسي", accountNumber: "SA11223344556677889900", balance: 100000, currency: "ريال" },
    { bank: "بنك ساب", accountNumber: "SA55443322110099887766", balance: 50000, currency: "ريال" },
  ];

  // Calculate total balance
  const totalBalance = data.reduce((sum, item) => sum + item.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Landmark className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الحسابات البنكية
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البنك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الحساب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرصيد (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العملة
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {item.bank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.accountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.currency}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900" colSpan={2}>
                الإجمالي
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalBalance.toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                ريال
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}