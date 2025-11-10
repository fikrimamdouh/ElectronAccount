# RinaPro Business - نظام المحاسبة الشامل المتكامل

## Overview
RinaPro Business is an integrated ERP system designed for comprehensive business management. It features a full Arabic interface with RTL support, built using React and Shadcn UI for a modern and professional user experience. The system encompasses 23+ integrated modules covering financial accounting, inventory, sales, purchasing, POS, HR, fixed assets, projects, production, contracts, e-commerce, shipping, CRM, budgeting, quality management, maintenance, document management, loyalty programs, business intelligence, distributors, meetings, and risk management. Its primary purpose is to streamline business operations, provide financial insights, and manage various aspects of a company's workflow efficiently. The project aims to be a complete, integrated solution for businesses seeking an Arabic-first ERP system.

## User Preferences
The user prefers clear and concise communication. They appreciate an iterative development approach, where features are built out module by module. The user expects the agent to prioritize architectural decisions and high-level feature implementation before diving into granular details. They prefer to be consulted before any major architectural changes or significant deviations from the established design patterns. The user wants the agent to focus on implementing the core functionalities and ensuring seamless integration between modules, especially with the Financial Accounting module.

## System Architecture
The system is built as a monolithic ERP application with a modular design, featuring 23+ core modules plus company settings.

**Recent Development Progress (November 2025):**
- ✅ **Products Management (بطاقة الصنف)**: Complete CRUD system for inventory items with unit selection (حبة, كرتون, كيلو), sale price, and cost price tracking.
  - Full form validation using Zod schemas
  - Data table with loading/error states
  - Toast notifications for all operations
  - Real-time data updates with TanStack Query
  
- ✅ **Customer Management (إدارة بيانات العملاء)**: Fully integrated customer management with automatic chart of accounts linkage, balance tracking, and Zakat/Tax compliance (tax number field).
  - Automatic account creation in chart of accounts (code: 1120-{customer_code})
  - Opening balance support with automatic ledger integration
  - Transaction-safe operations using PostgreSQL transactions ensuring data integrity
  - Cannot delete customers with non-zero account balances (throws descriptive Arabic error)
  - Real-time balance tracking with color-coded display (green for debit, red for credit)
  - Comprehensive error handling with loading/error states and retry functionality
  
- ✅ **Sidebar Navigation**: Created "البيانات الأساسية" (Master Data) section in sidebar for shared data management
  - Customers management (إدارة بيانات العملاء) → `/master/customers`
  - Suppliers management (إدارة بيانات الموردين) → `/master/suppliers`
  - Branches (الفروع) → `/master/branches`
  - Currencies (العملات) → `/master/currencies`
  
- ✅ **UI/UX Improvements**:
  - Fixed sidebar layout using Shadcn's `SidebarInset` component to prevent content overlay
  - Proper RTL layout with sidebar on the right side
  - TypeScript errors resolved in sidebar navigation
  - All 23+ modules properly routed in App.tsx

**UI/UX Decisions:**
- **Language & Layout:** Full Arabic interface with comprehensive RTL (Right-to-Left) support.
- **Components:** Utilizes Shadcn UI for a professional, modern aesthetic, including an advanced 3-level tree-view sidebar.
- **Theming:** Supports both dark and light modes.
- **Responsiveness:** Designed to be fully responsive across all devices.
- **Typography:** Employs Cairo and Tajawal Arabic fonts.
- **Dashboard:** Interactive dashboard with financial statistics.

**Technical Implementations:**
- **Frontend:**
    - React 18 with TypeScript.
    - Wouter for routing.
    - TanStack Query for data management.
    - Tailwind CSS for styling.
    - Recharts for data visualization.
- **Backend:**
    - Express.js for the API server.
    - TypeScript for type safety.
    - Zod for data validation.
- **Database:**
    - PostgreSQL as the primary database.
    - Drizzle ORM for schema management and interactions.
    - Database migrations managed via `npm run db:push`.

**Feature Specifications:**
- **Financial Accounting:** Core module, acting as the central hub for all financial transactions, supporting double-entry bookkeeping.
- **Modular Integration:** All other modules (Inventory, Sales, Purchasing, HR, etc.) are designed to integrate with Financial Accounting by generating automatic journal entries.
- **Sidebar Structure:** A multi-level (3-tier) hierarchical sidebar built with Shadcn UI's Sidebar and Collapsible components, organizing 140+ pages across 23+ modules.
- **API Design:** RESTful API endpoints for each module, ensuring clear separation of concerns.
- **Database Transactions:** Critical operations (like customer creation with account linkage) use PostgreSQL transactions to ensure atomicity.
- **Automatic Integration:** Customer and supplier records automatically create linked chart of accounts entries for seamless financial tracking.

**System Design Choices:**
- **Monolithic Architecture:** A single codebase for both frontend and backend for simplified deployment and management, while maintaining modularity within the application structure.
- **Data Validation:** Strict data validation using Zod on the backend to ensure data integrity.
- **Error Handling:** Comprehensive error handling implemented across all API endpoints with user-friendly toast notifications and detailed error states.
- **Transaction Safety:** All critical database operations that span multiple tables use PostgreSQL transactions to prevent partial writes and maintain data consistency.
- **Responsive UI States:** Loading spinners, error messages with retry buttons, and empty states provide clear feedback to users.

## External Dependencies
- **Database:**
    - PostgreSQL (with Neon for cloud-hosted PostgreSQL capabilities).
- **Frontend Libraries:**
    - React 18
    - Wouter
    - TanStack Query
    - Shadcn UI
    - Tailwind CSS
    - Recharts
- **Backend Libraries:**
    - Express.js
    - Drizzle ORM
    - Zod
- **Fonts:**
    - Cairo
    - Tajawal