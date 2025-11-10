import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFullSalesInvoiceSchema, type InsertFullSalesInvoice, type FullSalesInvoice, type Product, type Customer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Plus, Edit, Trash2, Send, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface InvoiceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export default function SalesInvoices() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<FullSalesInvoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Fetch invoices
  const { data: invoices, isLoading, error } = useQuery<FullSalesInvoice[]>({
    queryKey: ["/api/sales-invoices"],
  });

  // Fetch products for dropdown
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch customers for dropdown
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const form = useForm<InsertFullSalesInvoice>({
    resolver: zodResolver(insertFullSalesInvoiceSchema),
    defaultValues: {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      customerId: "",
      taxRate: "0.15",
      notes: "",
      items: [],
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertFullSalesInvoice) => {
      return await apiRequest("POST", "/api/sales-invoices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-invoices"] });
      toast({
        title: "تم الحفظ",
        description: "تم إنشاء الفاتورة بنجاح",
      });
      setIsDialogOpen(false);
      form.reset();
      setInvoiceItems([]);
      setEditingInvoice(null);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ الفاتورة",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertFullSalesInvoice }) => {
      return await apiRequest("PUT", `/api/sales-invoices/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-invoices"] });
      toast({
        title: "تم التحديث",
        description: "تم تعديل الفاتورة بنجاح",
      });
      setIsDialogOpen(false);
      form.reset();
      setInvoiceItems([]);
      setEditingInvoice(null);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تعديل الفاتورة",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/sales-invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-invoices"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الفاتورة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف الفاتورة",
        variant: "destructive",
      });
    },
  });

  // Post mutation
  const postMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/sales-invoices/${id}/post`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "تم النشر",
        description: "تم نشر الفاتورة وتحديث المخزون والحسابات",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في نشر الفاتورة",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFullSalesInvoice) => {
    if (invoiceItems.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة صنف واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...data,
      items: invoiceItems,
    };

    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (invoice: FullSalesInvoice) => {
    setEditingInvoice(invoice);
    form.reset({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
      customerId: invoice.customerId,
      taxRate: invoice.taxRate,
      notes: invoice.notes || "",
      items: [],
    });
    setInvoiceItems(invoice.items.map(item => ({
      productId: item.productId,
      quantity: parseFloat(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
    })));
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePost = (id: string) => {
    if (confirm("هل أنت متأكد من نشر هذه الفاتورة؟ لن يمكنك التعديل عليها بعد النشر.")) {
      postMutation.mutate(id);
    }
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  if (isLoading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-destructive p-4">خطأ: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            فواتير المبيعات
          </h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            form.reset();
            setInvoiceItems([]);
            setEditingInvoice(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-invoice">
              <Plus className="ml-2 w-4 h-4" />
              فاتورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? "تعديل فاتورة مبيعات" : "فاتورة مبيعات جديدة"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الفاتورة</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-invoice-number" placeholder="INV-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الفاتورة</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={typeof field.value === 'string' ? field.value : field.value.toISOString().split('T')[0]}
                            data-testid="input-invoice-date" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العميل</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-customer">
                              <SelectValue placeholder="اختر العميل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers?.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نسبة الضريبة</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-tax-rate" placeholder="0.15" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ملاحظات</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-notes" placeholder="ملاحظات إضافية..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">الأصناف</h3>
                    <Button type="button" onClick={addItem} variant="outline" size="sm" data-testid="button-add-item">
                      <Plus className="ml-2 w-4 h-4" />
                      إضافة صنف
                    </Button>
                  </div>

                  {invoiceItems.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-4 gap-4 items-end">
                          <div className="col-span-2">
                            <label className="text-sm font-medium">الصنف</label>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => {
                                const product = products?.find(p => p.id === value);
                                if (product) {
                                  updateItem(index, 'productId', value);
                                  updateItem(index, 'unitPrice', parseFloat(product.salePrice));
                                }
                              }}
                            >
                              <SelectTrigger data-testid={`select-product-${index}`}>
                                <SelectValue placeholder="اختر الصنف" />
                              </SelectTrigger>
                              <SelectContent>
                                {products?.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.itemName} ({product.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">الكمية</label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              data-testid={`input-quantity-${index}`}
                              min="1"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">السعر</label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              data-testid={`input-price-${index}`}
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-muted-foreground">
                            المجموع: {(item.quantity * item.unitPrice).toFixed(2)} ر.س
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {invoiceItems.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      لم يتم إضافة أصناف بعد
                    </div>
                  )}
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>المجموع قبل الضريبة:</span>
                        <span className="font-semibold">{subtotal.toFixed(2)} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ضريبة القيمة المضافة (15%):</span>
                        <span className="font-semibold">{tax.toFixed(2)} ر.س</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>الإجمالي:</span>
                        <span className="text-primary">{total.toFixed(2)} ر.س</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {editingInvoice ? "تحديث الفاتورة" : "حفظ كمسودة"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الفاتورة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{parseFloat(invoice.totalAfterTax).toFixed(2)} ر.س</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "منشورة" ? "default" : "secondary"}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2 justify-end">
                        {invoice.status === "مسودة" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(invoice)}
                              data-testid={`button-edit-${invoice.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(invoice.id)}
                              data-testid={`button-delete-${invoice.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePost(invoice.id)}
                              data-testid={`button-post-${invoice.id}`}
                              disabled={postMutation.isPending}
                            >
                              <Send className="w-4 h-4 ml-1" />
                              نشر
                            </Button>
                          </>
                        )}
                        {invoice.status === "منشورة" && (
                          <Badge variant="outline" className="text-green-600">
                            ✓ منشورة
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    لا توجد فواتير بعد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
