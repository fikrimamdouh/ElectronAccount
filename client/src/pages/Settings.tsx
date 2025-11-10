import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
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
    <div className="p-8 space-y-6" data-testid="page-settings">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
          الإعدادات
        </h1>
        <p className="text-muted-foreground">
          إدارة إعدادات التطبيق والتفضيلات
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              {theme === "light" ? (
                <Sun className="w-6 h-6 text-primary" />
              ) : (
                <Moon className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg">المظهر</h3>
              <p className="text-sm text-muted-foreground">
                {theme === "light" ? "الوضع النهاري" : "الوضع الليلي"}
              </p>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            data-testid="button-toggle-theme"
          >
            {theme === "light" ? (
              <>
                <Moon className="w-5 h-5 me-2" />
                تفعيل الوضع الليلي
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 me-2" />
                تفعيل الوضع النهاري
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">معلومات التطبيق</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-muted/50 rounded">
            <span className="text-muted-foreground">اسم التطبيق</span>
            <span className="font-medium">RinaPro Business</span>
          </div>
          <div className="flex justify-between p-3 bg-muted/50 rounded">
            <span className="text-muted-foreground">الإصدار</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between p-3 bg-muted/50 rounded">
            <span className="text-muted-foreground">النوع</span>
            <span className="font-medium">نظام محاسبة احترافي</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
