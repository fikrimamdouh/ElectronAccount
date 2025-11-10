import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Entries from "@/pages/Entries";
import TrialBalance from "@/pages/TrialBalance";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

// Master Data Pages
import FiscalPeriods from "@/pages/master/FiscalPeriods";
import Branches from "@/pages/master/Branches";
import Currencies from "@/pages/master/Currencies";
import ChartOfAccounts from "@/pages/master/ChartOfAccounts";
import CostCenters from "@/pages/master/CostCenters";
import Customers from "@/pages/master/Customers";
import Suppliers from "@/pages/master/Suppliers";

// Transaction Pages
import JournalEntries from "@/pages/transactions/JournalEntries";
import Receipts from "@/pages/transactions/Receipts";
import Payments from "@/pages/transactions/Payments";

// Report Pages
import GeneralLedgerTrialBalance from "@/pages/reports/GeneralLedgerTrialBalance";
import LedgerAccount from "@/pages/reports/LedgerAccount";
import CustomerBalances from "@/pages/reports/CustomerBalances";
import CustomerStatement from "@/pages/reports/CustomerStatement";
import CostCentersReports from "@/pages/reports/CostCentersReports";
import IncomeStatement from "@/pages/reports/IncomeStatement";
import BalanceSheet from "@/pages/reports/BalanceSheet";

// Closing Pages
import CloseEntries from "@/pages/closing/CloseEntries";
import TransferBalances from "@/pages/closing/TransferBalances";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/accounts" component={Accounts} />
      <Route path="/entries" component={Entries} />
      <Route path="/trial-balance" component={TrialBalance} />
      <Route path="/reports" component={Reports} />
      
      {/* Master Data Routes */}
      <Route path="/master/system-codes/fiscal-periods" component={FiscalPeriods} />
      <Route path="/master/system-codes/branches" component={Branches} />
      <Route path="/master/system-codes/currencies" component={Currencies} />
      <Route path="/master/chart-of-accounts" component={ChartOfAccounts} />
      <Route path="/master/cost-centers" component={CostCenters} />
      <Route path="/master/customers" component={Customers} />
      <Route path="/master/suppliers" component={Suppliers} />
      
      {/* Transaction Routes */}
      <Route path="/transactions/journal-entries" component={JournalEntries} />
      <Route path="/transactions/receipts" component={Receipts} />
      <Route path="/transactions/payments" component={Payments} />
      
      {/* Report Routes */}
      <Route path="/reports/general-ledger/trial-balance" component={GeneralLedgerTrialBalance} />
      <Route path="/reports/general-ledger/ledger-account" component={LedgerAccount} />
      <Route path="/reports/subsidiary-ledger/customer-balances" component={CustomerBalances} />
      <Route path="/reports/subsidiary-ledger/customer-statement" component={CustomerStatement} />
      <Route path="/reports/cost-centers" component={CostCentersReports} />
      <Route path="/reports/financial-statements/income-statement" component={IncomeStatement} />
      <Route path="/reports/financial-statements/balance-sheet" component={BalanceSheet} />
      
      {/* Closing Routes */}
      <Route path="/closing/close-entries" component={CloseEntries} />
      <Route path="/closing/transfer-balances" component={TransferBalances} />
      
      {/* Settings */}
      <Route path="/settings" component={Settings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </Button>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b border-border">
                <ThemeToggle />
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
            <AppSidebar />
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
