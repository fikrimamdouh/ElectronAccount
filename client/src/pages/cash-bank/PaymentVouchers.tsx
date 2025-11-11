import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FullPaymentVoucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  supplierId: string;
  amount: string;
  paymentMethod: "نقداً" | "تحويل بنكي" | "شيك";
  sourceAccountId: string;
  checkNumber?: string | null;
  checkDate?: string | null;
  checkBank?: string | null;
  status: "مسودة" | "منشور";
  entryId?: string | null;
  postedAt?: string | null;
  notes?: string | null;
  supplierName?: string;
  sourceAccountName?: string;
}

interface Supplier {
  id: string;
  code: string;
  name: string;
}

interface Account {
  id: string;
  code: string;
  name: string;
  category: string;
}

const voucherFormSchema = z.object({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().min(1, "تاريخ السند مطلوب"),
  supplierId: z.string().min(1, "المورد مطلوب"),
  amount: z.string().min(1, "المبلغ مطلوب").refine((val) => parseFloat(val) > 0, "المبلغ يجب أن يكون أكبر من صفر"),
  paymentMethod: z.enum(["نقداً", "تحويل بنكي", "شيك"]),
  sourceAccountId: z.string().min(1, "حساب الدفع مطلوب"),
  checkNumber: z.string().optional(),
  checkDate: z.string().optional(),
  checkBank: z.string().optional(),
  notes: z.string().optional(),
});

type VoucherFormValues = z.infer<typeof voucherFormSchema>;

