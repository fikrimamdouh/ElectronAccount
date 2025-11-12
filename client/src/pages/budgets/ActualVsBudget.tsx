import { TrendingUp } from "lucide-react";

export default function ActualVsBudget() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { category: "المبيعات", budget: 500000, actual: 480000 },
    { category: "التسويق", budget: 100000, actual: 120000 },
    { category: "الرواتب", budget: 200000, actual: 195000 },
    { category: "الإيجار", budget: 50000, actual: 50000 },
    { category: "الإجمالي", budget: 850000, actual: 845000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          الفعلي مقابل المخطط
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المخطط (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفعلي (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفرق (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النسبة (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const variance = item.actual - item.budget;
              const percentage = ((variance / item.budget) * 100).toFixed(2);
              const varianceColor = variance >= 0 ? "text-green-600" : "text-red-600";
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.actual.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${varianceColor}`}>
                    {variance.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${varianceColor}`}>
                    {percentage}%
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