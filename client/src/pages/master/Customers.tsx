import { useState } from "react";
import { UserPlus, Save, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, type InsertCustomer, type Customer } from "@shared/schema";
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

export default function Customers() {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
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

  // Fetch all customers
  const { data: customers, isLoading, isError, error } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Create customer mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      return await apiRequest("POST", "/api/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة العميل بنجاح وإنشاء حساب محاسبي مرتبط",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة العميل",
        variant: "destructive",
      });
    },
  });

  // Update customer mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertCustomer }) => {
      return await apiRequest("PUT", `/api/customers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات العميل بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث العميل",
        variant: "destructive",
      });
    },
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف العميل بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف العميل",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleReset = () => {
    setSelectedCustomer(null);
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
    if (selectedCustomer) {
      if (confirm("هل أنت متأكد من حذف هذا العميل؟ سيتم حذف الحساب المحاسبي المرتبط أيضاً.")) {
        deleteMutation.mutate(selectedCustomer.id);
      }
    }
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.reset({
      code: customer.code,
      name: customer.name,
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      taxNumber: customer.taxNumber || "",
      openingBalance: customer.openingBalance,
      isActive: customer.isActive,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة بيانات العملاء
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCustomer ? "تعديل بيانات عميل" : "إضافة عميل جديد"}
          </CardTitle>
          <CardDescription>
            قم بإدخال بيانات العميل. سيتم إنشاء حساب محاسبي مرتبط تلقائياً
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
                      <FormLabel>كود العميل *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثال: C001"
                          data-testid="input-customer-code"
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
                      <FormLabel>اسم العميل *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل اسم العميل"
                          data-testid="input-customer-name"
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
                          data-testid="input-customer-phone"
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
                          data-testid="input-customer-email"
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
                          data-testid="input-customer-tax"
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
                        الرصيد المدين للعميل عند البداية
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
                        placeholder="أدخل عنوان العميل بالتفصيل"
                        rows={3}
                        data-testid="input-customer-address"
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
                  {selectedCustomer ? "تحديث" : "حفظ"}
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

                {selectedCustomer && (
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
              <CardTitle>قائمة العملاء</CardTitle>
              <CardDescription>
                اضغط على أي عميل لتعديله أو حذفه
              </CardDescription>
            </div>
            {customers && (
              <Badge variant="secondary" data-testid="text-customer-count">
                إجمالي العملاء: {customers.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-muted-foreground">جاري تحميل بيانات العملاء...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-2">⚠️ حدث خطأ في تحميل البيانات</div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "فشل في جلب بيانات العملاء"}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/customers"] })}
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : customers && customers.length > 0 ? (
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
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      onClick={() => handleRowClick(customer)}
                      className={`cursor-pointer hover-elevate ${
                        selectedCustomer?.id === customer.id
                          ? "bg-muted"
                          : ""
                      }`}
                      data-testid={`row-customer-${customer.id}`}
                    >
                      <TableCell className="font-medium" data-testid={`text-code-${customer.id}`}>
                        {customer.code}
                      </TableCell>
                      <TableCell data-testid={`text-name-${customer.id}`}>
                        {customer.name}
                      </TableCell>
                      <TableCell data-testid={`text-phone-${customer.id}`}>
                        {customer.phone || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-email-${customer.id}`}>
                        {customer.email || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-tax-${customer.id}`}>
                        {customer.taxNumber || "-"}
                      </TableCell>
                      <TableCell 
                        className={`text-left font-semibold ${
                          parseFloat(customer.currentBalance) > 0 
                            ? "text-green-600 dark:text-green-400" 
                            : parseFloat(customer.currentBalance) < 0
                            ? "text-red-600 dark:text-red-400"
                            : ""
                        }`}
                        data-testid={`text-balance-${customer.id}`}
                      >
                        {parseFloat(customer.currentBalance).toFixed(2)} ر.س
                      </TableCell>
                      <TableCell data-testid={`text-status-${customer.id}`}>
                        <Badge variant={customer.isActive ? "default" : "secondary"}>
                          {customer.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا يوجد عملاء مسجلين. قم بإضافة عميل جديد من الأعلى.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
