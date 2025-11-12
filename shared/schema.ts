import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// أنواع الحسابات المحاسبية
export type AccountType = "أصول" | "خصوم" | "إيرادات" | "مصروفات" | "حقوق ملكية";

// تصنيفات الحسابات (للنقدية والبنوك وغيرها)
export type AccountCategory = "نقدية" | "البنك" | "أخرى";

// جدول الحسابات المالية
export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull().$type<AccountType>(),
  category: text("category").$type<AccountCategory>().default("أخرى"),
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
  category: z.enum(["نقدية", "البنك", "أخرى"]).default("أخرى"),
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

// جدول الأصناف (المنتجات)
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemCode: varchar("item_code", { length: 50 }).notNull().unique(),
  itemName: text("item_name").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  salePrice: decimal("sale_price", { precision: 15, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 15, scale: 2 }).notNull(),
  quantityOnHand: decimal("quantity_on_hand", { precision: 15, scale: 3 }).notNull().default("0"), // الكمية المتوفرة في المخزون
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - المنتجات
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  quantityOnHand: true, // يتم تحديثه تلقائياً من خلال حركات المخزون
}).extend({
  itemCode: z.string().min(1, "كود الصنف مطلوب"),
  itemName: z.string().min(1, "اسم الصنف مطلوب"),
  unit: z.enum(["حبة", "كرتون", "كيلو"], {
    errorMap: () => ({ message: "الوحدة غير صحيحة" }),
  }),
  salePrice: z.string().or(z.number()).refine(val => parseFloat(val.toString()) >= 0, "سعر البيع يجب أن يكون رقم موجب"),
  costPrice: z.string().or(z.number()).refine(val => parseFloat(val.toString()) >= 0, "سعر التكلفة يجب أن يكون رقم موجب"),
});

// أنواع TypeScript - المنتجات
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
// ==========================================
// Branches (الفروع)
// ==========================================

// جدول الفروع
export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  managerName: text("manager_name"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - الفروع
export const insertBranchSchema = createInsertSchema(branches, {
  code: (schema) => schema.code.min(1, "كود الفرع مطلوب"),
  name: (schema) => schema.name.min(1, "اسم الفرع مطلوب"),
  email: (schema) => schema.email.email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
});

// أنواع TypeScript - الفروع
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;

// جدول العملاء
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  taxNumber: varchar("tax_number", { length: 50 }),
  openingBalance: decimal("opening_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  accountId: varchar("account_id"), // الحساب المحاسبي المرتبط
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - العملاء
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  currentBalance: true,
}).extend({
  code: z.string().min(1, "كود العميل مطلوب"),
  name: z.string().min(1, "اسم العميل مطلوب"),
  phone: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  openingBalance: z.string().or(z.number()).default("0"),
  accountId: z.string().optional(),
  isActive: z.number().default(1),
});

// أنواع TypeScript - العملاء
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// جدول الموردين
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  taxNumber: varchar("tax_number", { length: 50 }),
  openingBalance: decimal("opening_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  accountId: varchar("account_id"), // الحساب المحاسبي المرتبط
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - الموردين
export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  currentBalance: true,
}).extend({
  code: z.string().min(1, "كود المورد مطلوب"),
  name: z.string().min(1, "اسم المورد مطلوب"),
  phone: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  openingBalance: z.string().or(z.number()).default("0"),
  accountId: z.string().optional(),
  isActive: z.number().default(1),
});

// أنواع TypeScript - الموردين
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// حالة الفاتورة
export type InvoiceStatus = "مسودة" | "منشورة";

