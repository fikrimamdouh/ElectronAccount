import { Settings, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

const defaultModules: Module[] = [
  // المديولات الأساسية
  { id: "accounting", name: "المحاسبة المالية", description: "إدارة الحسابات والقيود المحاسبية", enabled: true, category: "core" },
  { id: "inventory", name: "إدارة المخزون", description: "تتبع الأصناف والمخازن", enabled: true, category: "core" },
  { id: "sales", name: "المبيعات والعملاء", description: "إدارة المبيعات والفواتير", enabled: true, category: "core" },
  { id: "purchasing", name: "المشتريات والموردين", description: "إدارة المشتريات والموردين", enabled: true, category: "core" },
  
  // المديولات الإضافية
  { id: "pos", name: "نقاط البيع POS", description: "نظام نقاط البيع", enabled: true, category: "additional" },
  { id: "cash-bank", name: "النقدية والبنوك", description: "إدارة الصناديق والبنوك", enabled: true, category: "additional" },
  { id: "hr", name: "شؤون الموظفين", description: "إدارة الموظفين والرواتب", enabled: true, category: "additional" },
  { id: "fixed-assets", name: "الأصول الثابتة", description: "إدارة الأصول والإهلاك", enabled: true, category: "additional" },
  { id: "projects", name: "إدارة المشاريع", description: "تتبع المشاريع والمهام", enabled: true, category: "additional" },
  { id: "production", name: "الإنتاج", description: "إدارة عمليات الإنتاج", enabled: true, category: "additional" },
  { id: "contracts", name: "العقود", description: "إدارة العقود والتجديد", enabled: true, category: "additional" },
  { id: "ecommerce", name: "التجارة الإلكترونية", description: "إدارة المتجر الإلكتروني", enabled: true, category: "additional" },
  { id: "shipping", name: "النقل والشحن", description: "إدارة الشحنات والنقل", enabled: true, category: "additional" },
  
  // المديولات المتقدمة
  { id: "crm", name: "إدارة علاقات العملاء CRM", description: "متابعة العملاء والفرص البيعية", enabled: true, category: "advanced" },
  { id: "budgets", name: "الميزانيات والتخطيط المالي", description: "إعداد الميزانيات والتنبؤات", enabled: true, category: "advanced" },
  { id: "quality", name: "إدارة الجودة", description: "ضبط ومراقبة الجودة", enabled: true, category: "advanced" },
  { id: "maintenance", name: "الصيانة", description: "إدارة الصيانة الدورية", enabled: true, category: "advanced" },
  { id: "documents", name: "إدارة المستندات", description: "الأرشفة الإلكترونية", enabled: true, category: "advanced" },
  { id: "loyalty", name: "نقاط الولاء", description: "برامج الولاء والمكافآت", enabled: true, category: "advanced" },
  { id: "bi", name: "التقارير التحليلية BI", description: "لوحات تحكم ومؤشرات أداء", enabled: true, category: "advanced" },
  { id: "distributors", name: "الوكلاء والموزعون", description: "إدارة شبكة التوزيع", enabled: true, category: "advanced" },
  { id: "meetings", name: "الاجتماعات واللجان", description: "جدولة ومحاضر الاجتماعات", enabled: true, category: "advanced" },
  { id: "risk", name: "إدارة المخاطر", description: "تحديد وتقييم المخاطر", enabled: true, category: "advanced" },
];

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>(defaultModules);
  const { toast } = useToast();

  const handleToggle = (moduleId: string) => {
    setModules(prev =>
      prev.map(mod =>
        mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod
      )
    );
  };

  const handleSave = () => {
    // في التطبيق الفعلي، سيتم حفظ الإعدادات في قاعدة البيانات
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات المديولات",
    });
  };

  const enableAll = () => {
    setModules(prev => prev.map(mod => ({ ...mod, enabled: true })));
  };

  const disableAll = () => {
    setModules(prev => prev.map(mod => ({ ...mod, enabled: false })));
  };

  const coreModules = modules.filter(m => m.category === "core");
  const additionalModules = modules.filter(m => m.category === "additional");
  const advancedModules = modules.filter(m => m.category === "advanced");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              إدارة المديولات
            </h1>
            <p className="text-sm text-muted-foreground">
              قم بتفعيل أو إلغاء تفعيل المديولات حسب احتياجات شركتك
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={enableAll}
            data-testid="button-enable-all"
          >
            <Check className="w-4 h-4 ml-2" />
            تفعيل الكل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={disableAll}
            data-testid="button-disable-all"
          >
            <X className="w-4 h-4 ml-2" />
            إلغاء الكل
          </Button>
          <Button onClick={handleSave} data-testid="button-save-modules">
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* المديولات الأساسية */}
      <Card>
        <CardHeader>
          <CardTitle>المديولات الأساسية</CardTitle>
          <CardDescription>
            المديولات الرئيسية لتشغيل النظام (يُنصح بتفعيلها جميعاً)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coreModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`module-${module.id}`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => handleToggle(module.id)}
                  data-testid={`switch-${module.id}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* المديولات الإضافية */}
      <Card>
        <CardHeader>
          <CardTitle>المديولات الإضافية</CardTitle>
          <CardDescription>
            مديولات لتوسيع إمكانيات النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`module-${module.id}`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => handleToggle(module.id)}
                  data-testid={`switch-${module.id}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* المديولات المتقدمة */}
      <Card>
        <CardHeader>
          <CardTitle>المديولات المتقدمة</CardTitle>
          <CardDescription>
            مديولات متخصصة لاحتياجات متقدمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advancedModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`module-${module.id}`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => handleToggle(module.id)}
                  data-testid={`switch-${module.id}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" data-testid="button-save-modules-bottom">
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
}
