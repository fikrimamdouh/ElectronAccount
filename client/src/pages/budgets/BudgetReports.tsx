import { FileText } from "lucide-react";

export default function BudgetReports() {
  // Sample mock data for demonstration (replace with real data from API or props)
  const data = [
    { year: 2023, budget: 1000000, actual: 950000 },
    { year: 2024, budget: 1200000, actual: 1250000 },
    { year: 2025, budget: 1500000, actual: 1400000 },
  ];

  // Calculate totals
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const totalPercentage = totalBudget !== 0 ? ((totalVariance / totalBudget) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          تقارير الميزانيات
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
                الميزانية المخططة (ريال)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإنفاق الفعلي (ريال)
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
                    {item.year}
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
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                الإجمالي
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalBudget.toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {totalActual.toLocaleString()}
              </td>
              <td className={`px-6 py-3 text-right text-sm font-medium ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalVariance.toLocaleString()}
              </td>
              <td className={`px-6 py-3 text-right text-sm font-medium ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalPercentage}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}