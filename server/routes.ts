import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAccountSchema,
  insertFullEntrySchema,
  insertProductSchema,
  insertCustomerSchema,
  insertFullSalesInvoiceSchema,
  insertFullReceiptVoucherSchema,
  type InsertAccount,
  type InsertFullEntry,
  type InsertProduct,
  type InsertCustomer,
  type InsertFullSalesInvoice,
} from "@shared/schema";
import { z } from "zod";
import { AppError } from "./errors";

export async function registerRoutes(app: Express): Promise<Server> {
  // Accounts Routes
  app.get("/api/accounts", async (_req, res) => {
    try {
      const accounts = await storage.getAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "فشل في جلب الحسابات" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ error: "الحساب غير موجود" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ error: "فشل في جلب الحساب" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);

      // Check if account code already exists
      const existing = await storage.getAccountByCode(validatedData.code);
      if (existing) {
        return res.status(400).json({ error: "رمز الحساب موجود بالفعل" });
      }

      const account = await storage.createAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error creating account:", error);
      res.status(500).json({ error: "فشل في إنشاء الحساب" });
    }
  });

  app.put("/api/accounts/:id", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.partial().parse(req.body);
      const account = await storage.updateAccount(req.params.id, validatedData);
      
      if (!account) {
        return res.status(404).json({ error: "الحساب غير موجود" });
      }
      
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error updating account:", error);
      res.status(500).json({ error: "فشل في تحديث الحساب" });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAccount(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "الحساب غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "فشل في حذف الحساب" });
    }
  });

  // Entries Routes
  app.get("/api/entries", async (_req, res) => {
    try {
      const entries = await storage.getEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "فشل في جلب القيود" });
    }
  });

  app.get("/api/entries/:id", async (req, res) => {
    try {
      const entry = await storage.getEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "القيد غير موجود" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching entry:", error);
      res.status(500).json({ error: "فشل في جلب القيد" });
    }
  });

  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertFullEntrySchema.parse(req.body);

      // Validate that entry is balanced
      const totalDebit = validatedData.lines.reduce(
        (sum, line) => sum + Number(line.debit || 0),
        0
      );
      const totalCredit = validatedData.lines.reduce(
        (sum, line) => sum + Number(line.credit || 0),
        0
      );

      if (totalDebit !== totalCredit) {
        return res.status(400).json({ 
          error: "القيد غير متوازن - المدين لا يساوي الدائن" 
        });
      }

      if (totalDebit === 0) {
        return res.status(400).json({ 
          error: "القيد يجب أن يحتوي على مبالغ" 
        });
      }

      // Create entry
      const entry = await storage.createEntry(
        {
          entryNumber: validatedData.entryNumber,
          date: validatedData.date,
          description: validatedData.description,
        },
        validatedData.lines
      );

      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error creating entry:", error);
      res.status(500).json({ error: "فشل في إنشاء القيد" });
    }
  });

  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "القيد غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting entry:", error);
      res.status(500).json({ error: "فشل في حذف القيد" });
    }
  });

  // Reports Routes
  app.get("/api/trial-balance", async (_req, res) => {
    try {
      const trialBalance = await storage.getTrialBalance();
      res.json(trialBalance);
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      res.status(500).json({ error: "فشل في جلب ميزان المراجعة" });
    }
  });

  app.get("/api/reports/income-statement", async (req, res) => {
    try {
      const from = req.query.from 
        ? new Date(req.query.from as string) 
        : new Date(new Date().getFullYear(), 0, 1);
      const to = req.query.to 
        ? new Date(req.query.to as string) 
        : new Date();

      const incomeStatement = await storage.getIncomeStatement(from, to);
      res.json(incomeStatement);
    } catch (error) {
      console.error("Error fetching income statement:", error);
      res.status(500).json({ error: "فشل في جلب قائمة الدخل" });
    }
  });

  app.get("/api/reports/balance-sheet", async (req, res) => {
    try {
      const date = req.query.date 
        ? new Date(req.query.date as string) 
        : new Date();

      const balanceSheet = await storage.getBalanceSheet(date);
      res.json(balanceSheet);
    } catch (error) {
      console.error("Error fetching balance sheet:", error);
      res.status(500).json({ error: "فشل في جلب الميزانية العمومية" });
    }
  });

  // Dashboard Routes
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "فشل في جلب الإحصائيات" });
    }
  });

  // Products Routes
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "فشل في جلب الأصناف" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "الصنف غير موجود" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "فشل في جلب الصنف" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);

      // Check if product code already exists
      const existing = await storage.getProductByCode(validatedData.itemCode);
      if (existing) {
        return res.status(400).json({ error: "كود الصنف موجود بالفعل" });
      }

      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "فشل في إنشاء الصنف" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      
      if (!product) {
        return res.status(404).json({ error: "الصنف غير موجود" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ error: "فشل في تحديث الصنف" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "الصنف غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "فشل في حذف الصنف" });
    }
  });

  // Customers Routes
  app.get("/api/customers", async (_req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "فشل في جلب العملاء" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "العميل غير موجود" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "فشل في جلب العميل" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);

      // Check if customer code already exists
      const existing = await storage.getCustomerByCode(validatedData.code);
      if (existing) {
        return res.status(400).json({ error: "كود العميل موجود بالفعل" });
      }

      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "فشل في إنشاء العميل" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      
      if (!customer) {
        return res.status(404).json({ error: "العميل غير موجود" });
      }
      
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "فشل في تحديث العميل" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "العميل غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "فشل في حذف العميل" });
    }
  });

  // Sales Invoices Routes
  app.get("/api/sales-invoices", async (req, res) => {
    try {
      const filters: any = {};
      
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      if (req.query.customerId) {
        filters.customerId = req.query.customerId as string;
      }
      if (req.query.from) {
        filters.from = new Date(req.query.from as string);
      }
      if (req.query.to) {
        filters.to = new Date(req.query.to as string);
      }

      const invoices = await storage.getSalesInvoices(filters);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching sales invoices:", error);
      res.status(500).json({ error: "فشل في جلب الفواتير" });
    }
  });

  app.get("/api/sales-invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getSalesInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "الفاتورة غير موجودة" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error fetching sales invoice:", error);
      res.status(500).json({ error: "فشل في جلب الفاتورة" });
    }
  });

  app.post("/api/sales-invoices", async (req, res) => {
    try {
      const validatedData = insertFullSalesInvoiceSchema.parse(req.body);

      // Check if invoice number already exists
      const allInvoices = await storage.getSalesInvoices();
      const existing = allInvoices.find(inv => inv.invoiceNumber === validatedData.invoiceNumber);
      if (existing) {
        return res.status(400).json({ error: "رقم الفاتورة موجود بالفعل" });
      }

      const invoice = await storage.createSalesInvoiceDraft(validatedData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error creating sales invoice:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في إنشاء الفاتورة" 
      });
    }
  });

  app.put("/api/sales-invoices/:id", async (req, res) => {
    try {
      const validatedData = insertFullSalesInvoiceSchema.parse(req.body);
      const invoice = await storage.updateSalesInvoiceDraft(req.params.id, validatedData);
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      console.error("Error updating sales invoice:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في تحديث الفاتورة" 
      });
    }
  });

  app.delete("/api/sales-invoices/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSalesInvoiceDraft(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "الفاتورة غير موجودة" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting sales invoice:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في حذف الفاتورة" 
      });
    }
  });

  app.post("/api/sales-invoices/:id/post", async (req, res) => {
    try {
      const invoice = await storage.postSalesInvoice(req.params.id);
      res.json(invoice);
    } catch (error) {
      console.error("Error posting sales invoice:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في نشر الفاتورة" 
      });
    }
  });

  // Receipt Voucher routes
  app.get("/api/receipt-vouchers", async (_req, res) => {
    try {
      const vouchers = await storage.getReceiptVouchers();
      res.json(vouchers);
    } catch (error) {
      console.error("Error fetching receipt vouchers:", error);
      res.status(500).json({ error: "فشل في جلب سندات القبض" });
    }
  });

  app.get("/api/receipt-vouchers/:id", async (req, res) => {
    try {
      const voucher = await storage.getReceiptVoucher(req.params.id);
      if (!voucher) {
        return res.status(404).json({ error: "السند غير موجود" });
      }
      res.json(voucher);
    } catch (error) {
      console.error("Error fetching receipt voucher:", error);
      res.status(500).json({ error: "فشل في جلب السند" });
    }
  });

  app.post("/api/receipt-vouchers", async (req, res) => {
    try {
      const validatedData = insertFullReceiptVoucherSchema.parse(req.body);

      // Check if voucher number already exists
      const allVouchers = await storage.getReceiptVouchers();
      const existing = allVouchers.find(v => v.voucherNumber === validatedData.voucherNumber);
      if (existing) {
        return res.status(400).json({ error: "رقم السند موجود بالفعل" });
      }

      const voucher = await storage.createReceiptVoucherDraft(validatedData);
      res.status(201).json(voucher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Error creating receipt voucher:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في إنشاء السند" 
      });
    }
  });

  app.put("/api/receipt-vouchers/:id", async (req, res) => {
    try {
      const validatedData = insertFullReceiptVoucherSchema.parse(req.body);
      const voucher = await storage.updateReceiptVoucherDraft(req.params.id, validatedData);
      res.json(voucher);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "بيانات غير صحيحة",
          details: error.errors 
        });
      }
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Error updating receipt voucher:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في تحديث السند" 
      });
    }
  });

  app.delete("/api/receipt-vouchers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReceiptVoucherDraft(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "السند غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Error deleting receipt voucher:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في حذف السند" 
      });
    }
  });

  app.post("/api/receipt-vouchers/:id/post", async (req, res) => {
    try {
      const voucher = await storage.postReceiptVoucher(req.params.id);
      res.json(voucher);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Error posting receipt voucher:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "فشل في نشر السند" 
      });
    }
  });

  // Centralized error handling middleware
  // MUST be added after all routes
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle AppError instances (ValidationError, NotFoundError, etc.)
    if (err instanceof AppError) {
      return res.status(err.status).json({ 
        error: err.message,
        code: err.code 
      });
    }

    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "بيانات غير صحيحة",
        details: err.errors 
      });
    }

    // Unknown errors - log and return 500
    console.error("Unhandled error:", err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : "حدث خطأ في الخادم" 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
