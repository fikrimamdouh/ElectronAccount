import { Building2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CompanySettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إعدادات بيانات الشركة
        </h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">اسم الشركة *</Label>
              <Input
                id="company-name"
                placeholder="أدخل اسم الشركة"
                data-testid="input-company-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercial-reg">السجل التجاري *</Label>
              <Input
                id="commercial-reg"
                placeholder="رقم السجل التجاري"
                data-testid="input-commercial-reg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-number">الرقم الضريبي *</Label>
              <Input
                id="tax-number"
                placeholder="الرقم الضريبي"
                data-testid="input-tax-number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="رقم الهاتف"
                data-testid="input-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="البريد الإلكتروني"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                placeholder="www.example.com"
                data-testid="input-website"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              placeholder="العنوان الكامل للشركة"
              className="min-h-[100px]"
              data-testid="textarea-address"
            />
          </div>

          <div className="space-y-2">
            <Label>شعار الشركة</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/10">
                <Upload className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" data-testid="button-upload-logo">
                  <Upload className="w-4 h-4 me-2" />
                  رفع الشعار
                </Button>
                <p className="text-sm text-muted-foreground">
                  يفضل صورة بصيغة PNG أو JPG بحجم 500x500 بكسل
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button data-testid="button-save-settings">
              حفظ الإعدادات
            </Button>
            <Button variant="outline" data-testid="button-cancel">
              إلغاء
            </Button>
          </div>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground">
        * الحقول المطلوبة | ستظهر هذه البيانات في الفواتير والتقارير والمستندات الرسمية
      </p>
    </div>
  );
}
