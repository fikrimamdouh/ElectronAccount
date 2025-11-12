import { LineChart } from "lucide-react";

export default function Forecasts() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { year: 2026, revenue: 1500000, expenses: 1200000, profit: 300000 },
    { year: 2027, revenue: 1800000, expenses: 1400000, profit: 400000 },
    { year: 2028, revenue: 2100000, expenses: 1600000, profit: 500000 },
  ];

  // Calculate totals
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          التنبؤات المالية
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السنة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإيرادات المتوقعة (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المصروفات المتوقعة (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الربح المتوقع (ريال)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {item.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.expenses.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.profit.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                الإجمالي
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalRevenue.toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalExpenses.toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalProfit.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}