export default function PaymentVouchers() {
  const { toast } = useToast();
  const [formDialog, setFormDialog] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      voucherNumber: "",
      voucherDate: new Date().toISOString().split("T")[0],
      supplierId: "",
      amount: "",
      paymentMethod: "نقداً",
      sourceAccountId: "",
      checkNumber: "",
      checkDate: "",
      checkBank: "",
      notes: "",
    },
  });

  const { data: vouchers, isLoading, error, refetch } = useQuery<FullPaymentVoucher[]>({
    queryKey: ["/api/payment-vouchers"],
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  // Filter accounts for payment methods
  const cashAccounts = accounts?.filter((acc) => acc.category === "نقدية") || [];
  const bankAccounts = accounts?.filter((acc) => acc.category === "البنك") || [];

  const createMutation = useMutation({
    mutationFn: async (data: VoucherFormValues) => {
      const payload = {
        ...data,
        allocations: [],
      };
      return apiRequest("POST", "/api/payment-vouchers", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-vouchers"] });
      toast({
        title: "تم الحفظ",
        description: "تم إنشاء السند بنجاح",
      });
      setFormDialog({ open: false });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "فشل الحفظ",
        description: error.message || "حدث خطأ أثناء إنشاء السند",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/payment-vouchers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-vouchers"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف السند بنجاح",
      });
      setDeleteDialog({ open: false, id: null });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الحذف",
        description: error.message || "حدث خطأ أثناء حذف السند",
        variant: "destructive",
      });
    },
  });

  const postMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/payment-vouchers/${id}/post`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-vouchers"] });
      toast({
        title: "تم النشر",
        description: "تم نشر السند بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل النشر",
        description: error.message || "حدث خطأ أثناء نشر السند",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = () => {
    if (deleteDialog.id) {
      deleteMutation.mutate(deleteDialog.id);
    }
  };

  const handlePost = (id: string) => {
    postMutation.mutate(id);
  };

  const openCreateDialog = () => {
    form.reset({
      voucherNumber: `PV-${Date.now()}`,
      voucherDate: new Date().toISOString().split("T")[0],
      supplierId: "",
      amount: "",
      paymentMethod: "نقداً",
      sourceAccountId: "",
      checkNumber: "",
      checkDate: "",
      checkBank: "",
      notes: "",
    });
    setFormDialog({ open: true });
  };

  const onSubmit = (data: VoucherFormValues) => {
    createMutation.mutate(data);
  };

  const paymentMethod = form.watch("paymentMethod");
  const availableAccounts =
    paymentMethod === "نقداً"
      ? cashAccounts
      : paymentMethod === "تحويل بنكي" || paymentMethod === "شيك"
        ? bankAccounts
        : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-state">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64" data-testid="error-state">
        <p className="text-destructive mb-4">حدث خطأ أثناء جلب السندات</p>
        <Button onClick={() => refetch()} data-testid="button-retry">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">سندات الدفع</h1>
          <p className="text-muted-foreground mt-1">إدارة سندات دفع المبالغ إلى الموردين</p>
        </div>
        <Button onClick={openCreateDialog} data-testid="button-create-payment-voucher">
          <Plus className="ml-2 h-4 w-4" />
          سند جديد
        </Button>
      </div>

      {vouchers && vouchers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg" data-testid="empty-state">
          <p className="text-muted-foreground">لا توجد سندات دفع حتى الآن</p>
          <Button className="mt-4" onClick={openCreateDialog} data-testid="button-create-first-payment-voucher">
            <Plus className="ml-2 h-4 w-4" />
            إنشاء أول سند
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg" data-testid="table-payment-vouchers">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم السند</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المورد</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">طريقة الدفع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers?.map((voucher) => (
                <TableRow key={voucher.id} data-testid={`row-payment-voucher-${voucher.id}`}>
                  <TableCell className="font-medium" data-testid={`text-payment-number-${voucher.id}`}>
                    {voucher.voucherNumber}
                  </TableCell>
                  <TableCell data-testid={`text-payment-date-${voucher.id}`}>
                    {new Date(voucher.voucherDate).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell data-testid={`text-payment-supplier-${voucher.id}`}>
                    {voucher.supplierName}
                  </TableCell>
                  <TableCell data-testid={`text-payment-amount-${voucher.id}`}>
                    {parseFloat(voucher.amount).toLocaleString("ar-SA", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ريال
                  </TableCell>
                  <TableCell data-testid={`text-payment-method-${voucher.id}`}>
                    {voucher.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={voucher.status === "منشور" ? "default" : "secondary"}
                      data-testid={`badge-payment-status-${voucher.id}`}
                    >
                      {voucher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {voucher.status === "مسودة" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handlePost(voucher.id)}
                            disabled={postMutation.isPending}
                            data-testid={`button-post-payment-${voucher.id}`}
                          >
                            <CheckCircle className="ml-2 h-4 w-4" />
                            نشر
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(voucher.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-payment-${voucher.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {voucher.status === "منشور" && (
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-view-payment-${voucher.id}`}
                        >
                          <Eye className="ml-2 h-4 w-4" />
                          عرض
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ open })}>
        <DialogContent className="max-w-2xl" data-testid="form-payment-voucher">
          <DialogHeader>
            <DialogTitle>سند دفع جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات السند. يمكنك تعديله لاحقاً قبل النشر.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="voucherNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم السند</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-payment-voucher-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voucherDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التاريخ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-payment-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المورد</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-payment-supplier">
                          <SelectValue placeholder="اختر مورد" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id}
                            data-testid={`option-payment-supplier-${supplier.id}`}
                          >
                            {supplier.code} - {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المبلغ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          data-testid="input-payment-amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>طريقة الدفع</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="نقداً" data-testid="option-payment-cash">نقداً</SelectItem>
                          <SelectItem value="تحويل بنكي" data-testid="option-payment-transfer">تحويل بنكي</SelectItem>
                          <SelectItem value="شيك" data-testid="option-payment-check">شيك</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sourceAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حساب الدفع</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-payment-source-account">
                          <SelectValue placeholder="اختر حساب الدفع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAccounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            data-testid={`option-payment-account-${account.id}`}
                          >
                            {account.code} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod === "شيك" && (
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="checkNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الشيك</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-payment-check-number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الشيك</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-payment-check-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkBank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البنك</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-payment-check-bank" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-payment-notes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormDialog({ open: false })}
                  data-testid="button-cancel-payment"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-payment"
                >
                  {createMutation.isPending ? "جاري الحفظ..." : "حفظ السند"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا السند؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-payment">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-payment"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
