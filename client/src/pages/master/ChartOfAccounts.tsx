import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertAccountSchema,
  type Account,
  type InsertAccount,
  type AccountType,
  type AccountCategory,
} from "@shared/schema";
import { BookOpen, Edit, Layers, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { Badge as StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const accountTypes: AccountType[] = ["أصول", "خصوم", "إيرادات", "مصروفات", "حقوق ملكية"];
const accountCategories: AccountCategory[] = ["نقدية", "البنك", "أخرى"];

type AccountFormValues = InsertAccount;

const defaultValues: AccountFormValues = {
  code: "",
  name: "",
  type: "أصول",
  category: "أخرى",
  parentId: undefined,
  isActive: 1,
};

function normalizeValues(values: AccountFormValues): AccountFormValues {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    type: values.type,
    category: values.category ?? "أخرى",
    parentId: values.parentId && values.parentId.length > 0 ? values.parentId : undefined,
    isActive: values.isActive ?? 1,
  };
}

export default function ChartOfAccounts() {
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AccountType | "الكل">("الكل");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(insertAccountSchema),
    defaultValues,
  });

  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
  } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  useEffect(() => {
    if (!selectedAccountId) {
      form.reset(defaultValues);
      return;
    }

    const account = accounts.find((item) => item.id === selectedAccountId);
    if (account) {
      form.reset({
        code: account.code,
        name: account.name,
        type: account.type,
        category: (account.category as AccountCategory) ?? "أخرى",
        parentId: account.parentId ?? undefined,
        isActive: account.isActive ?? 1,
      });
    }
  }, [accounts, form, selectedAccountId]);

  const accountById = useMemo(() => {
    return new Map(accounts.map((account) => [account.id, account]));
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((account) => {
        if (typeFilter !== "الكل" && account.type !== typeFilter) {
          return false;
        }
        if (!searchQuery) {
          return true;
        }
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return (
          account.name.toLowerCase().includes(normalizedQuery) ||
          account.code.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => a.code.localeCompare(b.code, "ar"));
  }, [accounts, searchQuery, typeFilter]);

  const groupedAccounts = useMemo(() => {
    return accountTypes.map((type) => ({
      type,
      accounts: filteredAccounts.filter((account) => account.type === type),
    }));
  }, [filteredAccounts]);

  const createAccountMutation = useMutation<Account, Error, AccountFormValues>({
    mutationFn: async (values) => {
      const response = await apiRequest("POST", "/api/accounts", normalizeValues(values));
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: `تم إنشاء الحساب ${data.code} - ${data.name}`,
      });
      handleReset();
    },
    onError: (mutationError) => {
      toast({
        title: "خطأ",
        description: mutationError.message ?? "فشل في إضافة الحساب",
        variant: "destructive",
      });
    },
  });

  const updateAccountMutation = useMutation<Account, Error, { id: string; values: AccountFormValues }>({
    mutationFn: async ({ id, values }) => {
      const response = await apiRequest("PUT", `/api/accounts/${id}`, normalizeValues(values));
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث بيانات الحساب ${data.code}`,
      });
      handleReset();
    },
    onError: (mutationError) => {
      toast({
        title: "خطأ",
        description: mutationError.message ?? "فشل في تحديث الحساب",
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      setDeletingId(id);
      await apiRequest("DELETE", `/api/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الحساب بنجاح",
      });
      if (selectedAccountId) {
        handleReset();
      }
    },
    onError: (mutationError) => {
      toast({
        title: "خطأ",
        description: mutationError.message ?? "فشل في حذف الحساب",
        variant: "destructive",
      });
    },
    onSettled: () => setDeletingId(null),
  });

  const isSubmitting = createAccountMutation.isPending || updateAccountMutation.isPending;

  const handleSubmit = (values: AccountFormValues) => {
    if (selectedAccountId) {
      updateAccountMutation.mutate({ id: selectedAccountId, values });
      return;
    }
    createAccountMutation.mutate(values);
  };

  const handleReset = () => {
    setSelectedAccountId(null);
    form.reset(defaultValues);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccountId(account.id);
  };

  const handleDelete = (account: Account) => {
    if (confirm(`هل ترغب في حذف الحساب ${account.code} - ${account.name}؟`)) {
      deleteAccountMutation.mutate(account.id);
    }
  };

  return (
    <div className="space-y-6" data-testid="chart-of-accounts-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div className="text-right">
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              دليل الحسابات
            </h1>
            <p className="text-muted-foreground">إدارة الحسابات الرئيسية والفرعية وتصنيفها</p>
          </div>
        </div>
        <Button type="button" className="gap-2" size="lg" onClick={handleReset} data-testid="button-new-account">
          <Plus className="h-4 w-4" />
          حساب جديد
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{selectedAccountId ? "تعديل حساب" : "إضافة حساب"}</CardTitle>
            <CardDescription>
              قم بتعريف الحسابات المالية وربطها بالهيكل المحاسبي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="form-account">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رمز الحساب *</FormLabel>
                        <FormControl>
                          <Input placeholder="1001" autoComplete="off" {...field} />
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
                        <FormLabel>اسم الحساب *</FormLabel>
                        <FormControl>
                          <Input placeholder="النقدية بالصندوق" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الحساب *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الحساب" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التصنيف</FormLabel>
                        <Select value={field.value ?? "أخرى"} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر تصنيف الحساب" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الحساب الرئيسي</FormLabel>
                        <Select
                          value={field.value ?? "none"}
                          onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحساب الرئيسي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">لا يوجد (حساب رئيسي)</SelectItem>
                            {accounts
                              .filter((account) => account.id !== selectedAccountId)
                              .map((account) => (
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-1">
                          <FormLabel className="font-medium">حالة الحساب</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            تحكم في ظهور الحساب في القيود والتقارير
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value === 1} onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>وصف الحساب</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ملاحظات إضافية حول استخدام الحساب" rows={3} disabled />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      سيتم دعم الملاحظات التفصيلية في المرحلة القادمة
                    </p>
                  </FormItem>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  {selectedAccountId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleDelete(accountById.get(selectedAccountId)!)}
                      disabled={deletingId === selectedAccountId}
                    >
                      {deletingId === selectedAccountId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      حذف الحساب
                    </Button>
                  )}
                  <Button type="button" variant="secondary" className="gap-2" onClick={handleReset} disabled={isSubmitting}>
                    <RotateCcw className="h-4 w-4" />
                    إعادة تعيين
                  </Button>
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {selectedAccountId ? "تحديث الحساب" : "حفظ الحساب"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                هيكل الحسابات
              </CardTitle>
              <CardDescription>
                استعرض الحسابات بحسب النوع أو ابحث باستخدام الرمز والاسم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel className="text-sm">البحث</FormLabel>
                  <Input
                    placeholder="اكتب اسم أو رمز الحساب"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    data-testid="input-search-accounts"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel className="text-sm">تصفية حسب النوع</FormLabel>
                  <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AccountType | "الكل")}> 
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">كل الأنواع</SelectItem>
                      {accountTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>قائمة الحسابات</CardTitle>
              <CardDescription>
                {isLoading ? "جاري تحميل الحسابات" : `عدد الحسابات: ${filteredAccounts.length}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الرمز</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                      <TableHead className="text-right">الرئيسي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                          جاري تحميل البيانات...
                        </TableCell>
                      </TableRow>
                    )}

                    {isError && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-6 text-center text-destructive">
                          حدث خطأ أثناء تحميل الحسابات: {error instanceof Error ? error.message : ""}
                        </TableCell>
                      </TableRow>
                    )}

                    {!isLoading && !isError && filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                          لا توجد حسابات مطابقة لمعايير البحث الحالية
                        </TableCell>
                      </TableRow>
                    )}

                    {!isLoading && !isError &&
                      groupedAccounts.map((group) =>
                        group.accounts.length > 0 ? (
                          <Fragment key={group.type}>
                            <TableRow className="bg-muted/40">
                              <TableCell colSpan={8} className="font-semibold text-primary">
                                {group.type}
                              </TableCell>
                            </TableRow>
                            {group.accounts.map((account) => (
                              <TableRow
                                key={account.id}
                                data-state={selectedAccountId === account.id ? "selected" : undefined}
                                className={selectedAccountId === account.id ? "bg-primary/5" : undefined}
                              >
                                <TableCell className="font-mono">{account.code}</TableCell>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{account.type}</TableCell>
                                <TableCell>{(account.category as AccountCategory) ?? "أخرى"}</TableCell>
                                <TableCell className="font-mono">{account.balance} ريال</TableCell>
                                <TableCell>
                                  {account.parentId ? (
                                    <span className="text-sm text-muted-foreground">
                                      {accountById.get(account.parentId)?.code ?? "-"}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <StatusBadge variant={account.isActive ? "default" : "secondary"}>
                                    {account.isActive ? "نشط" : "موقوف"}
                                  </StatusBadge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => handleEdit(account)}
                                    >
                                      <Edit className="h-4 w-4" /> تعديل
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="gap-1 text-destructive"
                                      onClick={() => handleDelete(account)}
                                      disabled={deletingId === account.id}
                                    >
                                      {deletingId === account.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                      حذف
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </Fragment>
                        ) : null,
                      )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
