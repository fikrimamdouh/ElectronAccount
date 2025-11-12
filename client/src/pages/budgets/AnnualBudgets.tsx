import { Calculator } from "lucide-react";

export default function AnnualBudgets() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { year: 2023, totalBudget: 1000000, categories: { "المبيعات": 600000, "التسويق": 150000, "الرواتب": 200000, "الإيجار": 50000 } },
    { year: 2024, totalBudget: 1200000, categories: { "المبيعات": 700000, "التسويق": 200000, "الرواتب": 250000, "الإيجار": 50000 } },
    { year: 2025, totalBudget: 1500000, categories: { "المبيعات": 900000, "التسويق": 250000, "الرواتب": 300000, "الإيجار": 50000 } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الميزانيات السنوية
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
                الإجمالي (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تفاصيل الفئات
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
                  {item.totalBudget.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  <ul>
                    {Object.entries(item.categories).map(([cat, amount]) => (
                      <li key={cat}>
                        {cat}: {amount.toLocaleString()} ريال
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