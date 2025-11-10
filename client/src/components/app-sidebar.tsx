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
  {
    title: "البيانات الأساسية",
    icon: Database,
    items: [
      {
        title: "أكواد النظام",
        icon: Settings,
        items: [
          {
            title: "الفترات المالية",
            url: "/master/system-codes/fiscal-periods",
            icon: Calendar,
          },
          {
            title: "الفروع",
            url: "/master/system-codes/branches",
            icon: Building2,
          },
          {
            title: "العملات",
            url: "/master/system-codes/currencies",
            icon: Coins,
          },
        ],
      },
      {
        title: "دليل الحسابات",
        url: "/master/chart-of-accounts",
        icon: BookOpen,
      },
      {
        title: "مراكز التكلفة",
        url: "/master/cost-centers",
        icon: Target,
      },
      {
        title: "بيانات العملاء",
        url: "/master/customers",
        icon: UserPlus,
      },
      {
        title: "بيانات الموردين",
        url: "/master/suppliers",
        icon: Truck,
      },
    ],
  },
  {
    title: "الحركات اليومية",
    icon: FileText,
    items: [
      {
        title: "قيود اليومية العامة",
        url: "/transactions/journal-entries",
        icon: FileCheck,
      },
      {
        title: "سندات القبض",
        url: "/transactions/receipts",
        icon: Receipt,
      },
      {
        title: "سندات الصرف",
        url: "/transactions/payments",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "التقارير",
    icon: BarChart3,
    items: [
      {
        title: "تقارير الأستاذ العام",
        icon: FileSpreadsheet,
        items: [
          {
            title: "ميزان المراجعة",
            url: "/reports/general-ledger/trial-balance",
            icon: Calculator,
          },
          {
            title: "كشف حساب أستاذ",
            url: "/reports/general-ledger/ledger-account",
            icon: FileText,
          },
        ],
      },
      {
        title: "تقارير الأستاذ المساعد",
        icon: Users,
        items: [
          {
            title: "أرصدة العملاء",
            url: "/reports/subsidiary-ledger/customer-balances",
            icon: UserPlus,
          },
          {
            title: "كشف حساب عميل",
            url: "/reports/subsidiary-ledger/customer-statement",
            icon: FileCheck,
          },
        ],
      },
      {
        title: "تقارير مراكز التكلفة",
        url: "/reports/cost-centers",
        icon: Target,
      },
      {
        title: "القوائم المالية",
        icon: PieChart,
        items: [
          {
            title: "قائمة الدخل",
            url: "/reports/financial-statements/income-statement",
            icon: TrendingUp,
          },
          {
            title: "الميزانية العمومية",
            url: "/reports/financial-statements/balance-sheet",
            icon: Landmark,
          },
        ],
      },
    ],
  },
  {
    title: "عمليات نهاية الفترة",
    icon: Lock,
    items: [
      {
        title: "إقفال القيود",
        url: "/closing/close-entries",
        icon: Lock,
      },
      {
        title: "ترحيل الأرصدة",
        url: "/closing/transfer-balances",
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
  },
];

// Render submenu items recursively
function renderSubMenuItems(items: MenuItem[], location: string): JSX.Element[] {
  return items.map((subItem) => {
    const hasChildren = subItem.items && subItem.items.length > 0;
    const isActive = subItem.url === location;

    if (hasChildren) {
      const [isOpen, setIsOpen] = useState(false);
      
      return (
        <Collapsible key={subItem.title} open={isOpen} onOpenChange={setIsOpen}>
          <SidebarMenuSubItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton
                data-testid={`button-nav-${subItem.title.replace(/\s+/g, '-')}`}
              >
                <subItem.icon className="w-4 h-4" />
                <span>{subItem.title}</span>
                {isOpen ? (
                  <ChevronDown className="w-3 h-3 ms-auto" />
                ) : (
                  <ChevronLeft className="w-3 h-3 ms-auto" />
                )}
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {renderSubMenuItems(subItem.items!, location)}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuSubItem key={subItem.title}>
        <SidebarMenuSubButton
          asChild
          className={isActive ? "bg-sidebar-accent" : ""}
          data-testid={`link-nav-${subItem.title.replace(/\s+/g, '-')}`}
        >
          <Link href={subItem.url!}>
            <subItem.icon className="w-4 h-4" />
            <span>{subItem.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  });
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
              {renderSubMenuItems(item.items, location)}
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
            <p className="text-xs text-muted-foreground">نظام المحاسبة المتقدم</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القوائم الرئيسية</SidebarGroupLabel>
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
