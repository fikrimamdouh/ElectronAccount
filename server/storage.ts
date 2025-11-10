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
  type AccountType,
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private accounts: Map<string, Account>;
  private entries: Map<string, Entry>;
  private entryLines: Map<string, EntryLine>;

  constructor() {
    this.accounts = new Map();
    this.entries = new Map();
    this.entryLines = new Map();

    // Initialize with sample accounts
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample accounts
    const sampleAccounts: InsertAccount[] = [
      { code: "1001", name: "النقدية بالصندوق", type: "أصول", isActive: 1 },
      { code: "1002", name: "البنك", type: "أصول", isActive: 1 },
      { code: "2001", name: "حسابات دائنة", type: "خصوم", isActive: 1 },
      { code: "3001", name: "رأس المال", type: "حقوق ملكية", isActive: 1 },
      { code: "4001", name: "إيرادات المبيعات", type: "إيرادات", isActive: 1 },
      { code: "5001", name: "مصروفات الرواتب", type: "مصروفات", isActive: 1 },
      { code: "5002", name: "مصروفات الإيجار", type: "مصروفات", isActive: 1 },
    ];

    for (const account of sampleAccounts) {
      await this.createAccount(account);
    }
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async getAccountByCode(code: string): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find((acc) => acc.code === code);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = randomUUID();
    const account: Account = {
      ...insertAccount,
      id,
      balance: "0",
      createdAt: new Date(),
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccount(id: string, data: Partial<InsertAccount>): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;

    const updated: Account = { ...account, ...data };
    this.accounts.set(id, updated);
    return updated;
  }

  async deleteAccount(id: string): Promise<boolean> {
    return this.accounts.delete(id);
  }

  async updateAccountBalance(id: string, amount: number): Promise<void> {
    const account = this.accounts.get(id);
    if (account) {
      const currentBalance = Number(account.balance) || 0;
      account.balance = (currentBalance + amount).toFixed(2);
      this.accounts.set(id, account);
    }
  }

  // Entries
  async getEntries(): Promise<FullEntry[]> {
    const entries = Array.from(this.entries.values());
    const fullEntries: FullEntry[] = [];

    for (const entry of entries) {
      const lines = Array.from(this.entryLines.values())
        .filter((line) => line.entryId === entry.id)
        .map((line) => {
          const account = this.accounts.get(line.accountId);
          return {
            ...line,
            accountName: account ? `${account.code} - ${account.name}` : line.accountId,
          };
        });

      fullEntries.push({ ...entry, lines });
    }

    return fullEntries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEntry(id: string): Promise<FullEntry | undefined> {
    const entry = this.entries.get(id);
    if (!entry) return undefined;

    const lines = Array.from(this.entryLines.values())
      .filter((line) => line.entryId === entry.id)
      .map((line) => {
        const account = this.accounts.get(line.accountId);
        return {
          ...line,
          accountName: account ? `${account.code} - ${account.name}` : line.accountId,
        };
      });

    return { ...entry, lines };
  }

  async createEntry(insertEntry: InsertEntry, insertLines: InsertEntryLine[]): Promise<FullEntry> {
    const entryId = randomUUID();

    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;

    for (const line of insertLines) {
      totalDebit += Number(line.debit) || 0;
      totalCredit += Number(line.credit) || 0;
    }

    const isBalanced = totalDebit === totalCredit && totalDebit > 0 ? 1 : 0;

    const entry: Entry = {
      ...insertEntry,
      id: entryId,
      date: new Date(insertEntry.date),
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      isBalanced,
      createdAt: new Date(),
    };

    this.entries.set(entryId, entry);

    // Create entry lines and update account balances
    const lines: (EntryLine & { accountName?: string })[] = [];
    for (const insertLine of insertLines) {
      const lineId = randomUUID();
      const line: EntryLine = {
        ...insertLine,
        id: lineId,
        entryId,
        debit: (Number(insertLine.debit) || 0).toFixed(2),
        credit: (Number(insertLine.credit) || 0).toFixed(2),
        createdAt: new Date(),
      };

      this.entryLines.set(lineId, line);

      // Update account balance
      const account = this.accounts.get(line.accountId);
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
        
        lines.push({
          ...line,
          accountName: `${account.code} - ${account.name}`,
        });
      } else {
        lines.push(line);
      }
    }

    return { ...entry, lines };
  }

  async deleteEntry(id: string): Promise<boolean> {
    const entry = this.entries.get(id);
    if (!entry) return false;

    // Delete entry lines and reverse account balances
    const lines = Array.from(this.entryLines.values()).filter(
      (line) => line.entryId === id
    );

    for (const line of lines) {
      const account = this.accounts.get(line.accountId);
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

      this.entryLines.delete(line.id);
    }

    return this.entries.delete(id);
  }

  // Reports
  async getTrialBalance(): Promise<TrialBalanceRow[]> {
    const accounts = Array.from(this.accounts.values());
    const rows: TrialBalanceRow[] = [];

    for (const account of accounts) {
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
    const accounts = Array.from(this.accounts.values());
    
    const revenues = accounts
      .filter((acc) => acc.type === "إيرادات")
      .map((acc) => ({
        accountName: acc.name,
        amount: acc.balance,
      }));

    const expenses = accounts
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
    const accounts = Array.from(this.accounts.values());

    const assets = accounts
      .filter((acc) => acc.type === "أصول")
      .map((acc) => ({
        accountName: acc.name,
        amount: acc.balance,
      }));

    const liabilities = accounts
      .filter((acc) => acc.type === "خصوم")
      .map((acc) => ({
        accountName: acc.name,
        amount: Math.abs(Number(acc.balance)).toFixed(2),
      }));

    const equity = accounts
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
    const accounts = Array.from(this.accounts.values());
    const entries = await this.getEntries();

    const totalRevenues = accounts
      .filter((acc) => acc.type === "إيرادات")
      .reduce((sum, acc) => sum + Math.abs(Number(acc.balance)), 0);

    const totalExpenses = accounts
      .filter((acc) => acc.type === "مصروفات")
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    const totalBalance = accounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );

    const netIncome = totalRevenues - totalExpenses;

    // Get recent entries (last 10)
    const recentEntries = entries.slice(0, 10);

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

export const storage = new MemStorage();
