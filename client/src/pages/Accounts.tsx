import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAccountSchema, type Account, type InsertAccount, type AccountType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const accountTypes: AccountType[] = ["أصول", "خصوم", "إيرادات", "مصروفات", "حقوق ملكية"];

export default function Accounts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const form = useForm<InsertAccount>({
    resolver: zodResolver(insertAccountSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "أصول",
      isActive: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAccount) => {
      return apiRequest("POST", "/api/accounts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الحساب بنجاح",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة الحساب",
        variant: "destructive",
      });
    },
  });

  const filteredAccounts = accounts?.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.includes(searchQuery)
  );

  const groupedAccounts = accountTypes.map((type) => ({
    type,
    accounts: filteredAccounts?.filter((acc) => acc.type === type) || [],
  }));

  return (
    <div className="p-8 space-y-6" data-testid="page-accounts">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            دليل الحسابات
          </h1>
          <p className="text-muted-foreground">
            إدارة الحسابات المالية والتصنيفات
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" data-testid="button-new-account">
              <PlusCircle className="w-5 h-5 ml-2" />
              حساب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة حساب جديد</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز الحساب</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثال: 1001"
                          data-testid="input-account-code"
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
                      <FormLabel>اسم الحساب</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="مثال: النقدية بالصندوق"
                          data-testid="input-account-name"
                        />
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
                      <FormLabel>نوع الحساب</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-account-type">
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
                <div className="flex gap-2 justify-end pt-4">
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
                    disabled={createMutation.isPending}
                    data-testid="button-submit-account"
                  >
                    {createMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="البحث عن حساب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            data-testid="input-search-accounts"
          />
        </div>
      </Card>

      {/* Accounts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-muted rounded w-32 mb-4"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedAccounts.map((group) =>
            group.accounts.length > 0 ? (
              <div key={group.type}>
                <h2 className="text-xl font-bold mb-4 text-primary" data-testid={`text-type-${group.type}`}>
                  {group.type}
                </h2>
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-right p-4 font-medium">رمز الحساب</th>
                          <th className="text-right p-4 font-medium">اسم الحساب</th>
                          <th className="text-right p-4 font-medium">الرصيد</th>
                          <th className="text-right p-4 font-medium">الحالة</th>
                          <th className="text-right p-4 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.accounts.map((account, index) => (
                          <tr
                            key={account.id}
                            className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                            data-testid={`row-account-${account.id}`}
                          >
                            <td className="p-4 font-mono" data-testid="text-account-code">
                              {account.code}
                            </td>
                            <td className="p-4" data-testid="text-account-name">
                              {account.name}
                            </td>
                            <td className="p-4 font-mono font-medium" data-testid="text-account-balance">
                              {account.balance} ريال
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  account.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                }`}
                                data-testid="text-account-status"
                              >
                                {account.isActive ? "نشط" : "غير نشط"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid="button-edit-account"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  data-testid="button-delete-account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
