import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Calculator,
  Database,
  Receipt,
  Users,
  Building2,
  Coins,
  Calendar,
  Landmark,
  Target,
  UserPlus,
  Truck,
  FileCheck,
  DollarSign,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  ArrowRightLeft,
  ChevronDown,
  ChevronLeft,
  Package,
  ShoppingCart,
  FileBarChart,
  ClipboardList,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  FileOutput,
  PackageX,
  CreditCard,
  Wallet,
  Banknote,
  ArrowLeftRight,
  UserCircle,
  Clock,
  HardDrive,
  Wrench,
  TrendingDown,
  MonitorPlay,
  FolderKanban,
  Factory,
  FileSignature,
  Store,
  TruckIcon,
  MessageSquare,
  Award,
  Megaphone,
  Gift,
  LayoutDashboard as BIIcon,
  AlertTriangle,
  Shield,
  FolderOpen,
  Ticket,
  Trophy,
  Star,
  MapPin,
  CheckCircle,
  Eye,
  Scale,
  XCircle,
  ClipboardCheck,
  Archive,
  Search as SearchIcon,
  LineChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "لوحة التحكم",
    url: "/",
    icon: LayoutDashboard,
  },
  
  // البيانات الأساسية المشتركة
  {
    title: "البيانات الأساسية",
    icon: Database,
    items: [
      {
        title: "إدارة بيانات العملاء",
        url: "/master/customers",
        icon: Users,
      },
      {
        title: "إدارة بيانات الموردين",
        url: "/master/suppliers",
        icon: Truck,
      },
      {
        title: "الفروع",
        url: "/master/branches",
        icon: Building2,
      },
      {
        title: "العملات",
        url: "/master/currencies",
        icon: Coins,
      },
    ],
  },
  
  // 1. المحاسبة المالية
  {
    title: "المحاسبة المالية",
    icon: Calculator,
    items: [
      {
        title: "دليل الحسابات",
        url: "/accounting/chart-of-accounts",
        icon: BookOpen,
      },
      {
        title: "مراكز التكلفة",
        url: "/accounting/cost-centers",
        icon: Target,
      },
      {
        title: "الفترات المالية",
        url: "/accounting/fiscal-periods",
        icon: Calendar,
      },
      {
        title: "القيود والحركات",
        icon: FileText,
        items: [
          {
            title: "قيود اليومية",
            url: "/accounting/journal-entries",
            icon: FileCheck,
          },
          {
            title: "سندات الصرف",
            url: "/cash-bank/payment-vouchers",
            icon: DollarSign,
          },
        ],
      },
      {
        title: "التقارير المالية",
        icon: BarChart3,
        items: [
          {
            title: "ميزان المراجعة",
            url: "/accounting/reports/trial-balance",
            icon: Calculator,
          },
          {
            title: "قائمة الدخل",
            url: "/accounting/reports/income-statement",
            icon: TrendingUp,
          },
          {
            title: "الميزانية العمومية",
            url: "/accounting/reports/balance-sheet",
            icon: Landmark,
          },
          {
            title: "التدفقات النقدية",
            url: "/accounting/reports/cash-flow",
            icon: Banknote,
          },
        ],
      },
    ],
  },

  // 2. إدارة المخزون
  {
    title: "إدارة المخزون",
    icon: Package,
    items: [
      {
        title: "الأصناف",
        url: "/inventory/items",
        icon: PackageCheck,
      },
      {
        title: "المخازن",
        url: "/inventory/warehouses",
        icon: Building2,
      },
      {
        title: "حركات المخزون",
        url: "/inventory/movements",
        icon: ArrowLeftRight,
      },
      {
        title: "الجرد",
        url: "/inventory/stock-count",
        icon: ClipboardList,
      },
      {
        title: "التقارير",
        icon: FileBarChart,
        items: [
          {
            title: "أرصدة المخزون",
            url: "/inventory/reports/stock-balance",
            icon: Package,
          },
          {
            title: "حركة الأصناف",
            url: "/inventory/reports/item-movement",
            icon: RotateCcw,
          },
        ],
      },
    ],
  },

  // 3. المبيعات والعملاء
  {
    title: "المبيعات والعملاء",
    icon: ShoppingCart,
    items: [
      {
        title: "بيانات العملاء",
        url: "/sales/customers",
        icon: UserPlus,
      },
      {
        title: "عروض الأسعار",
        url: "/sales/quotations",
        icon: FileText,
      },
      {
        title: "أوامر البيع",
        url: "/sales/orders",
        icon: ShoppingBag,
      },
      {
        title: "فواتير المبيعات",
        url: "/sales/invoices",
        icon: FileCheck,
      },
      {
        title: "مرتجعات المبيعات",
        url: "/sales/returns",
        icon: PackageX,
      },
      {
        title: "التقارير",
        icon: FileBarChart,
        items: [
          {
            title: "تقرير المبيعات",
            url: "/sales/reports/sales-report",
            icon: TrendingUp,
          },
          {
            title: "أرصدة العملاء",
            url: "/sales/reports/customer-balances",
            icon: Users,
          },
        ],
      },
    ],
  },

  // 4. المشتريات والموردين
  {
    title: "المشتريات والموردين",
    icon: Truck,
    items: [
      {
        title: "بيانات الموردين",
        url: "/purchasing/suppliers",
        icon: Truck,
      },
      {
        title: "طلبات الشراء",
        url: "/purchasing/purchase-orders",
        icon: ClipboardList,
      },
      {
        title: "استلام البضاعة",
        url: "/purchasing/goods-receipt",
        icon: PackageCheck,
      },
      {
        title: "فواتير المشتريات",
        url: "/purchasing/invoices",
        icon: FileCheck,
      },
      {
        title: "مرتجعات المشتريات",
        url: "/purchasing/returns",
        icon: RotateCcw,
      },
      {
        title: "التقارير",
        icon: FileBarChart,
        items: [
          {
            title: "تقرير المشتريات",
            url: "/purchasing/reports/purchase-report",
            icon: TrendingDown,
          },
          {
            title: "أرصدة الموردين",
            url: "/purchasing/reports/supplier-balances",
            icon: Truck,
          },
        ],
      },
    ],
  },

  // 5. نقاط البيع (POS)
  {
    title: "نقاط البيع",
    icon: MonitorPlay,
    items: [
      {
        title: "شاشة البيع",
        url: "/pos/sale-screen",
        icon: MonitorPlay,
      },
      {
        title: "الفواتير اليومية",
        url: "/pos/daily-invoices",
        icon: FileCheck,
      },
      {
        title: "تقارير المبيعات",
        url: "/pos/reports",
        icon: FileBarChart,
      },
      {
        title: "إدارة الورديات",
        url: "/pos/shifts",
        icon: Clock,
      },
    ],
  },

  // 6. النقدية والبنوك
  {
    title: "النقدية والبنوك",
    icon: Wallet,
    items: [
      {
        title: "الحسابات البنكية",
        url: "/cash-bank/bank-accounts",
        icon: Landmark,
      },
      {
        title: "الصناديق",
        url: "/cash-bank/cash-boxes",
        icon: Wallet,
      },
      {
        title: "سندات القبض",
        url: "/cash-bank/receipt-vouchers",
        icon: Receipt,
      },
      {
        title: "سندات الصرف",
        url: "/cash-bank/payment-vouchers",
        icon: CreditCard,
      },
      {
        title: "التسويات البنكية",
        url: "/cash-bank/reconciliation",
        icon: ArrowLeftRight,
      },
    ],
  },

  // 7. الموارد البشرية
  {
    title: "الموارد البشرية",
    icon: Users,
    items: [
      {
        title: "بيانات الموظفين",
        url: "/hr/employees",
        icon: UserCircle,
      },
      {
        title: "الحضور والانصراف",
        url: "/hr/attendance",
        icon: Clock,
      },
      {
        title: "الرواتب",
        url: "/hr/payroll",
        icon: Banknote,
      },
      {
        title: "البدلات والاستقطاعات",
        url: "/hr/allowances-deductions",
        icon: DollarSign,
      },
      {
        title: "التقارير",
        icon: FileBarChart,
        items: [
          {
            title: "كشف الرواتب",
            url: "/hr/reports/payroll-sheet",
            icon: FileSpreadsheet,
          },
          {
            title: "تقرير الحضور",
            url: "/hr/reports/attendance",
            icon: Clock,
          },
        ],
      },
    ],
  },

  // 8. الأصول الثابتة
  {
    title: "الأصول الثابتة",
    icon: HardDrive,
    items: [
      {
        title: "تسجيل الأصول",
        url: "/fixed-assets/register",
        icon: PackageCheck,
      },
      {
        title: "الإهلاك",
        url: "/fixed-assets/depreciation",
        icon: TrendingDown,
      },
      {
        title: "نقل الأصول",
        url: "/fixed-assets/transfer",
        icon: ArrowLeftRight,
      },
      {
        title: "استبعاد الأصول",
        url: "/fixed-assets/disposal",
        icon: PackageX,
      },
      {
        title: "صيانة الأصول",
        url: "/fixed-assets/maintenance",
        icon: Wrench,
      },
    ],
  },

  // 9. إدارة المشاريع
  {
    title: "إدارة المشاريع",
    icon: FolderKanban,
    items: [
      {
        title: "المشاريع",
        url: "/projects/list",
        icon: FolderKanban,
      },
      {
        title: "المهام",
        url: "/projects/tasks",
        icon: ClipboardList,
      },
      {
        title: "الميزانيات",
        url: "/projects/budgets",
        icon: Calculator,
      },
      {
        title: "التقارير",
        url: "/projects/reports",
        icon: FileBarChart,
      },
    ],
  },

  // 10. إدارة الإنتاج
  {
    title: "إدارة الإنتاج",
    icon: Factory,
    items: [
      {
        title: "أوامر الإنتاج",
        url: "/production/orders",
        icon: ClipboardList,
      },
      {
        title: "وصفات الإنتاج",
        url: "/production/bom",
        icon: FileText,
      },
      {
        title: "خطوط الإنتاج",
        url: "/production/lines",
        icon: Factory,
      },
      {
        title: "مراقبة الجودة",
        url: "/production/quality",
        icon: Award,
      },
    ],
  },

  // 11. إدارة العقود
  {
    title: "إدارة العقود",
    icon: FileSignature,
    items: [
      {
        title: "العقود",
        url: "/contracts/list",
        icon: FileSignature,
      },
      {
        title: "التجديدات",
        url: "/contracts/renewals",
        icon: RotateCcw,
      },
      {
        title: "التنبيهات",
        url: "/contracts/alerts",
        icon: MessageSquare,
      },
    ],
  },

  // 12. التجارة الإلكترونية
  {
    title: "التجارة الإلكترونية",
    icon: Store,
    items: [
      {
        title: "المتجر الإلكتروني",
        url: "/ecommerce/store",
        icon: Store,
      },
      {
        title: "الطلبات الإلكترونية",
        url: "/ecommerce/orders",
        icon: ShoppingBag,
      },
      {
        title: "المنتجات",
        url: "/ecommerce/products",
        icon: Package,
      },
      {
        title: "العملاء",
        url: "/ecommerce/customers",
        icon: Users,
      },
    ],
  },

  // 13. النقل والشحن
  {
    title: "النقل والشحن",
    icon: TruckIcon,
    items: [
      {
        title: "شركات الشحن",
        url: "/shipping/carriers",
        icon: TruckIcon,
      },
      {
        title: "الشحنات",
        url: "/shipping/shipments",
        icon: Package,
      },
      {
        title: "تتبع الشحنات",
        url: "/shipping/tracking",
        icon: FileBarChart,
      },
    ],
  },

  // 14. إدارة علاقات العملاء (CRM)
  {
    title: "إدارة علاقات العملاء",
    icon: Users,
    items: [
      {
        title: "العملاء المحتملون",
        url: "/crm/leads",
        icon: UserPlus,
      },
      {
        title: "الفرص البيعية",
        url: "/crm/opportunities",
        icon: TrendingUp,
      },
      {
        title: "الأنشطة والاتصالات",
        url: "/crm/activities",
        icon: Calendar,
      },
      {
        title: "الحملات التسويقية",
        url: "/crm/campaigns",
        icon: Megaphone,
      },
      {
        title: "المهام والمتابعة",
        url: "/crm/tasks",
        icon: ClipboardList,
      },
      {
        title: "تحليلات العملاء",
        url: "/crm/analytics",
        icon: BarChart3,
      },
      {
        title: "تقارير CRM",
        url: "/crm/reports",
        icon: FileText,
      },
    ],
  },

  // 15. الميزانيات والتخطيط المالي
  {
    title: "الميزانيات والتخطيط",
    icon: Calculator,
    items: [
      {
        title: "الميزانيات السنوية",
        url: "/budgets/annual",
        icon: FileSpreadsheet,
      },
      {
        title: "الفعلي مقابل المخطط",
        url: "/budgets/actual-vs-budget",
        icon: PieChart,
      },
      {
        title: "التنبؤات المالية",
        url: "/budgets/forecasts",
        icon: LineChart,
      },
      {
        title: "تحليل الانحرافات",
        url: "/budgets/variances",
        icon: AlertTriangle,
      },
      {
        title: "تقارير الميزانيات",
        url: "/budgets/reports",
        icon: FileText,
      },
    ],
  },

  // 16. إدارة الجودة
  {
    title: "إدارة الجودة",
    icon: Award,
    items: [
      {
        title: "معايير الجودة",
        url: "/quality/standards",
        icon: Award,
      },
      {
        title: "الفحوصات",
        url: "/quality/inspections",
        icon: ClipboardCheck,
      },
      {
        title: "عدم المطابقة",
        url: "/quality/non-conformance",
        icon: XCircle,
      },
      {
        title: "الإجراءات التصحيحية",
        url: "/quality/corrective-actions",
        icon: Wrench,
      },
      {
        title: "تقارير الجودة",
        url: "/quality/reports",
        icon: FileText,
      },
    ],
  },

  // 17. الصيانة
  {
    title: "الصيانة",
    icon: Wrench,
    items: [
      {
        title: "جدول الصيانة",
        url: "/maintenance/schedule",
        icon: Calendar,
      },
      {
        title: "طلبات الصيانة",
        url: "/maintenance/work-orders",
        icon: ClipboardList,
      },
      {
        title: "قطع الغيار",
        url: "/maintenance/spare-parts",
        icon: Package,
      },
      {
        title: "تكاليف الصيانة",
        url: "/maintenance/costs",
        icon: DollarSign,
      },
      {
        title: "تقارير الصيانة",
        url: "/maintenance/reports",
        icon: FileText,
      },
    ],
  },

  // 18. إدارة المستندات
  {
    title: "إدارة المستندات",
    icon: FolderOpen,
    items: [
      {
        title: "تخزين المستندات",
        url: "/documents/storage",
        icon: FolderOpen,
      },
      {
        title: "تصنيف المستندات",
        url: "/documents/categories",
        icon: FolderKanban,
      },
      {
        title: "البحث في المستندات",
        url: "/documents/search",
        icon: SearchIcon,
      },
      {
        title: "الأرشيف",
        url: "/documents/archive",
        icon: Archive,
      },
    ],
  },

  // 19. نقاط الولاء
  {
    title: "نقاط الولاء",
    icon: Gift,
    items: [
      {
        title: "برامج الولاء",
        url: "/loyalty/programs",
        icon: Gift,
      },
      {
        title: "النقاط والمكافآت",
        url: "/loyalty/points",
        icon: Star,
      },
      {
        title: "الكوبونات والعروض",
        url: "/loyalty/coupons",
        icon: Ticket,
      },
      {
        title: "مستويات العضوية",
        url: "/loyalty/tiers",
        icon: Trophy,
      },
      {
        title: "تقارير الولاء",
        url: "/loyalty/reports",
        icon: FileText,
      },
    ],
  },

  // 20. التقارير التحليلية (BI)
  {
    title: "التقارير التحليلية",
    icon: BIIcon,
    items: [
      {
        title: "لوحات التحكم التحليلية",
        url: "/bi/dashboards",
        icon: LayoutDashboard,
      },
      {
        title: "مؤشرات الأداء KPIs",
        url: "/bi/kpis",
        icon: Target,
      },
      {
        title: "التقارير المخصصة",
        url: "/bi/custom-reports",
        icon: FileBarChart,
      },
      {
        title: "تحليل البيانات",
        url: "/bi/data-analysis",
        icon: BarChart3,
      },
      {
        title: "تصدير البيانات",
        url: "/bi/data-export",
        icon: FileOutput,
      },
      {
        title: "الاتجاهات والتنبؤات",
        url: "/bi/trends",
        icon: TrendingUp,
      },
    ],
  },

  // 21. الوكلاء والموزعون
  {
    title: "الوكلاء والموزعون",
    icon: Users,
    items: [
      {
        title: "الوكلاء والموزعون",
        url: "/distributors/list",
        icon: Users,
      },
      {
        title: "العمولات",
        url: "/distributors/commissions",
        icon: DollarSign,
      },
      {
        title: "المناطق الجغرافية",
        url: "/distributors/territories",
        icon: MapPin,
      },
      {
        title: "الحصص والأهداف",
        url: "/distributors/targets",
        icon: Target,
      },
      {
        title: "تقارير الوكلاء",
        url: "/distributors/reports",
        icon: FileText,
      },
    ],
  },

  // 22. الاجتماعات واللجان
  {
    title: "الاجتماعات واللجان",
    icon: Calendar,
    items: [
      {
        title: "الاجتماعات",
        url: "/meetings/list",
        icon: Calendar,
      },
      {
        title: "محاضر الاجتماعات",
        url: "/meetings/minutes",
        icon: FileText,
      },
      {
        title: "القرارات والتوصيات",
        url: "/meetings/decisions",
        icon: CheckCircle,
      },
      {
        title: "المتابعة والتنفيذ",
        url: "/meetings/followup",
        icon: Clock,
      },
    ],
  },

  // 23. إدارة المخاطر
  {
    title: "إدارة المخاطر",
    icon: AlertTriangle,
    items: [
      {
        title: "تحديد المخاطر",
        url: "/risk-management/identification",
        icon: AlertTriangle,
      },
      {
        title: "تقييم المخاطر",
        url: "/risk-management/assessment",
        icon: Scale,
      },
      {
        title: "خطط المعالجة",
        url: "/risk-management/mitigation",
        icon: Shield,
      },
      {
        title: "المتابعة والرصد",
        url: "/risk-management/monitoring",
        icon: Eye,
      },
    ],
  },

  // الإعدادات
  {
    title: "الإعدادات",
    icon: Settings,
    items: [
      {
        title: "بيانات الشركة",
        url: "/settings/company",
        icon: Building2,
      },
      {
        title: "إدارة المديولات",
        url: "/settings/modules",
        icon: Settings,
      },
      {
        title: "الفروع",
        url: "/settings/branches",
        icon: Building2,
      },
      {
        title: "العملات",
        url: "/settings/currencies",
        icon: Coins,
      },
      {
        title: "المستخدمين والصلاحيات",
        url: "/settings/users",
        icon: Users,
      },
      {
        title: "النسخ الاحتياطي",
        url: "/settings/backup",
        icon: HardDrive,
      },
    ],
  },
];

