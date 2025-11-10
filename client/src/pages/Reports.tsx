import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import type { IncomeStatementData, BalanceSheetData } from "@shared/schema";

export default function Reports() {
  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);

  const { data: incomeStatement, isLoading: isLoadingIncome } = useQuery<IncomeStatementData>({
    queryKey: ["/api/reports/income-statement", dateFrom, dateTo],
  });

  const { data: balanceSheet, isLoading: isLoadingBalance } = useQuery<BalanceSheetData>({
    queryKey: ["/api/reports/balance-sheet", dateTo],
  });

  return (
    <div className="p-8 space-y-6" data-testid="page-reports">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            التقارير المالية
          </h1>
          <p className="text-muted-foreground">
            قائمة الدخل والميزانية العمومية
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">من تاريخ</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              data-testid="input-date-from"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">إلى تاريخ</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              data-testid="input-date-to"
            />
          </div>
          <Button variant="outline" data-testid="button-export-report">
            <Download className="w-5 h-5 me-2" />
            تصدير PDF
          </Button>
        </div>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="income" data-testid="tab-income-statement">
            <TrendingUp className="w-4 h-4 me-2" />
            قائمة الدخل
          </TabsTrigger>
          <TabsTrigger value="balance" data-testid="tab-balance-sheet">
            <FileText className="w-4 h-4 me-2" />
            الميزانية العمومية
          </TabsTrigger>
        </TabsList>

        {/* Income Statement */}
        <TabsContent value="income">
          {isLoadingIncome ? (
            <div className="h-96 bg-muted rounded animate-pulse"></div>
          ) : (
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" data-testid="text-income-statement-title">
                  قائمة الدخل
                </h2>
                <p className="text-muted-foreground">
                  من {new Date(dateFrom).toLocaleDateString("ar-SA")} إلى{" "}
                  {new Date(dateTo).toLocaleDateString("ar-SA")}
                </p>
              </div>

              {/* Revenues */}
              <div className="mb-8">
                <div className="bg-green-100 dark:bg-green-950/20 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    الإيرادات
                  </h3>
                </div>
                <div className="space-y-2 mb-4">
                  {incomeStatement?.revenues && incomeStatement.revenues.length > 0 ? (
                    incomeStatement.revenues.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 hover-elevate rounded"
                        data-testid={`revenue-item-${index}`}
                      >
                        <span>{item.accountName}</span>
                        <span className="font-mono font-medium">{item.amount} ريال</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">لا توجد إيرادات</p>
                  )}
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg font-bold">
                  <span>إجمالي الإيرادات</span>
                  <span className="font-mono text-green-600" data-testid="text-total-revenues">
                    {incomeStatement?.totalRevenues || "0"} ريال
                  </span>
                </div>
              </div>

              {/* Expenses */}
              <div className="mb-8">
                <div className="bg-red-100 dark:bg-red-950/20 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    المصروفات
                  </h3>
                </div>
                <div className="space-y-2 mb-4">
                  {incomeStatement?.expenses && incomeStatement.expenses.length > 0 ? (
                    incomeStatement.expenses.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 hover-elevate rounded"
                        data-testid={`expense-item-${index}`}
                      >
                        <span>{item.accountName}</span>
                        <span className="font-mono font-medium">{item.amount} ريال</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">لا توجد مصروفات</p>
                  )}
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg font-bold">
                  <span>إجمالي المصروفات</span>
                  <span className="font-mono text-red-600" data-testid="text-total-expenses">
                    {incomeStatement?.totalExpenses || "0"} ريال
                  </span>
                </div>
              </div>

              {/* Net Income */}
              <div
                className={`p-6 rounded-lg text-center ${
                  Number(incomeStatement?.netIncome || 0) >= 0
                    ? "bg-green-100 dark:bg-green-950/20 border-2 border-green-500"
                    : "bg-red-100 dark:bg-red-950/20 border-2 border-red-500"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">
                  {Number(incomeStatement?.netIncome || 0) >= 0 ? "صافي الربح" : "صافي الخسارة"}
                </h3>
                <p
                  className={`text-4xl font-bold font-mono ${
                    Number(incomeStatement?.netIncome || 0) >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                  data-testid="text-net-income"
                >
                  {incomeStatement?.netIncome || "0"} ريال
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance">
          {isLoadingBalance ? (
            <div className="h-96 bg-muted rounded animate-pulse"></div>
          ) : (
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" data-testid="text-balance-sheet-title">
                  الميزانية العمومية
                </h2>
                <p className="text-muted-foreground">
                  كما في {new Date(dateTo).toLocaleDateString("ar-SA")}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Assets */}
                <div>
                  <div className="bg-blue-100 dark:bg-blue-950/20 p-4 rounded-lg mb-4">
                    <h3 className="text-xl font-bold">الأصول</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    {balanceSheet?.assets && balanceSheet.assets.length > 0 ? (
                      balanceSheet.assets.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between p-3 hover-elevate rounded"
                          data-testid={`asset-item-${index}`}
                        >
                          <span>{item.accountName}</span>
                          <span className="font-mono font-medium">{item.amount} ريال</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">لا توجد أصول</p>
                    )}
                  </div>
                  <div className="flex justify-between p-4 bg-muted rounded-lg font-bold">
                    <span>إجمالي الأصول</span>
                    <span className="font-mono" data-testid="text-total-assets">
                      {balanceSheet?.totalAssets || "0"} ريال
                    </span>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  {/* Liabilities */}
                  <div className="mb-6">
                    <div className="bg-orange-100 dark:bg-orange-950/20 p-4 rounded-lg mb-4">
                      <h3 className="text-xl font-bold">الخصوم</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      {balanceSheet?.liabilities && balanceSheet.liabilities.length > 0 ? (
                        balanceSheet.liabilities.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-3 hover-elevate rounded"
                            data-testid={`liability-item-${index}`}
                          >
                            <span>{item.accountName}</span>
                            <span className="font-mono font-medium">{item.amount} ريال</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">لا توجد خصوم</p>
                      )}
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg font-bold">
                      <span>إجمالي الخصوم</span>
                      <span className="font-mono" data-testid="text-total-liabilities">
                        {balanceSheet?.totalLiabilities || "0"} ريال
                      </span>
                    </div>
                  </div>

                  {/* Equity */}
                  <div>
                    <div className="bg-purple-100 dark:bg-purple-950/20 p-4 rounded-lg mb-4">
                      <h3 className="text-xl font-bold">حقوق الملكية</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      {balanceSheet?.equity && balanceSheet.equity.length > 0 ? (
                        balanceSheet.equity.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-3 hover-elevate rounded"
                            data-testid={`equity-item-${index}`}
                          >
                            <span>{item.accountName}</span>
                            <span className="font-mono font-medium">{item.amount} ريال</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">لا توجد حقوق ملكية</p>
                      )}
                    </div>
                    <div className="flex justify-between p-4 bg-muted rounded-lg font-bold">
                      <span>إجمالي حقوق الملكية</span>
                      <span className="font-mono" data-testid="text-total-equity">
                        {balanceSheet?.totalEquity || "0"} ريال
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
