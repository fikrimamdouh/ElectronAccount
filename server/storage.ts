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
  accounts,
  entries,
  entryLines,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