// Sub menu item component (for nested items)
function SubMenuItem({ item, location }: { item: MenuItem; location: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.url === location;

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton
              data-testid={`button-nav-${item.title.replace(/\s+/g, '-')}`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              {isOpen ? (
                <ChevronDown className="w-3 h-3 ms-auto" />
              ) : (
                <ChevronLeft className="w-3 h-3 ms-auto" />
              )}
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SubMenuItem key={subItem.title} item={subItem} location={location} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        className={isActive ? "bg-sidebar-accent" : ""}
        data-testid={`link-nav-${item.title.replace(/\s+/g, '-')}`}
      >
        <Link href={item.url!}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function NavMenuItem({ item }: { item: MenuItem }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.url === location;

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              data-testid={`button-nav-${item.title.replace(/\s+/g, '-')}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 ms-auto" />
              ) : (
                <ChevronLeft className="w-4 h-4 ms-auto" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SubMenuItem key={subItem.title} item={subItem} location={location} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={isActive ? "bg-sidebar-accent" : ""}
        data-testid={`link-nav-${item.title.replace(/\s+/g, '-')}`}
      >
        <Link href={item.url!}>
          <item.icon className="w-5 h-5" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-app-title">
              RinaPro Business
            </h1>
            <p className="text-xs text-muted-foreground">نظام ERP المتكامل</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>المديولات الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <NavMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
