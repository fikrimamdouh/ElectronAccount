import { useState } from "react";
import { UserPlus, Save, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSupplierSchema, type InsertSupplier, type Supplier } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Suppliers() {
  const { toast } = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      code: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      openingBalance: "0",
      isActive: 1,
    },
  });

  // Fetch all suppliers
  const { data: suppliers, isLoading, isError, error } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  // Create supplier mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertSupplier) => {
      return await apiRequest("POST", "/api/suppliers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة المورد بنجاح وإنشاء حساب محاسبي مرتبط",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المورد",
        variant: "destructive",
      });
    },
  });

  // Update supplier mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertSupplier }) => {
      return await apiRequest("PUT", `/api/suppliers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المورد بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث المورد",
        variant: "destructive",
      });
    },
  });

  // Delete supplier mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المورد بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المورد",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSupplier) => {
    if (selectedSupplier) {
      updateMutation.mutate({ id: selectedSupplier.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleReset = () => {
    setSelectedSupplier(null);
    form.reset({
      code: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      openingBalance: "0",
      isActive: 1,
    });
  };

  const handleDelete = () => {
    if (selectedSupplier) {
      if (confirm("هل أنت متأكد من حذف هذا المورد؟ سيتم حذف الحساب المحاسبي المرتبط أيضاً.")) {
        deleteMutation.mutate(selectedSupplier.id);
      }
    }
  };

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    form.reset({
      code: supplier.code,
      name: supplier.name,
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      taxNumber: supplier.taxNumber || "",
      openingBalance: supplier.openingBalance,
      isActive: supplier.isActive,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة بيانات الموردين
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedSupplier ? "تعديل بيانات مورد" : "إضافة مورد جديد"}
          </CardTitle>
          <CardDescription>
            قم بإدخال بيانات المورد. سيتم إنشاء حساب محاسبي مرتبط تلقائياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كود المورد *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثال: S001"
                          data-testid="input-supplier-code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المورد *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل اسم المورد"
                          data-testid="input-supplier-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="05xxxxxxxx"
                          data-testid="input-supplier-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@email.com"
                          data-testid="input-supplier-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرقم الضريبي / السجل التجاري</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="رقم السجل أو الرقم الضريبي"
                          data-testid="input-supplier-tax"
                        />
                      </FormControl>
                      <FormDescription>
                        للشركات فقط (متوافق مع الزكاة والدخل)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="openingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرصيد الافتتاحي</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-opening-balance"
                        />
                      </FormControl>
                      <FormDescription>
                        الرصيد الدائن للمورد عند البداية (المبالغ المستحقة للمورد)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="أدخل عنوان المورد بالتفصيل"
                        rows={3}
                        data-testid="input-supplier-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 flex-wrap">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {selectedSupplier ? "تحديث" : "حفظ"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  جديد
                </Button>

                {selectedSupplier && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle>قائمة الموردين</CardTitle>
              <CardDescription>
                اضغط على أي مورد لتعديله أو حذفه
              </CardDescription>
            </div>
            {suppliers && (
              <Badge variant="secondary" data-testid="text-supplier-count">
                إجمالي الموردين: {suppliers.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-muted-foreground">جاري تحميل بيانات الموردين...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-2">⚠️ حدث خطأ في تحميل البيانات</div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "فشل في جلب بيانات الموردين"}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] })}
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : suppliers && suppliers.length > 0 ? (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>البريد</TableHead>
                    <TableHead>الرقم الضريبي</TableHead>
                    <TableHead className="text-left">الرصيد الحالي</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      onClick={() => handleRowClick(supplier)}
                      className={`cursor-pointer hover-elevate ${
                        selectedSupplier?.id === supplier.id
                          ? "bg-muted"
                          : ""
                      }`}
                      data-testid={`row-supplier-${supplier.id}`}
                    >
                      <TableCell className="font-medium" data-testid={`text-code-${supplier.id}`}>
                        {supplier.code}
                      </TableCell>
                      <TableCell data-testid={`text-name-${supplier.id}`}>
                        {supplier.name}
                      </TableCell>
                      <TableCell data-testid={`text-phone-${supplier.id}`}>
                        {supplier.phone || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-email-${supplier.id}`}>
                        {supplier.email || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-tax-${supplier.id}`}>
                        {supplier.taxNumber || "-"}
                      </TableCell>
                      <TableCell 
                        className={`text-left font-semibold ${
                          parseFloat(supplier.currentBalance) > 0 
                            ? "text-green-600 dark:text-green-400" 
                            : parseFloat(supplier.currentBalance) < 0
                            ? "text-red-600 dark:text-red-400"
                            : ""
                        }`}
                        data-testid={`text-balance-${supplier.id}`}
                      >
                        {parseFloat(supplier.currentBalance).toFixed(2)} ر.س
                      </TableCell>
                      <TableCell data-testid={`text-status-${supplier.id}`}>
                        <Badge variant={supplier.isActive ? "default" : "secondary"}>
                          {supplier.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا يوجد موردين مسجلين. قم بإضافة مورد جديد من الأعلى.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
