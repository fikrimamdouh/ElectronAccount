import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// أنواع الحسابات المحاسبية
export type AccountType = "أصول" | "خصوم" | "إيرادات" | "مصروفات" | "حقوق ملكية";

// جدول الحسابات المالية
export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull().$type<AccountType>(),
  parentId: varchar("parent_id"),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول القيود المحاسبية
export const entries = pgTable("entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  totalDebit: decimal("total_debit", { precision: 15, scale: 2 }).notNull(),
  totalCredit: decimal("total_credit", { precision: 15, scale: 2 }).notNull(),
  isBalanced: integer("is_balanced").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول تفاصيل القيود (سطور القيد)
export const entryLines = pgTable("entry_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryId: varchar("entry_id").notNull(),
  accountId: varchar("account_id").notNull(),
  debit: decimal("debit", { precision: 15, scale: 2 }).notNull().default("0"),
  credit: decimal("credit", { precision: 15, scale: 2 }).notNull().default("0"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas للإدراج
export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  balance: true,
}).extend({
  code: z.string().min(1, "رمز الحساب مطلوب"),
  name: z.string().min(1, "اسم الحساب مطلوب"),
  type: z.enum(["أصول", "خصوم", "إيرادات", "مصروفات", "حقوق ملكية"], {
    errorMap: () => ({ message: "نوع الحساب غير صحيح" }),
  }),
  parentId: z.string().optional(),
  isActive: z.number().default(1),
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  createdAt: true,
  totalDebit: true,
  totalCredit: true,
  isBalanced: true,
}).extend({
  entryNumber: z.string().min(1, "رقم القيد مطلوب"),
  date: z.string().or(z.date()),
  description: z.string().min(1, "وصف القيد مطلوب"),
});

export const insertEntryLineSchema = createInsertSchema(entryLines).omit({
  id: true,
  createdAt: true,
}).extend({
  entryId: z.string().min(1),
  accountId: z.string().min(1, "الحساب مطلوب"),
  debit: z.string().or(z.number()).default("0"),
  credit: z.string().or(z.number()).default("0"),
  description: z.string().optional(),
});

// نموذج القيد الكامل مع السطور
export const insertFullEntrySchema = z.object({
  entryNumber: z.string().min(1, "رقم القيد مطلوب"),
  date: z.string().or(z.date()),
  description: z.string().min(1, "وصف القيد مطلوب"),
  lines: z.array(
    z.object({
      accountId: z.string().min(1, "الحساب مطلوب"),
      debit: z.string().or(z.number()).default("0"),
      credit: z.string().or(z.number()).default("0"),
      description: z.string().optional(),
    })
  ).min(2, "يجب أن يحتوي القيد على سطرين على الأقل"),
});

// أنواع TypeScript
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = typeof entries.$inferSelect;
export type InsertEntryLine = z.infer<typeof insertEntryLineSchema>;
export type EntryLine = typeof entryLines.$inferSelect;
export type InsertFullEntry = z.infer<typeof insertFullEntrySchema>;

// نوع للقيد مع سطوره
export type FullEntry = Entry & {
  lines: (EntryLine & { accountName?: string })[];
};

// نوع لميزان المراجعة
export type TrialBalanceRow = {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: string;
  credit: string;
  balance: string;
};

// نوع لقائمة الدخل
export type IncomeStatementData = {
  revenues: Array<{ accountName: string; amount: string }>;
  expenses: Array<{ accountName: string; amount: string }>;
  totalRevenues: string;
  totalExpenses: string;
  netIncome: string;
  period: { from: string; to: string };
};

// نوع للميزانية العمومية
export type BalanceSheetData = {
  assets: Array<{ accountName: string; amount: string }>;
  liabilities: Array<{ accountName: string; amount: string }>;
  equity: Array<{ accountName: string; amount: string }>;
  totalAssets: string;
  totalLiabilities: string;
  totalEquity: string;
  date: string;
};

// نوع لإحصائيات لوحة التحكم
export type DashboardStats = {
  totalRevenues: string;
  totalExpenses: string;
  netIncome: string;
  totalBalance: string;
  recentEntries: FullEntry[];
  monthlyData: Array<{
    month: string;
    revenues: number;
    expenses: number;
  }>;
};
