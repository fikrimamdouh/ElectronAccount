import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PlusCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" data-testid="page-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            لوحة التحكم
          </h1>
          <p className="text-muted-foreground">
            نظرة عامة على الوضع المالي للشركة
          </p>
        </div>
        <Link href="/entries">
          <Button size="lg" data-testid="button-new-entry">
            <PlusCircle className="w-5 h-5 ml-2" />
            قيد جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats?.totalRevenues || "0"} ريال`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-green-600"
        />
        <StatCard
          title="إجمالي المصروفات"
          value={`${stats?.totalExpenses || "0"} ريال`}
          icon={<TrendingDown className="w-6 h-6" />}
          color="bg-red-600"
        />
        <StatCard
          title="صافي الربح"
          value={`${stats?.netIncome || "0"} ريال`}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-blue-600"
        />
        <StatCard
          title="الرصيد الإجمالي"
          value={`${stats?.totalBalance || "0"} ريال`}
          icon={<Wallet className="w-6 h-6" />}
          color="bg-purple-600"
        />
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6" data-testid="text-chart-title">
          الإيرادات والمصروفات الشهرية
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenues"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="الإيرادات"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="المصروفات"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Entries */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" data-testid="text-recent-title">
            آخر القيود المحاسبية
          </h2>
          <Link href="/entries">
            <Button variant="ghost" size="sm" data-testid="button-view-all">
              عرض الكل
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {stats?.recentEntries && stats.recentEntries.length > 0 ? (
            stats.recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                data-testid={`entry-item-${entry.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium" data-testid="text-entry-number">
                    {entry.entryNumber}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-entry-description">
                    {entry.description}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-mono font-medium" data-testid="text-entry-amount">
                    {entry.totalDebit} ريال
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد قيود محاسبية بعد</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
