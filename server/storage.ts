import {
  type Account,
  type InsertAccount,
  type Entry,
  type InsertEntry,
  type EntryLine,
  type InsertEntryLine,
  type FullEntry,
  type TrialBalanceRow,
  type IncomeStatementData,
  type BalanceSheetData,
  type DashboardStats,
  type Product,
  type InsertProduct,
  type Customer,
  type InsertCustomer,
  type Supplier,
  type InsertSupplier,
  type SalesInvoice,
  type InsertFullSalesInvoice,
  type FullSalesInvoice,
  type InvoiceStatus,
  type FullReceiptVoucher,
  type InsertFullReceiptVoucher,
  type FullPaymentVoucher,
  type InsertFullPaymentVoucher,
  accounts,
  entries,
  entryLines,
  products,
  customers,
  suppliers,
  salesInvoices,
  salesInvoiceItems,
  stockMovements,
  receiptVouchers,
  receiptVoucherAllocations,
  paymentVouchers,
  paymentVoucherAllocations,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { ValidationError, NotFoundError, ConflictError, InvalidStateError } from "./errors";

// Sales Invoice filters
export interface SalesInvoiceFilters {
  status?: InvoiceStatus;
  customerId?: string;
  from?: Date;
  to?: Date;
}

// Computed totals result
export interface SalesInvoiceTotals {
  subtotal: string;
  taxAmount: string;
  total: string;
  totalCost: string;
}

export interface IStorage {
  // Accounts
  getAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  getAccountByCode(code: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, account: Partial<InsertAccount>): Promise<Account | undefined>;
  deleteAccount(id: string): Promise<boolean>;
  updateAccountBalance(id: string, amount: number): Promise<void>;

  // Entries
  getEntries(): Promise<FullEntry[]>;
  getEntry(id: string): Promise<FullEntry | undefined>;
  createEntry(entry: InsertEntry, lines: InsertEntryLine[]): Promise<FullEntry>;
  deleteEntry(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductByCode(itemCode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductQuantity(id: string, quantity: number): Promise<void>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByCode(code: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  updateCustomerBalance(id: string, amount: number): Promise<void>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSupplierByCode(code: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;
  updateSupplierBalance(id: string, amount: number): Promise<void>;

  // Sales Invoices
  createSalesInvoiceDraft(invoice: InsertFullSalesInvoice): Promise<FullSalesInvoice>;
  getSalesInvoices(filters?: SalesInvoiceFilters): Promise<FullSalesInvoice[]>;
  getSalesInvoice(id: string): Promise<FullSalesInvoice | undefined>;
  updateSalesInvoiceDraft(id: string, invoice: InsertFullSalesInvoice): Promise<FullSalesInvoice>;
  deleteSalesInvoiceDraft(id: string): Promise<boolean>;
  postSalesInvoice(id: string): Promise<FullSalesInvoice>;
  computeSalesInvoiceTotals(items: Array<{productId: string; quantity: number; unitPrice: number}>): Promise<SalesInvoiceTotals>;

  // Receipt Vouchers
  createReceiptVoucherDraft(data: InsertFullReceiptVoucher): Promise<FullReceiptVoucher>;
  getReceiptVouchers(): Promise<FullReceiptVoucher[]>;
  getReceiptVoucher(id: string): Promise<FullReceiptVoucher | undefined>;
  updateReceiptVoucherDraft(id: string, data: InsertFullReceiptVoucher): Promise<FullReceiptVoucher>;
  deleteReceiptVoucherDraft(id: string): Promise<boolean>;
  postReceiptVoucher(id: string): Promise<FullReceiptVoucher>;

  // Payment Vouchers
  createPaymentVoucherDraft(data: InsertFullPaymentVoucher): Promise<FullPaymentVoucher>;
  getPaymentVouchers(): Promise<FullPaymentVoucher[]>;
  getPaymentVoucher(id: string): Promise<FullPaymentVoucher | undefined>;
  updatePaymentVoucherDraft(id: string, data: InsertFullPaymentVoucher): Promise<FullPaymentVoucher>;
  deletePaymentVoucherDraft(id: string): Promise<boolean>;
  postPaymentVoucher(id: string): Promise<FullPaymentVoucher>;

  // Reports
  getTrialBalance(): Promise<TrialBalanceRow[]>;
  getIncomeStatement(from: Date, to: Date): Promise<IncomeStatementData>;
  getBalanceSheet(date: Date): Promise<BalanceSheetData>;
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  // Accounts
  async getAccounts(): Promise<Account[]> {
    return await db.select().from(accounts);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account || undefined;
  }

  async getAccountByCode(code: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.code, code));
    return account || undefined;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const [account] = await db
      .insert(accounts)
      .values({
        ...insertAccount,
        balance: "0",
      })
      .returning();
    return account;
  }

  async updateAccount(id: string, data: Partial<InsertAccount>): Promise<Account | undefined> {
    const [account] = await db
      .update(accounts)
      .set(data)
      .where(eq(accounts.id, id))
      .returning();
    return account || undefined;
  }

  async deleteAccount(id: string): Promise<boolean> {
    const result = await db.delete(accounts).where(eq(accounts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateAccountBalance(id: string, amount: number): Promise<void> {
    const account = await this.getAccount(id);
    if (account) {
      const currentBalance = Number(account.balance) || 0;
      const newBalance = (currentBalance + amount).toFixed(2);
      await db
        .update(accounts)
        .set({ balance: newBalance })
        .where(eq(accounts.id, id));
    }
  }

  // Entries
  async getEntries(): Promise<FullEntry[]> {
    const allEntries = await db.select().from(entries).orderBy(desc(entries.createdAt));
    const fullEntries: FullEntry[] = [];

    for (const entry of allEntries) {
      const lines = await db.select().from(entryLines).where(eq(entryLines.entryId, entry.id));
      
      const linesWithNames = await Promise.all(
        lines.map(async (line) => {
          const account = await this.getAccount(line.accountId);
          return {
            ...line,
            accountName: account ? `${account.code} - ${account.name}` : line.accountId,
          };
        })
      );

      fullEntries.push({ ...entry, lines: linesWithNames });
    }

    return fullEntries;
  }

  async getEntry(id: string): Promise<FullEntry | undefined> {
    const [entry] = await db.select().from(entries).where(eq(entries.id, id));
    if (!entry) return undefined;

    const lines = await db.select().from(entryLines).where(eq(entryLines.entryId, entry.id));
    
    const linesWithNames = await Promise.all(
      lines.map(async (line) => {
        const account = await this.getAccount(line.accountId);
        return {
          ...line,
          accountName: account ? `${account.code} - ${account.name}` : line.accountId,
        };
      })
    );

    return { ...entry, lines: linesWithNames };
  }

  async createEntry(insertEntry: InsertEntry, insertLines: InsertEntryLine[]): Promise<FullEntry> {
    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of insertLines) {
      totalDebit += Number(line.debit) || 0;
      totalCredit += Number(line.credit) || 0;
    }

    const isBalanced = totalDebit === totalCredit && totalDebit > 0 ? 1 : 0;

    // Create entry
    const [entry] = await db
      .insert(entries)
      .values({
        ...insertEntry,
        date: new Date(insertEntry.date),
        totalDebit: totalDebit.toFixed(2),
        totalCredit: totalCredit.toFixed(2),
        isBalanced,
      })
      .returning();

    // Create entry lines and update account balances
    const linesWithNames = [];
    for (const insertLine of insertLines) {
      const [line] = await db
        .insert(entryLines)
        .values({
          ...insertLine,
          entryId: entry.id,
          debit: (Number(insertLine.debit) || 0).toFixed(2),
          credit: (Number(insertLine.credit) || 0).toFixed(2),
        })
        .returning();

      // Update account balance
      const account = await this.getAccount(line.accountId);
      if (account) {
        const debitAmount = Number(line.debit) || 0;
        const creditAmount = Number(line.credit) || 0;

        // For assets and expenses: debit increases, credit decreases
        // For liabilities, equity, and revenues: credit increases, debit decreases
        let balanceChange = 0;
        if (account.type === "أصول" || account.type === "مصروفات") {
          balanceChange = debitAmount - creditAmount;
        } else {
          balanceChange = creditAmount - debitAmount;
        }

        await this.updateAccountBalance(line.accountId, balanceChange);
        
        linesWithNames.push({
          ...line,
          accountName: `${account.code} - ${account.name}`,
        });
      } else {
        linesWithNames.push(line);
      }
    }

    return { ...entry, lines: linesWithNames };
  }

  async deleteEntry(id: string): Promise<boolean> {
    const entry = await this.getEntry(id);
    if (!entry) return false;

    // Reverse account balances
    for (const line of entry.lines) {
      const account = await this.getAccount(line.accountId);
      if (account) {
        const debitAmount = Number(line.debit) || 0;
        const creditAmount = Number(line.credit) || 0;

        // Reverse the balance change
        let balanceChange = 0;
        if (account.type === "أصول" || account.type === "مصروفات") {
          balanceChange = -(debitAmount - creditAmount);
        } else {
          balanceChange = -(creditAmount - debitAmount);
        }

        await this.updateAccountBalance(line.accountId, balanceChange);
      }
    }

    // Delete entry lines
    await db.delete(entryLines).where(eq(entryLines.entryId, id));
    
    // Delete entry
    const result = await db.delete(entries).where(eq(entries.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Reports
  async getTrialBalance(): Promise<TrialBalanceRow[]> {
    const allAccounts = await db.select().from(accounts);
    const rows: TrialBalanceRow[] = [];

    for (const account of allAccounts) {
      const balance = Number(account.balance) || 0;
      const debit = balance > 0 ? balance.toFixed(2) : "0.00";
      const credit = balance < 0 ? Math.abs(balance).toFixed(2) : "0.00";

      rows.push({
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        debit,
        credit,
        balance: balance.toFixed(2),
      });
    }

    return rows.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  async getIncomeStatement(from: Date, to: Date): Promise<IncomeStatementData> {
    const allAccounts = await db.select().from(accounts);
    
    const revenues = allAccounts
      .filter((acc) => acc.type === "إيرادات")
      .map((acc) => ({
        accountName: acc.name,
        amount: acc.balance,
      }));

    const expenses = allAccounts
      .filter((acc) => acc.type === "مصروفات")
      .map((acc) => ({
        accountName: acc.name,
        amount: acc.balance,
      }));

    const totalRevenues = revenues.reduce(
      (sum, item) => sum + Math.abs(Number(item.amount)),
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const netIncome = totalRevenues - totalExpenses;

    return {
      revenues,
      expenses,
      totalRevenues: totalRevenues.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      netIncome: netIncome.toFixed(2),
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    };
  }

  async getBalanceSheet(date: Date): Promise<BalanceSheetData> {
    const allAccounts = await db.select().from(accounts);

    const assets = allAccounts
      .filter((acc) => acc.type === "أصول")
      .map((acc) => ({
        accountName: acc.name,
        amount: acc.balance,
      }));

    const liabilities = allAccounts
      .filter((acc) => acc.type === "خصوم")
      .map((acc) => ({
        accountName: acc.name,
        amount: Math.abs(Number(acc.balance)).toFixed(2),
      }));

    const equity = allAccounts
      .filter((acc) => acc.type === "حقوق ملكية")
      .map((acc) => ({
        accountName: acc.name,
        amount: Math.abs(Number(acc.balance)).toFixed(2),
      }));

    const totalAssets = assets.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalLiabilities = liabilities.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalEquity = equity.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return {
      assets,
      liabilities,
      equity,
      totalAssets: totalAssets.toFixed(2),
      totalLiabilities: totalLiabilities.toFixed(2),
      totalEquity: totalEquity.toFixed(2),
      date: date.toISOString(),
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductByCode(itemCode: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.itemCode, itemCode));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        salePrice: insertProduct.salePrice.toString(),
        costPrice: insertProduct.costPrice.toString(),
      })
      .returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const updateData: any = { ...data };
    if (data.salePrice !== undefined) {
      updateData.salePrice = data.salePrice.toString();
    }
    if (data.costPrice !== undefined) {
      updateData.costPrice = data.costPrice.toString();
    }
    
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateProductQuantity(id: string, quantity: number): Promise<void> {
    const product = await this.getProduct(id);
    if (product) {
      const newQuantity = parseFloat(product.quantityOnHand) + quantity;
      await db
        .update(products)
        .set({ quantityOnHand: newQuantity.toString() })
        .where(eq(products.id, id));
    }
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByCode(code: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.code, code));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    // Use transaction to ensure both customer and account are created atomically
    return await db.transaction(async (tx) => {
      // Create customer account in chart of accounts if not provided
      let accountId = insertCustomer.accountId;
      
      if (!accountId) {
        const [customerAccount] = await tx
          .insert(accounts)
          .values({
            code: `1120-${insertCustomer.code}`,
            name: `عميل: ${insertCustomer.name}`,
            type: "أصول",
            parentId: null,
            balance: insertCustomer.openingBalance.toString(),
            isActive: 1,
          })
          .returning();
        accountId = customerAccount.id;
      }

      const [customer] = await tx
        .insert(customers)
        .values({
          ...insertCustomer,
          openingBalance: insertCustomer.openingBalance.toString(),
          currentBalance: insertCustomer.openingBalance.toString(),
          accountId,
        })
        .returning();

      return customer;
    });
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const updateData: any = { ...data };
    if (data.openingBalance !== undefined) {
      updateData.openingBalance = data.openingBalance.toString();
    }
    
    const [customer] = await db
      .update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();
    return customer || undefined;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    // Use transaction to delete customer and their account
    return await db.transaction(async (tx) => {
      // Get customer first to check if they have linked account
      const [customer] = await tx.select().from(customers).where(eq(customers.id, id));
      
      if (!customer) {
        return false;
      }

      // Check if linked account exists and validate balance before deletion
      // Read account within transaction scope to ensure we have the current balance
      if (customer.accountId) {
        const [account] = await tx.select().from(accounts).where(eq(accounts.id, customer.accountId));
        if (account) {
          const balance = parseFloat(account.balance);
          if (balance !== 0) {
            // Abort transaction if account has non-zero balance
            throw new Error(`لا يمكن حذف العميل. الرصيد الحالي للحساب المحاسبي: ${balance.toFixed(2)} ر.س. يجب أن يكون الرصيد صفر أولاً.`);
          }
          // Delete account if balance is zero
          await tx.delete(accounts).where(eq(accounts.id, customer.accountId));
        }
      }

      // Delete customer after validating account balance
      await tx.delete(customers).where(eq(customers.id, id));

      return true;
    });
  }

  async updateCustomerBalance(id: string, amount: number): Promise<void> {
    const customer = await this.getCustomer(id);
    if (customer) {
      const newBalance = parseFloat(customer.currentBalance) + amount;
      await db
        .update(customers)
        .set({ currentBalance: newBalance.toString() })
        .where(eq(customers.id, id));
      
      // Update linked account balance
      if (customer.accountId) {
        await this.updateAccountBalance(customer.accountId, amount);
      }
    }
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async getSupplierByCode(code: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.code, code));
    return supplier || undefined;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    // Use transaction to ensure both supplier and account are created atomically
    return await db.transaction(async (tx) => {
      // Create supplier account in chart of accounts if not provided
      let accountId = insertSupplier.accountId;
      
      if (!accountId) {
        const [supplierAccount] = await tx
          .insert(accounts)
          .values({
            code: `2120-${insertSupplier.code}`,
            name: `مورد: ${insertSupplier.name}`,
            type: "خصوم",
            parentId: null,
            balance: insertSupplier.openingBalance.toString(),
            isActive: 1,
          })
          .returning();
        accountId = supplierAccount.id;
      }

      const [supplier] = await tx
        .insert(suppliers)
        .values({
          ...insertSupplier,
          openingBalance: insertSupplier.openingBalance.toString(),
          currentBalance: insertSupplier.openingBalance.toString(),
          accountId,
        })
        .returning();

      return supplier;
    });
  }

  async updateSupplier(id: string, data: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const updateData: any = { ...data };
    if (data.openingBalance !== undefined) {
      updateData.openingBalance = data.openingBalance.toString();
    }
    
    const [supplier] = await db
      .update(suppliers)
      .set(updateData)
      .where(eq(suppliers.id, id))
      .returning();
    return supplier || undefined;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    // Use transaction to delete supplier and their account
    return await db.transaction(async (tx) => {
      // Get supplier first to check if they have linked account
      const [supplier] = await tx.select().from(suppliers).where(eq(suppliers.id, id));
      
      if (!supplier) {
        return false;
      }

      // Check if linked account exists and validate balance before deletion
      if (supplier.accountId) {
        const [account] = await tx.select().from(accounts).where(eq(accounts.id, supplier.accountId));
        if (account) {
          const balance = parseFloat(account.balance);
          if (balance !== 0) {
            // Abort transaction if account has non-zero balance
            throw new Error(`لا يمكن حذف المورد. الرصيد الحالي للحساب المحاسبي: ${balance.toFixed(2)} ر.س. يجب أن يكون الرصيد صفر أولاً.`);
          }
          // Delete account if balance is zero
          await tx.delete(accounts).where(eq(accounts.id, supplier.accountId));
        }
      }

      // Delete supplier after validating account balance
      await tx.delete(suppliers).where(eq(suppliers.id, id));

      return true;
    });
  }

  async updateSupplierBalance(id: string, amount: number): Promise<void> {
    const supplier = await this.getSupplier(id);
    if (supplier) {
      const newBalance = parseFloat(supplier.currentBalance) + amount;
      await db
        .update(suppliers)
        .set({ currentBalance: newBalance.toString() })
        .where(eq(suppliers.id, id));
      
      // Update linked account balance
      if (supplier.accountId) {
        await this.updateAccountBalance(supplier.accountId, amount);
      }
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const allAccounts = await db.select().from(accounts);
    const allEntries = await this.getEntries();

    const totalRevenues = allAccounts
      .filter((acc) => acc.type === "إيرادات")
      .reduce((sum, acc) => sum + Math.abs(Number(acc.balance)), 0);

    const totalExpenses = allAccounts
      .filter((acc) => acc.type === "مصروفات")
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const totalBalance = allAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );

    const netIncome = totalRevenues - totalExpenses;

    // Get recent entries (last 10)
    const recentEntries = allEntries.slice(0, 10);

    // Generate monthly data for the chart (last 6 months)
    const monthlyData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("ar-SA", { month: "short" });
      
      // For demo purposes, generate some sample data
      monthlyData.push({
        month: monthName,
        revenues: Math.random() * 50000 + 10000,
        expenses: Math.random() * 40000 + 8000,
      });
    }

    return {
      totalRevenues: totalRevenues.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      netIncome: netIncome.toFixed(2),
      totalBalance: totalBalance.toFixed(2),
      recentEntries,
      monthlyData,
    };
  }

  // Sales Invoices
  async computeSalesInvoiceTotals(items: Array<{productId: string; quantity: number; unitPrice: number}>): Promise<SalesInvoiceTotals> {
    let subtotal = 0;
    let totalCost = 0;

    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (!product) {
        throw new Error(`الصنف غير موجود: ${item.productId}`);
      }

      const itemTotal = item.quantity * item.unitPrice;
      const itemCost = item.quantity * parseFloat(product.costPrice);
      
      subtotal += itemTotal;
      totalCost += itemCost;
    }

    const taxRate = 0.15; // 15% Saudi VAT
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      totalCost: totalCost.toFixed(2),
    };
  }

  async createSalesInvoiceDraft(insertInvoice: InsertFullSalesInvoice): Promise<FullSalesInvoice> {
    return await db.transaction(async (tx) => {
      // Compute totals
      const totals = await this.computeSalesInvoiceTotals(
        insertInvoice.items.map(item => ({
          productId: item.productId,
          quantity: parseFloat(item.quantity.toString()),
          unitPrice: parseFloat(item.unitPrice.toString()),
        }))
      );

      // Create invoice header
      const [invoice] = await tx
        .insert(salesInvoices)
        .values({
          invoiceNumber: insertInvoice.invoiceNumber,
          invoiceDate: new Date(insertInvoice.invoiceDate),
          customerId: insertInvoice.customerId,
          totalBeforeTax: totals.subtotal,
          taxRate: insertInvoice.taxRate?.toString() || "0.15",
          taxAmount: totals.taxAmount,
          totalAfterTax: totals.total,
          totalCost: totals.totalCost,
          status: "مسودة",
          notes: insertInvoice.notes || null,
        })
        .returning();

      // Create invoice items
      const items = [];
      for (const item of insertInvoice.items) {
        const product = await this.getProduct(item.productId);
        if (!product) {
          throw new Error(`الصنف غير موجود: ${item.productId}`);
        }

        const quantity = parseFloat(item.quantity.toString());
        const unitPrice = parseFloat(item.unitPrice.toString());
        const costPrice = parseFloat(product.costPrice);
        const total = quantity * unitPrice;
        const totalCost = quantity * costPrice;

        const [invoiceItem] = await tx
          .insert(salesInvoiceItems)
          .values({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: quantity.toString(),
            unitPrice: unitPrice.toString(),
            total: total.toFixed(2),
            costPrice: costPrice.toString(),
            totalCost: totalCost.toFixed(2),
          })
          .returning();

        items.push({
          ...invoiceItem,
          productName: product.itemName,
          unit: product.unit,
        });
      }

      // Get customer name
      const customer = await this.getCustomer(invoice.customerId);

      return {
        ...invoice,
        items,
        customerName: customer?.name,
      };
    });
  }

  async getSalesInvoices(filters?: SalesInvoiceFilters): Promise<FullSalesInvoice[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(salesInvoices.status, filters.status));
    }
    if (filters?.customerId) {
      conditions.push(eq(salesInvoices.customerId, filters.customerId));
    }
    if (filters?.from) {
      conditions.push(gte(salesInvoices.invoiceDate, filters.from));
    }
    if (filters?.to) {
      conditions.push(lte(salesInvoices.invoiceDate, filters.to));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const allInvoices = await db
      .select()
      .from(salesInvoices)
      .where(whereClause)
      .orderBy(desc(salesInvoices.createdAt));

    const fullInvoices: FullSalesInvoice[] = [];

    for (const invoice of allInvoices) {
      const items = await db
        .select()
        .from(salesInvoiceItems)
        .where(eq(salesInvoiceItems.invoiceId, invoice.id));

      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await this.getProduct(item.productId);
          return {
            ...item,
            productName: product?.itemName,
            unit: product?.unit,
          };
        })
      );

      const customer = await this.getCustomer(invoice.customerId);

      fullInvoices.push({
        ...invoice,
        items: itemsWithDetails,
        customerName: customer?.name,
      });
    }

    return fullInvoices;
  }

  async getSalesInvoice(id: string): Promise<FullSalesInvoice | undefined> {
    const [invoice] = await db
      .select()
      .from(salesInvoices)
      .where(eq(salesInvoices.id, id));

    if (!invoice) return undefined;

    const items = await db
      .select()
      .from(salesInvoiceItems)
      .where(eq(salesInvoiceItems.invoiceId, invoice.id));

    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const product = await this.getProduct(item.productId);
        return {
          ...item,
          productName: product?.itemName,
          unit: product?.unit,
        };
      })
    );

    const customer = await this.getCustomer(invoice.customerId);

    return {
      ...invoice,
      items: itemsWithDetails,
      customerName: customer?.name,
    };
  }

  async updateSalesInvoiceDraft(id: string, insertInvoice: InsertFullSalesInvoice): Promise<FullSalesInvoice> {
    return await db.transaction(async (tx) => {
      // Check if invoice exists and is still a draft
      const [existingInvoice] = await tx
        .select()
        .from(salesInvoices)
        .where(eq(salesInvoices.id, id));

      if (!existingInvoice) {
        throw new Error("الفاتورة غير موجودة");
      }

      if (existingInvoice.status !== "مسودة") {
        throw new Error("لا يمكن تعديل فاتورة منشورة");
      }

      // Compute totals
      const totals = await this.computeSalesInvoiceTotals(
        insertInvoice.items.map(item => ({
          productId: item.productId,
          quantity: parseFloat(item.quantity.toString()),
          unitPrice: parseFloat(item.unitPrice.toString()),
        }))
      );

      // Update invoice header
      const [invoice] = await tx
        .update(salesInvoices)
        .set({
          invoiceNumber: insertInvoice.invoiceNumber,
          invoiceDate: new Date(insertInvoice.invoiceDate),
          customerId: insertInvoice.customerId,
          totalBeforeTax: totals.subtotal,
          taxRate: insertInvoice.taxRate?.toString() || "0.15",
          taxAmount: totals.taxAmount,
          totalAfterTax: totals.total,
          totalCost: totals.totalCost,
          notes: insertInvoice.notes || null,
        })
        .where(eq(salesInvoices.id, id))
        .returning();

      // Delete old items
      await tx.delete(salesInvoiceItems).where(eq(salesInvoiceItems.invoiceId, id));

      // Create new items
      const items = [];
      for (const item of insertInvoice.items) {
        const product = await this.getProduct(item.productId);
        if (!product) {
          throw new Error(`الصنف غير موجود: ${item.productId}`);
        }

        const quantity = parseFloat(item.quantity.toString());
        const unitPrice = parseFloat(item.unitPrice.toString());
        const costPrice = parseFloat(product.costPrice);
        const total = quantity * unitPrice;
        const totalCost = quantity * costPrice;

        const [invoiceItem] = await tx
          .insert(salesInvoiceItems)
          .values({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: quantity.toString(),
            unitPrice: unitPrice.toString(),
            total: total.toFixed(2),
            costPrice: costPrice.toString(),
            totalCost: totalCost.toFixed(2),
          })
          .returning();

        items.push({
          ...invoiceItem,
          productName: product.itemName,
          unit: product.unit,
        });
      }

      const customer = await this.getCustomer(invoice.customerId);

      return {
        ...invoice,
        items,
        customerName: customer?.name,
      };
    });
  }

  async deleteSalesInvoiceDraft(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const [invoice] = await tx
        .select()
        .from(salesInvoices)
        .where(eq(salesInvoices.id, id));

      if (!invoice) {
        return false;
      }

      if (invoice.status !== "مسودة") {
        throw new Error("لا يمكن حذف فاتورة منشورة");
      }

      // Delete items
      await tx.delete(salesInvoiceItems).where(eq(salesInvoiceItems.invoiceId, id));

      // Delete invoice
      await tx.delete(salesInvoices).where(eq(salesInvoices.id, id));

      return true;
    });
  }

  async postSalesInvoice(id: string): Promise<FullSalesInvoice> {
    return await db.transaction(async (tx) => {
      // Get invoice
      const [invoice] = await tx
        .select()
        .from(salesInvoices)
        .where(eq(salesInvoices.id, id));

      if (!invoice) {
        throw new Error("الفاتورة غير موجودة");
      }

      if (invoice.status === "منشورة") {
        throw new Error("الفاتورة منشورة مسبقاً");
      }

      // Get invoice items
      const items = await tx
        .select()
        .from(salesInvoiceItems)
        .where(eq(salesInvoiceItems.invoiceId, id));

      // Check stock availability
      for (const item of items) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (!product) {
          throw new Error(`الصنف غير موجود: ${item.productId}`);
        }

        const availableQty = parseFloat(product.quantityOnHand);
        const requiredQty = parseFloat(item.quantity);

        if (availableQty < requiredQty) {
          throw new Error(`كمية غير كافية للصنف "${product.itemName}". المتوفر: ${availableQty}، المطلوب: ${requiredQty}`);
        }
      }

      // Get customer
      const [customer] = await tx
        .select()
        .from(customers)
        .where(eq(customers.id, invoice.customerId));

      if (!customer || !customer.accountId) {
        throw new Error("العميل غير موجود أو ليس له حساب محاسبي مرتبط");
      }

      // Get or create revenue account
      let [revenueAccount] = await tx.select().from(accounts).where(eq(accounts.code, "4100"));
      if (!revenueAccount) {
        [revenueAccount] = await tx
          .insert(accounts)
          .values({
            code: "4100",
            name: "إيرادات المبيعات",
            type: "إيرادات",
            balance: "0",
            isActive: 1,
          })
          .returning();
      }

      // Get or create VAT payable account
      let [vatAccount] = await tx.select().from(accounts).where(eq(accounts.code, "2310"));
      if (!vatAccount) {
        [vatAccount] = await tx
          .insert(accounts)
          .values({
            code: "2310",
            name: "ضريبة القيمة المضافة المستحقة",
            type: "خصوم",
            balance: "0",
            isActive: 1,
          })
          .returning();
      }

      // Get or create COGS account
      let [cogsAccount] = await tx.select().from(accounts).where(eq(accounts.code, "5100"));
      if (!cogsAccount) {
        [cogsAccount] = await tx
          .insert(accounts)
          .values({
            code: "5100",
            name: "تكلفة البضاعة المباعة",
            type: "مصروفات",
            balance: "0",
            isActive: 1,
          })
          .returning();
      }

      // Get or create Inventory account
      let [inventoryAccount] = await tx.select().from(accounts).where(eq(accounts.code, "1310"));
      if (!inventoryAccount) {
        [inventoryAccount] = await tx
          .insert(accounts)
          .values({
            code: "1310",
            name: "المخزون",
            type: "أصول",
            balance: "0",
            isActive: 1,
          })
          .returning();
      }

      // Create revenue entry
      const [revenueEntry] = await tx
        .insert(entries)
        .values({
          entryNumber: `INV-${invoice.invoiceNumber}`,
          date: invoice.invoiceDate,
          description: `قيد إيرادات فاتورة مبيعات رقم ${invoice.invoiceNumber}`,
          totalDebit: invoice.totalAfterTax,
          totalCredit: invoice.totalAfterTax,
          isBalanced: 1,
        })
        .returning();

      // Create revenue entry lines and update account balances
      await tx.insert(entryLines).values({
        entryId: revenueEntry.id,
        accountId: customer.accountId,
        debit: invoice.totalAfterTax,
        credit: "0",
        description: `مدين: ${customer.name}`,
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric + ${invoice.totalAfterTax}::numeric` })
        .where(eq(accounts.id, customer.accountId));

      await tx.insert(entryLines).values({
        entryId: revenueEntry.id,
        accountId: revenueAccount.id,
        debit: "0",
        credit: invoice.totalBeforeTax,
        description: "إيرادات المبيعات",
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric - ${invoice.totalBeforeTax}::numeric` })
        .where(eq(accounts.id, revenueAccount.id));

      await tx.insert(entryLines).values({
        entryId: revenueEntry.id,
        accountId: vatAccount.id,
        debit: "0",
        credit: invoice.taxAmount,
        description: "ضريبة القيمة المضافة",
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric - ${invoice.taxAmount}::numeric` })
        .where(eq(accounts.id, vatAccount.id));

      // Create cost entry
      const [costEntry] = await tx
        .insert(entries)
        .values({
          entryNumber: `COGS-${invoice.invoiceNumber}`,
          date: invoice.invoiceDate,
          description: `قيد تكلفة فاتورة مبيعات رقم ${invoice.invoiceNumber}`,
          totalDebit: invoice.totalCost,
          totalCredit: invoice.totalCost,
          isBalanced: 1,
        })
        .returning();

      // Create cost entry lines and update account balances
      await tx.insert(entryLines).values({
        entryId: costEntry.id,
        accountId: cogsAccount.id,
        debit: invoice.totalCost,
        credit: "0",
        description: "تكلفة البضاعة المباعة",
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric + ${invoice.totalCost}::numeric` })
        .where(eq(accounts.id, cogsAccount.id));

      await tx.insert(entryLines).values({
        entryId: costEntry.id,
        accountId: inventoryAccount.id,
        debit: "0",
        credit: invoice.totalCost,
        description: "خصم من المخزون",
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric - ${invoice.totalCost}::numeric` })
        .where(eq(accounts.id, inventoryAccount.id));

      // Deduct quantities and create stock movements
      for (const item of items) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        const quantityBefore = parseFloat(product!.quantityOnHand);
        const quantity = parseFloat(item.quantity);
        const quantityAfter = quantityBefore - quantity;

        // Update product quantity
        await tx
          .update(products)
          .set({ quantityOnHand: quantityAfter.toString() })
          .where(eq(products.id, item.productId));

        // Create stock movement
        await tx.insert(stockMovements).values({
          productId: item.productId,
          movementType: "فاتورة مبيعات",
          referenceId: invoice.id,
          referenceNumber: invoice.invoiceNumber,
          quantity: (-quantity).toString(), // Negative for outbound
          quantityBefore: quantityBefore.toString(),
          quantityAfter: quantityAfter.toString(),
          movementDate: invoice.invoiceDate,
          notes: `فاتورة مبيعات رقم ${invoice.invoiceNumber}`,
        });
      }

      // Update customer balance
      const newCustomerBalance = parseFloat(customer.currentBalance) + parseFloat(invoice.totalAfterTax);
      await tx
        .update(customers)
        .set({ currentBalance: newCustomerBalance.toString() })
        .where(eq(customers.id, invoice.customerId));

      // Update invoice status
      const [postedInvoice] = await tx
        .update(salesInvoices)
        .set({
          status: "منشورة",
          entryId: revenueEntry.id,
          costEntryId: costEntry.id,
          postedAt: new Date(),
        })
        .where(eq(salesInvoices.id, id))
        .returning();

      // Return full invoice
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await this.getProduct(item.productId);
          return {
            ...item,
            productName: product?.itemName,
            unit: product?.unit,
          };
        })
      );

      return {
        ...postedInvoice,
        items: itemsWithDetails,
        customerName: customer.name,
      };
    });
  }

  // ===============================
  // Receipt Voucher Operations
  // ===============================

  async getReceiptVouchers(): Promise<FullReceiptVoucher[]> {
    const vouchers = await db.select().from(receiptVouchers).orderBy(desc(receiptVouchers.createdAt));
    
    return await Promise.all(
      vouchers.map(async (voucher) => {
        const allocations = await db
          .select()
          .from(receiptVoucherAllocations)
          .where(eq(receiptVoucherAllocations.voucherId, voucher.id));

        const customer = await this.getCustomer(voucher.customerId);
        const targetAccount = await db
          .select()
          .from(accounts)
          .where(eq(accounts.id, voucher.targetAccountId))
          .then(res => res[0]);

        const allocationsWithInvoices = await Promise.all(
          allocations.map(async (allocation) => {
            const invoice = await db
              .select()
              .from(salesInvoices)
              .where(eq(salesInvoices.id, allocation.invoiceId))
              .then(res => res[0]);
            return {
              ...allocation,
              invoiceNumber: invoice?.invoiceNumber,
            };
          })
        );

        return {
          ...voucher,
          allocations: allocationsWithInvoices,
          customerName: customer?.name,
          targetAccountName: targetAccount?.name,
        };
      })
    );
  }

  async getReceiptVoucher(id: string): Promise<FullReceiptVoucher | undefined> {
    const [voucher] = await db.select().from(receiptVouchers).where(eq(receiptVouchers.id, id));
    if (!voucher) return undefined;

    const allocations = await db
      .select()
      .from(receiptVoucherAllocations)
      .where(eq(receiptVoucherAllocations.voucherId, id));

    const customer = await this.getCustomer(voucher.customerId);
    const targetAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, voucher.targetAccountId))
      .then(res => res[0]);

    const allocationsWithInvoices = await Promise.all(
      allocations.map(async (allocation) => {
        const invoice = await db
          .select()
          .from(salesInvoices)
          .where(eq(salesInvoices.id, allocation.invoiceId))
          .then(res => res[0]);
        return {
          ...allocation,
          invoiceNumber: invoice?.invoiceNumber,
        };
      })
    );

    return {
      ...voucher,
      allocations: allocationsWithInvoices,
      customerName: customer?.name,
      targetAccountName: targetAccount?.name,
    };
  }

  async createReceiptVoucherDraft(data: InsertFullReceiptVoucher): Promise<FullReceiptVoucher> {
    return await db.transaction(async (tx) => {
      // Validate allocations if any
      if (data.allocations && data.allocations.length > 0) {
        // Check sum of allocations doesn't exceed voucher amount
        const totalAllocations = data.allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
          0
        );
        const voucherAmount = parseFloat(data.amount.toString());
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }

        // Validate each allocation
        for (const allocation of data.allocations) {
          // Check amount is positive
          if (parseFloat(allocation.amount.toString()) <= 0) {
            throw new ValidationError("مبلغ التخصيص يجب أن يكون أكبر من صفر");
          }

          const [invoice] = await tx
            .select()
            .from(salesInvoices)
            .where(eq(salesInvoices.id, allocation.invoiceId));

          if (!invoice) {
            throw new NotFoundError(`الفاتورة غير موجودة: ${allocation.invoiceId}`);
          }

          if (invoice.customerId !== data.customerId) {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} لا تنتمي للعميل المحدد`);
          }

          if (invoice.status !== "منشورة") {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} ليست منشورة`);
          }
        }
      }

      // Create voucher
      const [voucher] = await tx
        .insert(receiptVouchers)
        .values({
          voucherNumber: data.voucherNumber,
          voucherDate: new Date(data.voucherDate),
          customerId: data.customerId,
          amount: data.amount.toString(),
          paymentMethod: data.paymentMethod,
          targetAccountId: data.targetAccountId,
          checkNumber: data.checkNumber,
          checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
          checkBank: data.checkBank,
          status: "مسودة",
          notes: data.notes,
        })
        .returning();

      // Create allocations if any
      if (data.allocations && data.allocations.length > 0) {
        await tx.insert(receiptVoucherAllocations).values(
          data.allocations.map((allocation) => ({
            voucherId: voucher.id,
            invoiceId: allocation.invoiceId,
            amount: allocation.amount.toString(),
          }))
        );
      }

      return await this.getReceiptVoucher(voucher.id) as FullReceiptVoucher;
    });
  }

  async updateReceiptVoucherDraft(id: string, data: InsertFullReceiptVoucher): Promise<FullReceiptVoucher> {
    return await db.transaction(async (tx) => {
      // Get voucher
      const [voucher] = await tx.select().from(receiptVouchers).where(eq(receiptVouchers.id, id));
      
      if (!voucher) {
        throw new NotFoundError("السند غير موجود");
      }

      if (voucher.status !== "مسودة") {
        throw new InvalidStateError("لا يمكن تعديل سند منشور");
      }

      // Validate allocations if any
      if (data.allocations && data.allocations.length > 0) {
        // Check sum of allocations doesn't exceed voucher amount
        const totalAllocations = data.allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
          0
        );
        const voucherAmount = parseFloat(data.amount.toString());
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }

        // Validate each allocation
        for (const allocation of data.allocations) {
          // Check amount is positive
          if (parseFloat(allocation.amount.toString()) <= 0) {
            throw new ValidationError("مبلغ التخصيص يجب أن يكون أكبر من صفر");
          }

          const [invoice] = await tx
            .select()
            .from(salesInvoices)
            .where(eq(salesInvoices.id, allocation.invoiceId));

          if (!invoice) {
            throw new NotFoundError(`الفاتورة غير موجودة: ${allocation.invoiceId}`);
          }

          if (invoice.customerId !== data.customerId) {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} لا تنتمي للعميل المحدد`);
          }

          if (invoice.status !== "منشورة") {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} ليست منشورة`);
          }
        }
      }

      // Update voucher
      await tx
        .update(receiptVouchers)
        .set({
          voucherNumber: data.voucherNumber,
          voucherDate: new Date(data.voucherDate),
          customerId: data.customerId,
          amount: data.amount.toString(),
          paymentMethod: data.paymentMethod,
          targetAccountId: data.targetAccountId,
          checkNumber: data.checkNumber,
          checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
          checkBank: data.checkBank,
          notes: data.notes,
        })
        .where(eq(receiptVouchers.id, id));

      // Delete old allocations
      await tx.delete(receiptVoucherAllocations).where(eq(receiptVoucherAllocations.voucherId, id));

      // Create new allocations if any
      if (data.allocations && data.allocations.length > 0) {
        await tx.insert(receiptVoucherAllocations).values(
          data.allocations.map((allocation) => ({
            voucherId: id,
            invoiceId: allocation.invoiceId,
            amount: allocation.amount.toString(),
          }))
        );
      }

      return await this.getReceiptVoucher(id) as FullReceiptVoucher;
    });
  }

  async deleteReceiptVoucherDraft(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const [voucher] = await tx.select().from(receiptVouchers).where(eq(receiptVouchers.id, id));
      
      if (!voucher) {
        return false;
      }

      if (voucher.status !== "مسودة") {
        throw new InvalidStateError("لا يمكن حذف سند منشور");
      }

      // Delete allocations
      await tx.delete(receiptVoucherAllocations).where(eq(receiptVoucherAllocations.voucherId, id));

      // Delete voucher
      await tx.delete(receiptVouchers).where(eq(receiptVouchers.id, id));

      return true;
    });
  }

  async postReceiptVoucher(id: string): Promise<FullReceiptVoucher> {
    return await db.transaction(async (tx) => {
      // Get voucher
      const [voucher] = await tx.select().from(receiptVouchers).where(eq(receiptVouchers.id, id));

      if (!voucher) {
        throw new NotFoundError("السند غير موجود");
      }

      if (voucher.status === "منشور") {
        throw new InvalidStateError("السند منشور مسبقاً");
      }

      // Get customer
      const [customer] = await tx.select().from(customers).where(eq(customers.id, voucher.customerId));

      if (!customer || !customer.accountId) {
        throw new NotFoundError("العميل غير موجود أو ليس له حساب محاسبي مرتبط");
      }

      // Get target account (bank or cash)
      const [targetAccount] = await tx.select().from(accounts).where(eq(accounts.id, voucher.targetAccountId));

      if (!targetAccount) {
        throw new NotFoundError("الحساب المستهدف غير موجود");
      }

      // Re-validate allocations before posting
      const allocations = await tx
        .select()
        .from(receiptVoucherAllocations)
        .where(eq(receiptVoucherAllocations.voucherId, id));

      if (allocations.length > 0) {
        // Check sum of allocations
        const totalAllocations = allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount),
          0
        );
        const voucherAmount = parseFloat(voucher.amount);
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }

        // Validate each allocation
        for (const allocation of allocations) {
          const [invoice] = await tx
            .select()
            .from(salesInvoices)
            .where(eq(salesInvoices.id, allocation.invoiceId));

          if (!invoice) {
            throw new NotFoundError(`الفاتورة غير موجودة: ${allocation.invoiceId}`);
          }

          if (invoice.customerId !== voucher.customerId) {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} لا تنتمي للعميل المحدد`);
          }

          if (invoice.status !== "منشورة") {
            throw new ValidationError(`الفاتورة ${invoice.invoiceNumber} ليست منشورة`);
          }
        }
      }

      // Create accounting entry
      // Debit: Bank/Cash account, Credit: Customer account
      const [entry] = await tx
        .insert(entries)
        .values({
          entryNumber: `RCV-${voucher.voucherNumber}`,
          date: voucher.voucherDate,
          description: `سند قبض رقم ${voucher.voucherNumber} من ${customer.name}`,
          totalDebit: voucher.amount,
          totalCredit: voucher.amount,
          isBalanced: 1,
        })
        .returning();

      // Entry line 1: Debit target account (bank/cash)
      await tx.insert(entryLines).values({
        entryId: entry.id,
        accountId: voucher.targetAccountId,
        debit: voucher.amount,
        credit: "0",
        description: `${targetAccount.name} - ${voucher.paymentMethod}`,
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric + ${voucher.amount}::numeric` })
        .where(eq(accounts.id, voucher.targetAccountId));

      // Entry line 2: Credit customer account
      await tx.insert(entryLines).values({
        entryId: entry.id,
        accountId: customer.accountId,
        debit: "0",
        credit: voucher.amount,
        description: `من العميل: ${customer.name}`,
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric - ${voucher.amount}::numeric` })
        .where(eq(accounts.id, customer.accountId));

      // Update customer balance (decrease debit balance)
      const newCustomerBalance = parseFloat(customer.currentBalance) - parseFloat(voucher.amount);
      await tx
        .update(customers)
        .set({ currentBalance: newCustomerBalance.toString() })
        .where(eq(customers.id, voucher.customerId));

      // Update voucher status
      const [postedVoucher] = await tx
        .update(receiptVouchers)
        .set({
          status: "منشور",
          entryId: entry.id,
          postedAt: new Date(),
        })
        .where(eq(receiptVouchers.id, id))
        .returning();

      // Use allocations already fetched earlier for validation
      const allocationsWithInvoices = await Promise.all(
        allocations.map(async (allocation) => {
          const invoice = await tx
            .select()
            .from(salesInvoices)
            .where(eq(salesInvoices.id, allocation.invoiceId))
            .then(res => res[0]);
          return {
            ...allocation,
            invoiceNumber: invoice?.invoiceNumber,
          };
        })
      );

      return {
        ...postedVoucher,
        allocations: allocationsWithInvoices,
        customerName: customer.name,
        targetAccountName: targetAccount.name,
      };
    });
  }

  // ===============================
  // Payment Voucher Operations
  // ===============================

  async getPaymentVouchers(): Promise<FullPaymentVoucher[]> {
    const vouchers = await db.select().from(paymentVouchers).orderBy(desc(paymentVouchers.createdAt));
    
    return await Promise.all(
      vouchers.map(async (voucher) => {
        const allocations = await db
          .select()
          .from(paymentVoucherAllocations)
          .where(eq(paymentVoucherAllocations.voucherId, voucher.id));

        const supplier = await this.getSupplier(voucher.supplierId);
        const sourceAccount = await db
          .select()
          .from(accounts)
          .where(eq(accounts.id, voucher.sourceAccountId))
          .then(res => res[0]);

        const allocationsWithInvoices = await Promise.all(
          allocations.map(async (allocation) => {
            return {
              ...allocation,
              invoiceNumber: allocation.purchaseInvoiceId,
            };
          })
        );

        return {
          ...voucher,
          allocations: allocationsWithInvoices,
          supplierName: supplier?.name,
          sourceAccountName: sourceAccount?.name,
        };
      })
    );
  }

  async getPaymentVoucher(id: string): Promise<FullPaymentVoucher | undefined> {
    const [voucher] = await db.select().from(paymentVouchers).where(eq(paymentVouchers.id, id));
    if (!voucher) return undefined;

    const allocations = await db
      .select()
      .from(paymentVoucherAllocations)
      .where(eq(paymentVoucherAllocations.voucherId, id));

    const supplier = await this.getSupplier(voucher.supplierId);
    const sourceAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, voucher.sourceAccountId))
      .then(res => res[0]);

    const allocationsWithInvoices = await Promise.all(
      allocations.map(async (allocation) => {
        return {
          ...allocation,
          invoiceNumber: allocation.purchaseInvoiceId,
        };
      })
    );

    return {
      ...voucher,
      allocations: allocationsWithInvoices,
      supplierName: supplier?.name,
      sourceAccountName: sourceAccount?.name,
    };
  }

  async createPaymentVoucherDraft(data: InsertFullPaymentVoucher): Promise<FullPaymentVoucher> {
    return await db.transaction(async (tx) => {
      // Validate allocations if any
      if (data.allocations && data.allocations.length > 0) {
        // Check sum of allocations doesn't exceed voucher amount
        const totalAllocations = data.allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
          0
        );
        const voucherAmount = parseFloat(data.amount.toString());
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }

        // Validate each allocation
        for (const allocation of data.allocations) {
          // Check amount is positive
          if (parseFloat(allocation.amount.toString()) <= 0) {
            throw new ValidationError("مبلغ التخصيص يجب أن يكون أكبر من صفر");
          }
        }
      }

      // Create voucher
      const [voucher] = await tx
        .insert(paymentVouchers)
        .values({
          voucherNumber: data.voucherNumber,
          voucherDate: new Date(data.voucherDate),
          supplierId: data.supplierId,
          amount: data.amount.toString(),
          paymentMethod: data.paymentMethod,
          sourceAccountId: data.sourceAccountId,
          checkNumber: data.checkNumber,
          checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
          checkBank: data.checkBank,
          status: "مسودة",
          notes: data.notes,
        })
        .returning();

      // Create allocations if any
      if (data.allocations && data.allocations.length > 0) {
        await tx.insert(paymentVoucherAllocations).values(
          data.allocations.map((allocation) => ({
            voucherId: voucher.id,
            purchaseInvoiceId: allocation.purchaseInvoiceId,
            amount: allocation.amount.toString(),
          }))
        );
      }

      return await this.getPaymentVoucher(voucher.id) as FullPaymentVoucher;
    });
  }

  async updatePaymentVoucherDraft(id: string, data: InsertFullPaymentVoucher): Promise<FullPaymentVoucher> {
    return await db.transaction(async (tx) => {
      // Get voucher
      const [voucher] = await tx.select().from(paymentVouchers).where(eq(paymentVouchers.id, id));
      
      if (!voucher) {
        throw new NotFoundError("السند غير موجود");
      }

      if (voucher.status !== "مسودة") {
        throw new InvalidStateError("لا يمكن تعديل سند منشور");
      }

      // Validate allocations if any
      if (data.allocations && data.allocations.length > 0) {
        // Check sum of allocations doesn't exceed voucher amount
        const totalAllocations = data.allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount.toString()),
          0
        );
        const voucherAmount = parseFloat(data.amount.toString());
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }

        // Validate each allocation
        for (const allocation of data.allocations) {
          // Check amount is positive
          if (parseFloat(allocation.amount.toString()) <= 0) {
            throw new ValidationError("مبلغ التخصيص يجب أن يكون أكبر من صفر");
          }
        }
      }

      // Update voucher
      await tx
        .update(paymentVouchers)
        .set({
          voucherNumber: data.voucherNumber,
          voucherDate: new Date(data.voucherDate),
          supplierId: data.supplierId,
          amount: data.amount.toString(),
          paymentMethod: data.paymentMethod,
          sourceAccountId: data.sourceAccountId,
          checkNumber: data.checkNumber,
          checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
          checkBank: data.checkBank,
          notes: data.notes,
        })
        .where(eq(paymentVouchers.id, id));

      // Delete old allocations
      await tx.delete(paymentVoucherAllocations).where(eq(paymentVoucherAllocations.voucherId, id));

      // Create new allocations if any
      if (data.allocations && data.allocations.length > 0) {
        await tx.insert(paymentVoucherAllocations).values(
          data.allocations.map((allocation) => ({
            voucherId: id,
            purchaseInvoiceId: allocation.purchaseInvoiceId,
            amount: allocation.amount.toString(),
          }))
        );
      }

      return await this.getPaymentVoucher(id) as FullPaymentVoucher;
    });
  }

  async deletePaymentVoucherDraft(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const [voucher] = await tx.select().from(paymentVouchers).where(eq(paymentVouchers.id, id));
      
      if (!voucher) {
        return false;
      }

      if (voucher.status !== "مسودة") {
        throw new InvalidStateError("لا يمكن حذف سند منشور");
      }

      // Delete allocations
      await tx.delete(paymentVoucherAllocations).where(eq(paymentVoucherAllocations.voucherId, id));

      // Delete voucher
      await tx.delete(paymentVouchers).where(eq(paymentVouchers.id, id));

      return true;
    });
  }

  async postPaymentVoucher(id: string): Promise<FullPaymentVoucher> {
    return await db.transaction(async (tx) => {
      // Get voucher
      const [voucher] = await tx.select().from(paymentVouchers).where(eq(paymentVouchers.id, id));

      if (!voucher) {
        throw new NotFoundError("السند غير موجود");
      }

      if (voucher.status === "منشور") {
        throw new InvalidStateError("السند منشور مسبقاً");
      }

      // Get supplier
      const [supplier] = await tx.select().from(suppliers).where(eq(suppliers.id, voucher.supplierId));

      if (!supplier || !supplier.accountId) {
        throw new NotFoundError("المورد غير موجود أو ليس له حساب محاسبي مرتبط");
      }

      // Get source account (bank or cash)
      const [sourceAccount] = await tx.select().from(accounts).where(eq(accounts.id, voucher.sourceAccountId));

      if (!sourceAccount) {
        throw new NotFoundError("الحساب المصدر غير موجود");
      }

      // Re-validate allocations before posting
      const allocations = await tx
        .select()
        .from(paymentVoucherAllocations)
        .where(eq(paymentVoucherAllocations.voucherId, id));

      if (allocations.length > 0) {
        // Check sum of allocations
        const totalAllocations = allocations.reduce(
          (sum, allocation) => sum + parseFloat(allocation.amount),
          0
        );
        const voucherAmount = parseFloat(voucher.amount);
        
        if (totalAllocations > voucherAmount) {
          throw new ValidationError(`مجموع التخصيصات (${totalAllocations}) يتجاوز مبلغ السند (${voucherAmount})`);
        }
      }

      // Create accounting entry
      // Payment: Debit Supplier account, Credit Bank/Cash account
      const [entry] = await tx
        .insert(entries)
        .values({
          entryNumber: `PV-${voucher.voucherNumber}`,
          date: voucher.voucherDate,
          description: `سند دفع رقم ${voucher.voucherNumber} إلى ${supplier.name}`,
          totalDebit: voucher.amount,
          totalCredit: voucher.amount,
          isBalanced: 1,
        })
        .returning();

      // Entry line 1: Debit supplier account
      await tx.insert(entryLines).values({
        entryId: entry.id,
        accountId: supplier.accountId,
        debit: voucher.amount,
        credit: "0",
        description: `إلى المورد: ${supplier.name}`,
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric + ${voucher.amount}::numeric` })
        .where(eq(accounts.id, supplier.accountId));

      // Entry line 2: Credit source account (bank/cash)
      await tx.insert(entryLines).values({
        entryId: entry.id,
        accountId: voucher.sourceAccountId,
        debit: "0",
        credit: voucher.amount,
        description: `${sourceAccount.name} - ${voucher.paymentMethod}`,
      });
      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance}::numeric - ${voucher.amount}::numeric` })
        .where(eq(accounts.id, voucher.sourceAccountId));

      // Update supplier balance (decrease credit balance)
      const newSupplierBalance = parseFloat(supplier.currentBalance) - parseFloat(voucher.amount);
      await tx
        .update(suppliers)
        .set({ currentBalance: newSupplierBalance.toString() })
        .where(eq(suppliers.id, voucher.supplierId));

      // Update voucher status
      const [postedVoucher] = await tx
        .update(paymentVouchers)
        .set({
          status: "منشور",
          entryId: entry.id,
          postedAt: new Date(),
        })
        .where(eq(paymentVouchers.id, id))
        .returning();

      // Use allocations already fetched earlier for validation
      const allocationsWithInvoices = await Promise.all(
        allocations.map(async (allocation) => {
          return {
            ...allocation,
            invoiceNumber: allocation.purchaseInvoiceId,
          };
        })
      );

      return {
        ...postedVoucher,
        allocations: allocationsWithInvoices,
        supplierName: supplier.name,
        sourceAccountName: sourceAccount.name,
      };
    });
  }
}

export const storage = new DatabaseStorage();
