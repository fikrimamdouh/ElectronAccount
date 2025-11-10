import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Main Pages
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

// Accounting Module - Master Data
import FiscalPeriods from "@/pages/master/FiscalPeriods";
import Branches from "@/pages/master/Branches";
import Currencies from "@/pages/master/Currencies";
import ChartOfAccounts from "@/pages/master/ChartOfAccounts";
import CostCenters from "@/pages/master/CostCenters";
import Customers from "@/pages/master/Customers";
import Suppliers from "@/pages/master/Suppliers";

// Accounting Module - Transactions
import JournalEntries from "@/pages/transactions/JournalEntries";
import Receipts from "@/pages/transactions/Receipts";
import Payments from "@/pages/transactions/Payments";

// Accounting Module - Reports
import GeneralLedgerTrialBalance from "@/pages/reports/GeneralLedgerTrialBalance";
import LedgerAccount from "@/pages/reports/LedgerAccount";
import CustomerBalances from "@/pages/reports/CustomerBalances";
import CustomerStatement from "@/pages/reports/CustomerStatement";
import CostCentersReports from "@/pages/reports/CostCentersReports";
import IncomeStatement from "@/pages/reports/IncomeStatement";
import BalanceSheet from "@/pages/reports/BalanceSheet";
import CashFlowStatement from "@/pages/reports/CashFlowStatement";

// Accounting Module - Closing
import CloseEntries from "@/pages/closing/CloseEntries";
import TransferBalances from "@/pages/closing/TransferBalances";

// Inventory Module
import InventoryItems from "@/pages/inventory/Items";
import Warehouses from "@/pages/inventory/Warehouses";
import StockMovements from "@/pages/inventory/StockMovements";
import StockCount from "@/pages/inventory/StockCount";
import StockBalance from "@/pages/inventory/reports/StockBalance";
import ItemMovement from "@/pages/inventory/reports/ItemMovement";

// Sales Module
import SalesCustomers from "@/pages/sales/Customers";
import Quotations from "@/pages/sales/Quotations";
import SalesOrders from "@/pages/sales/Orders";
import SalesInvoices from "@/pages/sales/Invoices";
import SalesReturns from "@/pages/sales/Returns";
import SalesReport from "@/pages/sales/reports/SalesReport";
import SalesCustomerBalances from "@/pages/sales/reports/CustomerBalances";

// Purchasing Module
import PurchasingSuppliers from "@/pages/purchasing/Suppliers";
import PurchaseOrders from "@/pages/purchasing/PurchaseOrders";
import GoodsReceipt from "@/pages/purchasing/GoodsReceipt";
import PurchaseInvoices from "@/pages/purchasing/Invoices";
import PurchaseReturns from "@/pages/purchasing/Returns";
import PurchaseReport from "@/pages/purchasing/reports/PurchaseReport";
import SupplierBalances from "@/pages/purchasing/reports/SupplierBalances";

// Cash & Bank Module
import BankAccounts from "@/pages/cash-bank/BankAccounts";
import CashBoxes from "@/pages/cash-bank/CashBoxes";
import CashBankReceipts from "@/pages/cash-bank/Receipts";
import CashBankPayments from "@/pages/cash-bank/Payments";
import BankReconciliation from "@/pages/cash-bank/Reconciliation";

// HR Module
import Employees from "@/pages/hr/Employees";
import Attendance from "@/pages/hr/Attendance";
import Payroll from "@/pages/hr/Payroll";
import AllowancesDeductions from "@/pages/hr/AllowancesDeductions";
import PayrollSheet from "@/pages/hr/reports/PayrollSheet";
import AttendanceReport from "@/pages/hr/reports/AttendanceReport";

// Fixed Assets Module
import AssetsRegister from "@/pages/fixed-assets/Register";
import Depreciation from "@/pages/fixed-assets/Depreciation";
import AssetTransfer from "@/pages/fixed-assets/Transfer";
import AssetDisposal from "@/pages/fixed-assets/Disposal";
import AssetMaintenance from "@/pages/fixed-assets/Maintenance";

