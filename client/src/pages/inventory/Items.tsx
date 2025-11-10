import { useState } from "react";
import { PackageCheck, Plus, Save, Trash2, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Items() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      itemCode: "",
      itemName: "",
      unit: "حبة",
      salePrice: "0",
      costPrice: "0",
    },
  });

  // Fetch all products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة الصنف بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة الصنف",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertProduct }) => {
      return await apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الصنف بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث الصنف",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الصنف بنجاح",
      });
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف الصنف",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleReset = () => {
    setSelectedProduct(null);
    form.reset({
      itemCode: "",
      itemName: "",
      unit: "حبة",
      salePrice: "0",
      costPrice: "0",
    });
  };

  const handleDelete = () => {
    if (selectedProduct) {
      if (confirm("هل أنت متأكد من حذف هذا الصنف؟")) {
        deleteMutation.mutate(selectedProduct.id);
      }
    }
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    form.reset({
      itemCode: product.itemCode,
      itemName: product.itemName,
      unit: product.unit as "حبة" | "كرتون" | "كيلو",
      salePrice: product.salePrice,
      costPrice: product.costPrice,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          إدارة بطاقات الأصناف
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedProduct ? "تعديل صنف" : "إضافة صنف جديد"}
          </CardTitle>
          <CardDescription>
            قم بإدخال بيانات الصنف في الحقول التالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itemCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كود الصنف</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل كود الصنف"
                          data-testid="input-item-code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الصنف</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل اسم الصنف"
                          data-testid="input-item-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوحدة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-unit">
                            <SelectValue placeholder="اختر الوحدة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="حبة">حبة</SelectItem>
                          <SelectItem value="كرتون">كرتون</SelectItem>
                          <SelectItem value="كيلو">كيلو</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر البيع</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-sale-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر التكلفة</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-cost-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {selectedProduct ? "تحديث" : "حفظ"}
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

                {selectedProduct && (
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
          <CardTitle>قائمة الأصناف</CardTitle>
          <CardDescription>
            اضغط على أي صنف لتعديله أو حذفه
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : products && products.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>كود الصنف</TableHead>
                    <TableHead>اسم الصنف</TableHead>
                    <TableHead>الوحدة</TableHead>
                    <TableHead>سعر البيع</TableHead>
                    <TableHead>سعر التكلفة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      onClick={() => handleRowClick(product)}
                      className={`cursor-pointer hover-elevate ${
                        selectedProduct?.id === product.id
                          ? "bg-muted"
                          : ""
                      }`}
                      data-testid={`row-product-${product.id}`}
                    >
                      <TableCell data-testid={`text-code-${product.id}`}>
                        {product.itemCode}
                      </TableCell>
                      <TableCell data-testid={`text-name-${product.id}`}>
                        {product.itemName}
                      </TableCell>
                      <TableCell data-testid={`text-unit-${product.id}`}>
                        {product.unit}
                      </TableCell>
                      <TableCell data-testid={`text-sale-price-${product.id}`}>
                        {parseFloat(product.salePrice).toFixed(2)}
                      </TableCell>
                      <TableCell data-testid={`text-cost-price-${product.id}`}>
                        {parseFloat(product.costPrice).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد أصناف مسجلة. قم بإضافة صنف جديد من الأعلى.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
