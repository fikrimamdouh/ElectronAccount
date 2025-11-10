import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Calculator,
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "لوحة التحكم",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "الحسابات",
    url: "/accounts",
    icon: BookOpen,
  },
  {
    title: "القيود اليومية",
    url: "/entries",
    icon: FileText,
  },
  {
    title: "ميزان المراجعة",
    url: "/trial-balance",
    icon: Calculator,
  },
  {
    title: "التقارير المالية",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-app-title">
              RinaPro Business
            </h1>
            <p className="text-xs text-muted-foreground">نظام المحاسبة</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القوائم الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-sidebar-accent" : ""}
                      data-testid={`link-nav-${item.title.replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