// POS Module
import SaleScreen from "@/pages/pos/SaleScreen";
import DailyInvoices from "@/pages/pos/DailyInvoices";
import POSReports from "@/pages/pos/POSReports";
import Shifts from "@/pages/pos/Shifts";

// Projects Module
import ProjectsList from "@/pages/projects/ProjectsList";
import Tasks from "@/pages/projects/Tasks";
import Budgets from "@/pages/projects/Budgets";
import ProjectReports from "@/pages/projects/ProjectReports";

// Production Module
import ProductionOrders from "@/pages/production/ProductionOrders";
import BillOfMaterials from "@/pages/production/BillOfMaterials";
import ProductionLines from "@/pages/production/ProductionLines";
import QualityControl from "@/pages/production/QualityControl";

// Contracts Module
import ContractsList from "@/pages/contracts/ContractsList";
import Renewals from "@/pages/contracts/Renewals";
import Alerts from "@/pages/contracts/Alerts";

// E-commerce Module
import EcommerceStore from "@/pages/ecommerce/Store";
import OnlineOrders from "@/pages/ecommerce/OnlineOrders";
import EcommerceProducts from "@/pages/ecommerce/Products";
import OnlineCustomers from "@/pages/ecommerce/OnlineCustomers";

// Shipping Module
import Carriers from "@/pages/shipping/Carriers";
import Shipments from "@/pages/shipping/Shipments";
import Tracking from "@/pages/shipping/Tracking";

// Settings
import CompanySettings from "@/pages/settings/CompanySettings";
import SettingsBranches from "@/pages/settings/SettingsBranches";
import SettingsCurrencies from "@/pages/settings/SettingsCurrencies";
import SettingsUsers from "@/pages/settings/Users";
import Backup from "@/pages/settings/Backup";