// جدول فواتير المبيعات
export const salesInvoices = pgTable("sales_invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  invoiceDate: timestamp("invoice_date").notNull(),
  customerId: varchar("customer_id").notNull(), // foreign key → customers.id
  totalBeforeTax: decimal("total_before_tax", { precision: 15, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).notNull().default("0.15"), // معدل الضريبة (15%)
  taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).notNull(),
  totalAfterTax: decimal("total_after_tax", { precision: 15, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).notNull().default("0"), // إجمالي التكلفة
  status: varchar("status", { length: 20 }).notNull().default("مسودة").$type<InvoiceStatus>(), // حالة الفاتورة
  notes: text("notes"),
  entryId: varchar("entry_id"), // القيد المحاسبي المرتبط (قيد الإيرادات) - يُنشأ عند النشر
  costEntryId: varchar("cost_entry_id"), // قيد التكلفة - يُنشأ عند النشر
  postedAt: timestamp("posted_at"), // تاريخ النشر
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول تفاصيل فواتير المبيعات (الأصناف)
export const salesInvoiceItems = pgTable("sales_invoice_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull(), // foreign key → sales_invoices.id
  productId: varchar("product_id").notNull(), // foreign key → products.id
  quantity: decimal("quantity", { precision: 15, scale: 3 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  total: decimal("total", { precision: 15, scale: 2 }).notNull(), // = quantity * unitPrice
  costPrice: decimal("cost_price", { precision: 15, scale: 2 }).notNull(), // سعر التكلفة لحظة البيع
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).notNull(), // = quantity * costPrice
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول حركات المخزون (Stock Movements)
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(), // foreign key → products.id
  movementType: varchar("movement_type", { length: 50 }).notNull(), // نوع الحركة: "فاتورة مبيعات", "فاتورة مشتريات", "جرد", etc.
  referenceId: varchar("reference_id").notNull(), // معرف المستند المصدر (invoice_id, etc.)
  referenceNumber: varchar("reference_number", { length: 50 }).notNull(), // رقم المستند المصدر
  quantity: decimal("quantity", { precision: 15, scale: 3 }).notNull(), // كمية موجبة للدخول، سالبة للخروج
  quantityBefore: decimal("quantity_before", { precision: 15, scale: 3 }).notNull(), // الكمية قبل الحركة
  quantityAfter: decimal("quantity_after", { precision: 15, scale: 3 }).notNull(), // الكمية بعد الحركة
  movementDate: timestamp("movement_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - فواتير المبيعات
export const insertSalesInvoiceSchema = createInsertSchema(salesInvoices).omit({
  id: true,
  createdAt: true,
  entryId: true,
  costEntryId: true,
  postedAt: true,
  totalBeforeTax: true, // يتم حسابه تلقائياً
  taxAmount: true, // يتم حسابه تلقائياً
  totalAfterTax: true, // يتم حسابه تلقائياً
  totalCost: true, // يتم حسابه تلقائياً
}).extend({
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  invoiceDate: z.string().or(z.date()),
  customerId: z.string().min(1, "العميل مطلوب"),
  taxRate: z.string().or(z.number()).default("0.15"),
  status: z.enum(["مسودة", "منشورة"]).default("مسودة"),
  notes: z.string().optional(),
});

// Schema للإدراج - تفاصيل فواتير المبيعات
export const insertSalesInvoiceItemSchema = createInsertSchema(salesInvoiceItems).omit({
  id: true,
  createdAt: true,
  total: true, // يتم حسابه تلقائياً: quantity * unitPrice
  totalCost: true, // يتم حسابه تلقائياً: quantity * costPrice
}).extend({
  invoiceId: z.string().min(1),
  productId: z.string().min(1, "الصنف مطلوب"),
  quantity: z.string().or(z.number()).refine(val => parseFloat(val.toString()) > 0, "الكمية يجب أن تكون أكبر من صفر"),
  unitPrice: z.string().or(z.number()),
  costPrice: z.string().or(z.number()),
});

// Schema للفاتورة الكاملة مع الأصناف
export const insertFullSalesInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  invoiceDate: z.string().or(z.date()),
  customerId: z.string().min(1, "العميل مطلوب"),
  taxRate: z.string().or(z.number()).default("0.15"),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, "الصنف مطلوب"),
      quantity: z.string().or(z.number()).refine(val => parseFloat(val.toString()) > 0, "الكمية يجب أن تكون أكبر من صفر"),
      unitPrice: z.string().or(z.number()),
    })
  ).min(1, "يجب إضافة صنف واحد على الأقل"),
});

// Schema للإدراج - حركات المخزون
export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
}).extend({
  productId: z.string().min(1),
  movementType: z.string().min(1),
  referenceId: z.string().min(1),
  referenceNumber: z.string().min(1),
  quantity: z.string().or(z.number()),
  quantityBefore: z.string().or(z.number()),
  quantityAfter: z.string().or(z.number()),
  movementDate: z.string().or(z.date()),
  notes: z.string().optional(),
});

// أنواع TypeScript - فواتير المبيعات
export type InsertSalesInvoice = z.infer<typeof insertSalesInvoiceSchema>;
export type SalesInvoice = typeof salesInvoices.$inferSelect;
export type InsertSalesInvoiceItem = z.infer<typeof insertSalesInvoiceItemSchema>;
export type SalesInvoiceItem = typeof salesInvoiceItems.$inferSelect;
export type InsertFullSalesInvoice = z.infer<typeof insertFullSalesInvoiceSchema>;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;

// نوع للفاتورة الكاملة مع التفاصيل
export type FullSalesInvoice = SalesInvoice & {
  items: (SalesInvoiceItem & { productName?: string; unit?: string })[];
  customerName?: string;
};

