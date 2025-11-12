import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFullEntrySchema, type FullEntry, type Account, type InsertFullEntry } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Entries() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: entries, isLoading } = useQuery<FullEntry[]>({
    queryKey: ["/api/entries"],
  });

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const form = useForm<InsertFullEntry>({
    resolver: zodResolver(insertFullEntrySchema),
    defaultValues: {
      entryNumber: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      lines: [
        { accountId: "", debit: "0", credit: "0", description: "" },
        { accountId: "", debit: "0", credit: "0", description: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFullEntry) => {
      return apiRequest("POST", "/api/entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة القيد المحاسبي بنجاح",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة القيد",
        variant: "destructive",
      });
    },
  });

  const calculateTotals = () => {
    const lines = form.watch("lines");
    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit && totalDebit > 0 };
  };

  const totals = calculateTotals();

  return (
    <div className="p-8 space-y-6" data-testid="page-entries">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            القيود اليومية
          </h1>
          <p className="text-muted-foreground">
            تسجيل القيود المحاسبية بنظام القيد المزدوج
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setIsDialogOpen(true)}
          data-testid="button-new-entry"
        >
          <PlusCircle className="w-5 h-5 me-2" />
          قيد جديد
        </Button>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-6" data-testid={`entry-card-${entry.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold" data-testid="text-entry-number">
                      قيد رقم: {entry.entryNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        entry.isBalanced
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                      data-testid="text-entry-status"
                    >
                      {entry.isBalanced ? "متوازن" : "غير متوازن"}
                    </span>
                  </div>
                  <p className="text-muted-foreground" data-testid="text-entry-description">
                    {entry.description}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-right p-3 font-medium">الحساب</th>
                      <th className="text-right p-3 font-medium">البيان</th>
                      <th className="text-right p-3 font-medium">مدين</th>
                      <th className="text-right p-3 font-medium">دائن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.lines.map((line) => (
                      <tr key={line.id} className="border-t">
                        <td className="p-3">{line.accountName || line.accountId}</td>
                        <td className="p-3 text-muted-foreground">{line.description}</td>
                        <td className="p-3 font-mono font-medium">
                          {Number(line.debit) > 0 ? `${line.debit} ريال` : "-"}
                        </td>
                        <td className="p-3 font-mono font-medium">
                          {Number(line.credit) > 0 ? `${line.credit} ريال` : "-"}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t font-bold bg-muted/50">
                      <td className="p-3" colSpan={2}>
                        الإجمالي
                      </td>
                      <td className="p-3 font-mono" data-testid="text-total-debit">
                        {entry.totalDebit} ريال
                      </td>
                      <td className="p-3 font-mono" data-testid="text-total-credit">
                        {entry.totalCredit} ريال
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <PlusCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mb-2">لا توجد قيود محاسبية</h3>
          <p className="text-muted-foreground mb-6">ابدأ بإضافة أول قيد محاسبي</p>
          <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-entry">
            <PlusCircle className="w-5 h-5 me-2" />
            إضافة قيد جديد
          </Button>
        </Card>
      )}

      {/* Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة قيد محاسبي جديد</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entryNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم القيد</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: JV-001" data-testid="input-entry-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التاريخ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-entry-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                      render={({ field }) => {
                    const { value, onChange, ...rest } = field;
                    const normalizedValue = value
                      ? value instanceof Date
                        ? value.toISOString().split("T")[0]
                        : value
                      : "";

                    return (
                      <FormItem>
                        <FormLabel>التاريخ</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...rest}
                            value={normalizedValue}
                            onChange={(event) => onChange(event.target.value)}
                            data-testid="input-entry-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البيان</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="وصف القيد المحاسبي" data-testid="input-entry-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entry Lines */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">سطور القيد</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ accountId: "", debit: "0", credit: "0", description: "" })}
                    data-testid="button-add-line"
                  >
                    <PlusCircle className="w-4 h-4 me-2" />
                    إضافة سطر
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.accountId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحساب</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid={`select-account-${index}`}>
                                  <SelectValue placeholder="اختر حساب" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accounts?.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.code} - {account.name}
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
                        name={`lines.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مدين</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                data-testid={`input-debit-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lines.${index}.credit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>دائن</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                data-testid={`input-credit-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 2}
                          data-testid={`button-remove-line-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Totals */}
              <Card className={`p-4 ${!totals.isBalanced ? "border-red-500" : "border-green-500"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!totals.isBalanced && <AlertCircle className="w-5 h-5 text-red-500" />}
                    <span className="font-medium">
                      {totals.isBalanced ? "القيد متوازن" : "القيد غير متوازن"}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <span className="text-muted-foreground ms-2">إجمالي المدين:</span>
                      <span className="font-mono font-bold" data-testid="text-dialog-total-debit">
                        {totals.totalDebit.toFixed(2)} ريال
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground ms-2">إجمالي الدائن:</span>
                      <span className="font-mono font-bold" data-testid="text-dialog-total-credit">
                        {totals.totalCredit.toFixed(2)} ريال
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-entry"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !totals.isBalanced}
                  data-testid="button-submit-entry"
                >
                  {createMutation.isPending ? "جاري الحفظ..." : "حفظ القيد"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