function Router() {
  return (
    <Switch>
      {/* Dashboard */}
      <Route path="/" component={Dashboard} />
      
      {/* 1. Accounting Module */}
      {/* Master Data */}
      <Route path="/accounting/fiscal-periods" component={FiscalPeriods} />
      <Route path="/accounting/cost-centers" component={CostCenters} />
      <Route path="/accounting/chart-of-accounts" component={ChartOfAccounts} />
      
      {/* Transactions */}
      <Route path="/accounting/journal-entries" component={JournalEntries} />
      <Route path="/accounting/receipts" component={Receipts} />
      <Route path="/accounting/payments" component={Payments} />
      
      {/* Reports */}
      <Route path="/accounting/reports/trial-balance" component={GeneralLedgerTrialBalance} />
      <Route path="/accounting/reports/ledger-account" component={LedgerAccount} />
      <Route path="/accounting/reports/customer-balances" component={CustomerBalances} />
      <Route path="/accounting/reports/customer-statement" component={CustomerStatement} />
      <Route path="/accounting/reports/cost-centers" component={CostCentersReports} />
      <Route path="/accounting/reports/income-statement" component={IncomeStatement} />
      <Route path="/accounting/reports/balance-sheet" component={BalanceSheet} />
      <Route path="/accounting/reports/cash-flow" component={CashFlowStatement} />
      
      {/* Closing */}
      <Route path="/accounting/closing/close-entries" component={CloseEntries} />
      <Route path="/accounting/closing/transfer-balances" component={TransferBalances} />

      {/* 2. Inventory Module */}
      <Route path="/inventory/items" component={InventoryItems} />
      <Route path="/inventory/warehouses" component={Warehouses} />
      <Route path="/inventory/movements" component={StockMovements} />
      <Route path="/inventory/stock-count" component={StockCount} />
      <Route path="/inventory/reports/stock-balance" component={StockBalance} />
      <Route path="/inventory/reports/item-movement" component={ItemMovement} />

      {/* 3. Sales Module */}
      <Route path="/sales/customers" component={SalesCustomers} />
      <Route path="/sales/quotations" component={Quotations} />
      <Route path="/sales/orders" component={SalesOrders} />
      <Route path="/sales/invoices" component={SalesInvoices} />
      <Route path="/sales/returns" component={SalesReturns} />
      <Route path="/sales/reports/sales-report" component={SalesReport} />
      <Route path="/sales/reports/customer-balances" component={SalesCustomerBalances} />

      {/* 4. Purchasing Module */}
      <Route path="/purchasing/suppliers" component={PurchasingSuppliers} />
      <Route path="/purchasing/purchase-orders" component={PurchaseOrders} />
      <Route path="/purchasing/goods-receipt" component={GoodsReceipt} />
      <Route path="/purchasing/invoices" component={PurchaseInvoices} />
      <Route path="/purchasing/returns" component={PurchaseReturns} />
      <Route path="/purchasing/reports/purchase-report" component={PurchaseReport} />
      <Route path="/purchasing/reports/supplier-balances" component={SupplierBalances} />

      {/* 5. POS Module */}
      <Route path="/pos/sale-screen" component={SaleScreen} />
      <Route path="/pos/daily-invoices" component={DailyInvoices} />
      <Route path="/pos/reports" component={POSReports} />
      <Route path="/pos/shifts" component={Shifts} />

      {/* 6. Cash & Bank Module */}
      <Route path="/cash-bank/bank-accounts" component={BankAccounts} />
      <Route path="/cash-bank/cash-boxes" component={CashBoxes} />
      <Route path="/cash-bank/receipts" component={CashBankReceipts} />
      <Route path="/cash-bank/payments" component={CashBankPayments} />
      <Route path="/cash-bank/reconciliation" component={BankReconciliation} />

      {/* 7. HR Module */}
      <Route path="/hr/employees" component={Employees} />
      <Route path="/hr/attendance" component={Attendance} />
      <Route path="/hr/payroll" component={Payroll} />
      <Route path="/hr/allowances-deductions" component={AllowancesDeductions} />
      <Route path="/hr/reports/payroll-sheet" component={PayrollSheet} />
      <Route path="/hr/reports/attendance" component={AttendanceReport} />

      {/* 8. Fixed Assets Module */}
      <Route path="/fixed-assets/register" component={AssetsRegister} />
      <Route path="/fixed-assets/depreciation" component={Depreciation} />
      <Route path="/fixed-assets/transfer" component={AssetTransfer} />
      <Route path="/fixed-assets/disposal" component={AssetDisposal} />
      <Route path="/fixed-assets/maintenance" component={AssetMaintenance} />

      {/* 9. Projects Module */}
      <Route path="/projects/list" component={ProjectsList} />
      <Route path="/projects/tasks" component={Tasks} />
      <Route path="/projects/budgets" component={Budgets} />
      <Route path="/projects/reports" component={ProjectReports} />

      {/* 10. Production Module */}
      <Route path="/production/orders" component={ProductionOrders} />
      <Route path="/production/bom" component={BillOfMaterials} />
      <Route path="/production/lines" component={ProductionLines} />
      <Route path="/production/quality" component={QualityControl} />

      {/* 11. Contracts Module */}
      <Route path="/contracts/list" component={ContractsList} />
      <Route path="/contracts/renewals" component={Renewals} />
      <Route path="/contracts/alerts" component={Alerts} />

      {/* 12. E-commerce Module */}
      <Route path="/ecommerce/store" component={EcommerceStore} />
      <Route path="/ecommerce/orders" component={OnlineOrders} />
      <Route path="/ecommerce/products" component={EcommerceProducts} />
      <Route path="/ecommerce/customers" component={OnlineCustomers} />

      {/* 13. Shipping Module */}
      <Route path="/shipping/carriers" component={Carriers} />
      <Route path="/shipping/shipments" component={Shipments} />
      <Route path="/shipping/tracking" component={Tracking} />

      {/* Settings */}
      <Route path="/settings/company" component={CompanySettings} />
      <Route path="/settings/branches" component={SettingsBranches} />
      <Route path="/settings/currencies" component={SettingsCurrencies} />
      <Route path="/settings/users" component={SettingsUsers} />
      <Route path="/settings/backup" component={Backup} />
      
      {/* 404 */}
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