// ===============================
// سند القبض (Receipt Voucher)
// ===============================

// أنواع طرق الدفع
export type PaymentMethod = "نقدي" | "بنك" | "شيك";

// جدول سندات القبض
export const receiptVouchers = pgTable("receipt_vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(),
  voucherDate: timestamp("voucher_date").notNull(),
  customerId: varchar("customer_id").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull().$type<PaymentMethod>(),
  targetAccountId: varchar("target_account_id").notNull(), // حساب البنك أو الصندوق
  checkNumber: varchar("check_number", { length: 50 }),
  checkDate: timestamp("check_date"),
  checkBank: varchar("check_bank", { length: 100 }),
  status: text("status").notNull().default("مسودة"), // "مسودة" أو "منشور"
  notes: text("notes"),
  entryId: varchar("entry_id"), // القيد المحاسبي المرتبط (بعد النشر)
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول تخصيصات سند القبض (ربط السند بفواتير معينة)
export const receiptVoucherAllocations = pgTable("receipt_voucher_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherId: varchar("voucher_id").notNull(),
  invoiceId: varchar("invoice_id").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - سندات القبض
export const insertReceiptVoucherSchema = createInsertSchema(receiptVouchers).omit({
  id: true,
  createdAt: true,
  entryId: true,
  postedAt: true,
}).extend({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().or(z.date()),
  customerId: z.string().min(1, "العميل مطلوب"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
  paymentMethod: z.enum(["نقدي", "بنك", "شيك"], {
    errorMap: () => ({ message: "طريقة الدفع غير صحيحة" }),
  }),
  targetAccountId: z.string().min(1, "حساب القبض مطلوب"),
  checkNumber: z.string().optional(),
  checkDate: z.string().or(z.date()).optional(),
  checkBank: z.string().optional(),
  status: z.enum(["مسودة", "منشور"]).default("مسودة"),
  notes: z.string().optional(),
});

// Schema للإدراج - تخصيصات سند القبض
export const insertReceiptVoucherAllocationSchema = createInsertSchema(receiptVoucherAllocations).omit({
  id: true,
  createdAt: true,
}).extend({
  voucherId: z.string().min(1),
  invoiceId: z.string().min(1, "الفاتورة مطلوبة"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
});

// Schema لسند القبض الكامل مع التخصيصات
export const insertFullReceiptVoucherSchema = z.object({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().or(z.date()),
  customerId: z.string().min(1, "العميل مطلوب"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
  paymentMethod: z.enum(["نقدي", "بنك", "شيك"], {
    errorMap: () => ({ message: "طريقة الدفع غير صحيحة" }),
  }),
  targetAccountId: z.string().min(1, "حساب القبض مطلوب"),
  checkNumber: z.string().optional(),
  checkDate: z.string().or(z.date()).optional(),
  checkBank: z.string().optional(),
  notes: z.string().optional(),
  allocations: z.array(
    z.object({
      invoiceId: z.string().min(1, "الفاتورة مطلوبة"),
      amount: z.string().or(z.number()).refine(
        val => parseFloat(val.toString()) > 0, 
        "المبلغ يجب أن يكون أكبر من صفر"
      ),
    })
  ).optional().default([]),
}).refine(
  (data) => {
    // If allocations exist, their sum must equal the voucher amount
    if (data.allocations && data.allocations.length > 0) {
      const totalAllocations = data.allocations.reduce(
        (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
        0
      );
      const voucherAmount = parseFloat(data.amount.toString());
      return Math.abs(totalAllocations - voucherAmount) < 0.01; // Allow 0.01 tolerance for floating point
    }
    return true;
  },
  {
    message: "مجموع التخصيصات يجب أن يساوي مبلغ السند بالضبط",
    path: ["allocations"],
  }
);

// أنواع TypeScript - سندات القبض
export type InsertReceiptVoucher = z.infer<typeof insertReceiptVoucherSchema>;
export type ReceiptVoucher = typeof receiptVouchers.$inferSelect;
export type InsertReceiptVoucherAllocation = z.infer<typeof insertReceiptVoucherAllocationSchema>;
export type ReceiptVoucherAllocation = typeof receiptVoucherAllocations.$inferSelect;
export type InsertFullReceiptVoucher = z.infer<typeof insertFullReceiptVoucherSchema>;

// نوع لسند القبض الكامل مع التفاصيل
export type FullReceiptVoucher = ReceiptVoucher & {
  allocations: (ReceiptVoucherAllocation & { invoiceNumber?: string })[];
  customerName?: string;
  targetAccountName?: string;
};

// ==========================================
// Payment Vouchers (سندات الدفع)
// ==========================================

// جدول سندات الدفع (للموردين)
export const paymentVouchers = pgTable("payment_vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(),
  voucherDate: timestamp("voucher_date").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull().$type<PaymentMethod>(),
  sourceAccountId: varchar("source_account_id").notNull(), // حساب البنك أو الصندوق
  checkNumber: varchar("check_number", { length: 50 }),
  checkDate: timestamp("check_date"),
  checkBank: varchar("check_bank", { length: 100 }),
  status: text("status").notNull().default("مسودة"), // "مسودة" أو "منشور"
  notes: text("notes"),
  entryId: varchar("entry_id"), // القيد المحاسبي المرتبط (بعد النشر)
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// جدول تخصيصات سند الدفع (ربط السند بفواتير شراء معينة)
export const paymentVoucherAllocations = pgTable("payment_voucher_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherId: varchar("voucher_id").notNull(),
  purchaseInvoiceId: varchar("purchase_invoice_id").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema للإدراج - سندات الدفع
export const insertPaymentVoucherSchema = createInsertSchema(paymentVouchers).omit({
  id: true,
  createdAt: true,
  entryId: true,
  postedAt: true,
}).extend({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().or(z.date()),
  supplierId: z.string().min(1, "المورد مطلوب"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
  paymentMethod: z.enum(["نقدي", "بنك", "شيك"], {
    errorMap: () => ({ message: "طريقة الدفع غير صحيحة" }),
  }),
  sourceAccountId: z.string().min(1, "حساب الدفع مطلوب"),
  checkNumber: z.string().optional(),
  checkDate: z.string().or(z.date()).optional(),
  checkBank: z.string().optional(),
  status: z.enum(["مسودة", "منشور"]).default("مسودة"),
  notes: z.string().optional(),
});

// Schema للإدراج - تخصيصات سند الدفع
export const insertPaymentVoucherAllocationSchema = createInsertSchema(paymentVoucherAllocations).omit({
  id: true,
  createdAt: true,
}).extend({
  voucherId: z.string().min(1),
  purchaseInvoiceId: z.string().min(1, "فاتورة الشراء مطلوبة"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
});

// Schema لسند الدفع الكامل مع التخصيصات
export const insertFullPaymentVoucherSchema = z.object({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().or(z.date()),
  supplierId: z.string().min(1, "المورد مطلوب"),
  amount: z.string().or(z.number()).refine(
    val => parseFloat(val.toString()) > 0, 
    "المبلغ يجب أن يكون أكبر من صفر"
  ),
  paymentMethod: z.enum(["نقدي", "بنك", "شيك"], {
    errorMap: () => ({ message: "طريقة الدفع غير صحيحة" }),
  }),
  sourceAccountId: z.string().min(1, "حساب الدفع مطلوب"),
  checkNumber: z.string().optional(),
  checkDate: z.string().or(z.date()).optional(),
  checkBank: z.string().optional(),
  notes: z.string().optional(),
  allocations: z.array(
    z.object({
      purchaseInvoiceId: z.string().min(1, "فاتورة الشراء مطلوبة"),
      amount: z.string().or(z.number()).refine(
        val => parseFloat(val.toString()) > 0, 
        "المبلغ يجب أن يكون أكبر من صفر"
      ),
    })
  ).optional().default([]),
}).refine(
  (data) => {
    // If allocations exist, their sum must not exceed the voucher amount
    if (data.allocations && data.allocations.length > 0) {
      const totalAllocations = data.allocations.reduce(
        (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
        0
      );
      const voucherAmount = parseFloat(data.amount.toString());
      return totalAllocations <= voucherAmount + 0.01; // Allow small tolerance
    }
    return true;
  },
  {
    message: "مجموع التخصيصات لا يمكن أن يتجاوز مبلغ السند",
    path: ["allocations"],
  }
);

// أنواع TypeScript - سندات الدفع
export type InsertPaymentVoucher = z.infer<typeof insertPaymentVoucherSchema>;
export type PaymentVoucher = typeof paymentVouchers.$inferSelect;
export type InsertPaymentVoucherAllocation = z.infer<typeof insertPaymentVoucherAllocationSchema>;
export type PaymentVoucherAllocation = typeof paymentVoucherAllocations.$inferSelect;
export type InsertFullPaymentVoucher = z.infer<typeof insertFullPaymentVoucherSchema>;

// نوع لسند الدفع الكامل مع التفاصيل
export type FullPaymentVoucher = PaymentVoucher & {
  allocations: (PaymentVoucherAllocation & { invoiceNumber?: string })[];
  supplierName?: string;
  sourceAccountName?: string;
};
