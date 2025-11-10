import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrialBalanceRow } from "@shared/schema";

export default function TrialBalance() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trialBalance, isLoading } = useQuery<TrialBalanceRow[]>({
    queryKey: ["/api/trial-balance"],
  });

  const filteredData = trialBalance?.filter(
    (row) =>
      row.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.accountCode.includes(searchQuery)
  );

  const totals = filteredData?.reduce(
    (acc, row) => ({
      debit: acc.debit + Number(row.debit),
      credit: acc.credit + Number(row.credit),
    }),
    { debit: 0, credit: 0 }
  );

  return (
    <div className="p-8 space-y-6" data-testid="page-trial-balance">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            ميزان المراجعة
          </h1>
          <p className="text-muted-foreground">
            عرض شامل لجميع الحسابات وأرصدتها
          </p>
        </div>
        <Button variant="outline" data-testid="button-export">
          <Download className="w-5 h-5 ml-2" />
          تصدير
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="البحث في الحسابات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            data-testid="input-search-trial-balance"
          />
        </div>
      </Card>

      {/* Trial Balance Table */}
      {isLoading ? (
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="text-right p-4 font-medium">رمز الحساب</th>
                  <th className="text-right p-4 font-medium">اسم الحساب</th>
                  <th className="text-right p-4 font-medium">نوع الحساب</th>
                  <th className="text-right p-4 font-medium">مدين</th>
                  <th className="text-right p-4 font-medium">دائن</th>
                  <th className="text-right p-4 font-medium">الرصيد</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr
                      key={row.accountId}
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                      data-testid={`row-trial-balance-${row.accountId}`}
                    >
                      <td className="p-4 font-mono" data-testid="text-account-code">
                        {row.accountCode}
                      </td>
                      <td className="p-4" data-testid="text-account-name">
                        {row.accountName}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {row.accountType}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-medium" data-testid="text-debit">
                        {Number(row.debit) > 0 ? `${row.debit} ريال` : "-"}
                      </td>
                      <td className="p-4 font-mono font-medium" data-testid="text-credit">
                        {Number(row.credit) > 0 ? `${row.credit} ريال` : "-"}
                      </td>
                      <td className="p-4 font-mono font-bold" data-testid="text-balance">
                        {row.balance} ريال
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      لا توجد بيانات لعرضها
                    </td>
                  </tr>
                )}
                {filteredData && filteredData.length > 0 && (
                  <tr className="bg-primary/10 font-bold border-t-2 border-primary">
                    <td colSpan={3} className="p-4 text-lg">
                      الإجمالي
                    </td>
                    <td className="p-4 font-mono text-lg" data-testid="text-total-debit">
                      {totals?.debit.toFixed(2)} ريال
                    </td>
                    <td className="p-4 font-mono text-lg" data-testid="text-total-credit">
                      {totals?.credit.toFixed(2)} ريال
                    </td>
                    <td className="p-4"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Balance Check */}
      {totals && (
        <Card className={`p-4 ${
          totals.debit === totals.credit
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-red-500 bg-red-50 dark:bg-red-950/20"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {totals.debit === totals.credit
                ? "✓ الميزان متوازن - المدين يساوي الدائن"
                : "⚠ الميزان غير متوازن - يوجد فرق في الأرصدة"}
            </span>
            {totals.debit !== totals.credit && (
              <span className="font-mono font-bold text-red-600">
                الفرق: {Math.abs(totals.debit - totals.credit).toFixed(2)} ريال
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
