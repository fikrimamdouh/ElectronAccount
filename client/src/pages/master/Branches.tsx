// الكود الكامل والنهائي لصفحة الفروع
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertBranchSchema,
  type Branch,
  type InsertBranch,
} from "@shared/schema";
import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const defaultFormValues: InsertBranch = {
  code: "",
  name: "",
  managerName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  isActive: 1,
};

function normalizeFormValues(values: InsertBranch): InsertBranch {
  const trimmed: InsertBranch = { ...values, code: values.code.trim(), name: values.name.trim(), isActive: values.isActive ?? 1 };
  const optionalKeys: Array<keyof Pick<InsertBranch, "managerName" | "phone" | "email" | "address" | "city" | "country">> = ["managerName", "phone", "email", "address", "city", "country"];
  optionalKeys.forEach((key) => {
    const current = values[key];
    trimmed[key] = current ? current.trim() : "";
  });
  return trimmed;
}

export default function BranchesPage() {
  const { toast } = useToast();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  const form = useForm<InsertBranch>({ resolver: zodResolver(insertBranchSchema), defaultValues: defaultFormValues });

  const { data: branches = [], isLoading, isError, error } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });

  const selectedBranch = useMemo(() => branches.find((branch) => branch.id === selectedBranchId) ?? null, [branches, selectedBranchId]);

  useEffect(() => {
    if (selectedBranch) {
      form.reset({ ...selectedBranch, managerName: selectedBranch.managerName ?? "", phone: selectedBranch.phone ?? "", email: selectedBranch.email ?? "", address: selectedBranch.address ?? "", city: selectedBranch.city ?? "", country: selectedBranch.country ?? "", isActive: selectedBranch.isActive ?? 1 });
    } else {
      form.reset(defaultFormValues);
    }
  }, [form, selectedBranch]);

  const createBranchMutation = useMutation<Branch, Error, InsertBranch>({
    mutationFn: async (data) => { const response = await apiRequest("POST", "/api/branches", normalizeFormValues(data)); return await response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/branches"] }); toast({ title: "تم الحفظ بنجاح", description: "تم إضافة الفرع الجديد" }); handleReset(); },
    onError: (mutationError) => { toast({ title: "خطأ", description: mutationError.message ?? "فشل في إضافة الفرع", variant: "destructive" }); },
  });

  const updateBranchMutation = useMutation<Branch, Error, { id: string; data: InsertBranch }>({
    mutationFn: async ({ id, data }) => { const response = await apiRequest("PUT", `/api/branches/${id}`, normalizeFormValues(data)); return await response.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/branches"] }); toast({ title: "تم التحديث بنجاح", description: "تم تعديل بيانات الفرع" }); handleReset(); },
    onError: (mutationError) => { toast({ title: "خطأ", description: mutationError.message ?? "فشل في تحديث الفرع", variant: "destructive" }); },
  });

  const deleteBranchMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => { setDeletingBranchId(id); await apiRequest("DELETE", `/api/branches/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/branches"] }); toast({ title: "تم الحذف", description: "تم حذف الفرع بنجاح" }); if (selectedBranchId) { handleReset(); } },
    onError: (mutationError) => { toast({ title: "خطأ", description: mutationError.message ?? "فشل في حذف الفرع", variant: "destructive" }); },
    onSettled: () => setDeletingBranchId(null),
  });

  const isSaving = createBranchMutation.isPending || updateBranchMutation.isPending;
  const handleSubmit = (values: InsertBranch) => { if (selectedBranchId) { updateBranchMutation.mutate({ id: selectedBranchId, data: values }); } else { createBranchMutation.mutate(values); } };
  const handleReset = () => { setSelectedBranchId(null); form.reset(defaultFormValues); };
  const handleEdit = (branchId: string) => { setSelectedBranchId(branchId); };
  const handleDelete = (branch: Branch) => { if (confirm(`هل أنت متأكد من حذف الفرع "${branch.name}"؟`)) { deleteBranchMutation.mutate(branch.id); } };

  return (
    <div className="space-y-6" data-testid="branches-page">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div><h1 className="text-3xl font-bold">إدارة الفروع</h1><p className="text-sm text-muted-foreground">متابعة بيانات الفروع ومعلومات الاتصال المرتبطة بها</p></div>
        </div>
        <Button className="gap-2" size="lg" onClick={handleReset}><Plus className="h-4 w-4" /> إضافة فرع جديد</Button>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <BranchForm form={form} mode={selectedBranch ? "edit" : "create"} isSaving={isSaving} isDeleting={deleteBranchMutation.isPending} onSubmit={handleSubmit} onReset={handleReset} onDelete={() => selectedBranch && handleDelete(selectedBranch)} hasBranchSelected={Boolean(selectedBranch)} />
        <BranchesTable branches={branches} selectedBranchId={selectedBranchId} isLoading={isLoading} isError={isError} error={error} onEdit={handleEdit} onDelete={handleDelete} isSaving={isSaving} deletingBranchId={deletingBranchId} />
      </div>
    </div>
  );
}

function BranchForm({ form, mode, isSaving, isDeleting, onSubmit, onReset, onDelete, hasBranchSelected }: { form: UseFormReturn<InsertBranch>, mode: "create" | "edit", isSaving: boolean, isDeleting: boolean, onSubmit: (values: InsertBranch) => void, onReset: () => void, onDelete: () => void, hasBranchSelected: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>{mode === "edit" ? "تعديل بيانات الفرع" : "إضافة فرع جديد"}</CardTitle><CardDescription>أدخل معلومات الفرع لتسهيل التقارير وربط العمليات</CardDescription></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>كود الفرع *</FormLabel><FormControl><Input placeholder="BR-001" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>اسم الفرع *</FormLabel><FormControl><Input placeholder="الفرع الرئيسي" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="managerName" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> مدير الفرع</FormLabel><FormControl><Input placeholder="اسم مدير الفرع" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> رقم الهاتف</FormLabel><FormControl><Input placeholder="+966 11 123 4567" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> البريد الإلكتروني</FormLabel><FormControl><Input type="email" placeholder="branch@example.com" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> العنوان التفصيلي</FormLabel><FormControl><Textarea rows={3} placeholder="المدينة، الشارع، المبنى" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>المدينة</FormLabel><FormControl><Input placeholder="الرياض" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>الدولة</FormLabel><FormControl><Input placeholder="المملكة العربية السعودية" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><FormLabel className="space-y-1"><span className="block font-medium">حالة الفرع</span><span className="text-sm text-muted-foreground">تحكم في ظهور الفرع في القوائم والتقارير</span></FormLabel><FormControl><Switch checked={field.value === 1} onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} /></FormControl></FormItem>)} />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              {hasBranchSelected && (<Button type="button" variant="outline" className="gap-2" onClick={onDelete} disabled={isDeleting}>{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} حذف الفرع</Button>)}
              <Button type="button" variant="secondary" className="gap-2" onClick={onReset} disabled={isSaving}><RotateCcw className="h-4 w-4" /> إعادة تعيين</Button>
              <Button type="submit" className="gap-2" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {mode === "edit" ? "تحديث الفرع" : "حفظ الفرع"}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function BranchesTable({ branches, selectedBranchId, isLoading, isError, error, onEdit, onDelete, isSaving, deletingBranchId }: { branches: Branch[], selectedBranchId: string | null, isLoading: boolean, isError: boolean, error: unknown, onEdit: (branchId: string) => void, onDelete: (branch: Branch) => void, isSaving: boolean, deletingBranchId: string | null }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader><CardTitle>قائمة الفروع</CardTitle><CardDescription>{isLoading ? "جاري تحميل البيانات..." : "كل الفروع المسجلة ضمن النظام"}</CardDescription></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>الكود</TableHead><TableHead>اسم الفرع</TableHead><TableHead>المدينة</TableHead><TableHead>الهاتف</TableHead><TableHead>الحالة</TableHead><TableHead>إجراءات</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading && (<tr><TableCell colSpan={6} className="text-center"><div className="flex items-center justify-center gap-2 py-6 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> جاري تحميل الفروع...</div></TableCell></tr>)}
              {isError && !isLoading && (<tr><TableCell colSpan={6} className="text-center text-destructive">حدث خطأ أثناء تحميل الفروع: {error instanceof Error ? error.message : String(error)}</TableCell></tr>)}
              {!isLoading && !isError && branches.length === 0 && (<tr><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">لم يتم إضافة أي فروع بعد</TableCell></tr>)}
              {!isLoading && !isError && branches.map((branch) => {
                const isSelected = selectedBranchId === branch.id;
                const isDeleting = deletingBranchId === branch.id;
                return (
                  <TableRow key={branch.id} data-state={isSelected ? "selected" : undefined}>
                    <TableCell className="font-medium">{branch.code}</TableCell>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.city ?? "-"}</TableCell>
                    <TableCell>{branch.phone ?? "-"}</TableCell>
                    <TableCell><Badge variant={branch.isActive === 1 ? "default" : "secondary"}>{branch.isActive === 1 ? "نشط" : "موقوف"}</Badge></TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Button type="button" size="sm" variant="outline" onClick={() => onEdit(branch.id)} disabled={isSaving && !isSelected}>تعديل</Button><Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(branch)} disabled={isDeleting}>{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} حذف</Button></div></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
