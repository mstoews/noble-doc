---
title: Noble Web 
description: Nobel Ledger - Application Overview 
---

<!-- # Noble Web — Application Overview -->

> **Last updated:** 2026-03-15
> **Stack:** Angular 18+ · NgRx Signals · Firebase · Syncfusion · Angular Material

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [1. Purpose \& Target Users](#1-purpose--target-users)
- [2. Technology Stack](#2-technology-stack)
- [3. Application Architecture](#3-application-architecture)
  - [Key Architectural Decisions](#key-architectural-decisions)
- [4. Feature Modules](#4-feature-modules)
  - [4.1 Authentication](#41-authentication)
  - [4.2 Accounting — Chart of Accounts](#42-accounting--chart-of-accounts)
  - [4.3 General Ledger (GL) Transactions](#43-general-ledger-gl-transactions)
  - [4.4 Accounts Payable (AP)](#44-accounts-payable-ap)
  - [4.5 Accounts Receivable (AR)](#45-accounts-receivable-ar)
  - [4.6 Journal Templates](#46-journal-templates)
  - [4.7 Financial Reporting](#47-financial-reporting)
  - [4.8 Budget Management](#48-budget-management)
  - [4.9 Finance Dashboard](#49-finance-dashboard)
  - [4.10 Project \& Condo Dashboard](#410-project--condo-dashboard)
  - [4.11 Kanban \& Task Management](#411-kanban--task-management)
  - [4.12 Evidence \& Document Management](#412-evidence--document-management)
  - [4.13 Chat \& Collaboration](#413-chat--collaboration)
  - [4.14 Admin Finance](#414-admin-finance)
  - [4.15 User Profile \& Settings](#415-user-profile--settings)
  - [4.16 Help Center](#416-help-center)
  - [4.17 Landing Page](#417-landing-page)
- [5. State Management](#5-state-management)
  - [Store Inventory](#store-inventory)
- [6. Services Layer](#6-services-layer)
  - [Accounting Services](#accounting-services)
  - [Reporting Services](#reporting-services)
  - [Application Services](#application-services)
  - [Utility Services](#utility-services)
- [7. Data Models](#7-data-models)
  - [Journal Entry Models](#journal-entry-models)
  - [Reference Data Models](#reference-data-models)
  - [Application Models](#application-models)
- [8. Routing Structure](#8-routing-structure)
- [9. Key User Workflows](#9-key-user-workflows)
  - [Creating a General Ledger Journal Entry](#creating-a-general-ledger-journal-entry)
  - [Using a Journal Template](#using-a-journal-template)
  - [Running a Trial Balance](#running-a-trial-balance)
  - [Setting Up a New Vendor (AP)](#setting-up-a-new-vendor-ap)
  - [Creating a Budget](#creating-a-budget)
  - [Managing Tasks on a Kanban Board](#managing-tasks-on-a-kanban-board)
- [10. Infrastructure \& Integrations](#10-infrastructure--integrations)
  - [Firebase](#firebase)
  - [Multi-Tenancy](#multi-tenancy)
  - [Plaid Integration](#plaid-integration)
  - [AI Agent](#ai-agent)
  - [Deployment](#deployment)

---

## 1. Purpose & Target Users

**Noble** is a cloud-based enterprise accounting and property management platform. It is purpose-built for:

- **Condominium associations** managing common-area finances
- **Property management companies** overseeing multiple properties
- **Small-to-medium businesses** requiring full double-entry bookkeeping
- **Non-profit organisations** tracking fund-based accounting

The application provides a complete accounting cycle — from chart of accounts setup through journal entry, financial reporting, and audit evidence — alongside project/task management and team collaboration tools.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Angular 18+ (standalone components, zoneless) |
| State Management | NgRx Signals (signal-based stores) |
| UI — Data Grids | Syncfusion EJ2 Grid |
| UI — Components | Angular Material + PrimeNG |
| UI — Reports | MESCIUS ActiveReports |
| Charts | ApexCharts (ng-apexcharts) |
| Backend / Auth | Firebase Auth |
| Database | Firebase Firestore (real-time) |
| File Storage | Firebase Storage |
| Bank Integration | Plaid API |
| Styling | Tailwind CSS |
| Build | Vite + Angular CLI |
| Containerisation | Docker + Nginx |

---

## 3. Application Architecture

```
src/app/
├── app.component.ts          # Root component — layout shell
├── app.config.ts             # Bootstrap: providers, interceptors, router
├── app.routing.ts            # Top-level lazy-loaded routes
│
├── features/                 # 21 feature modules (lazy-loaded)
│   ├── accounting/           # GL, AP, AR, templates, static setup
│   ├── reporting/            # Financial reports
│   ├── budget/               # Budget creation and tracking
│   ├── finance/              # Finance dashboard
│   ├── dashboard/            # Condo/project dashboard
│   ├── kanban/               # Task boards and Gantt
│   ├── evidence-manager/     # Document/file management
│   ├── chat/                 # Real-time messaging
│   ├── admin/                # Admin finance panels
│   ├── auth/                 # Sign-in, sign-up, password flows
│   ├── user/                 # User profile
│   ├── pages/                # Settings, activities, invoices
│   ├── help-center/          # FAQs and guides
│   └── landing/              # Public landing page
│
├── store/                    # 25 NgRx Signal stores
├── services/                 # 45+ injectable services
├── models/                   # TypeScript interfaces and types
├── shared/                   # Guards, interceptors, shared components
├── fuse/                     # Layout framework (Fuse template)
└── utils/                    # Pure utility functions
```

### Key Architectural Decisions

- **Standalone components** — no NgModules; every component, directive, and pipe is self-contained.
- **Lazy loading** — every feature route is lazy-loaded via `loadComponent` / `loadChildren`, keeping the initial bundle small.
- **Zoneless change detection** — uses Angular's experimental zoneless mode with signal-based reactivity.
- **Multi-tenant** — an HTTP interceptor attaches a tenant identifier to every API request, isolating data per organisation.
- **Auth interceptor** — a separate interceptor attaches Firebase ID tokens to outbound requests automatically.

---

## 4. Feature Modules

### 4.1 Authentication

**Path:** `src/app/features/auth/`

Handles all user identity flows powered by Firebase Auth.

| Component | Purpose |
|---|---|
| `sign-in` | Email/password login form |
| `sign-up` | New account registration |
| `forgot-password` | Password reset request |
| `reset-password` | Reset via emailed link |
| `unlock-session` | Re-authenticate locked session |
| `sign-out` | Logout and clear session |
| `confirmation-required` | Email verification gate |

Guards in `src/app/shared/` protect all authenticated routes and redirect unauthenticated users to sign-in.

---

### 4.2 Accounting — Chart of Accounts

**Path:** `src/app/features/accounting/static/`

The GL main panel (`gl.main.component.ts`) is a drawer-navigated hub for all reference/setup data. Sections are accessible from a persistent left-hand drawer:

| Section | Route segment | Purpose |
|---|---|---|
| GL Accounts | `accts/` | Create and maintain the chart of accounts |
| Account Types | `gl_account_type/` | High-level account classification (Asset, Liability, etc.) |
| Subtypes | `subtype/` | Detailed sub-classification within types |
| Funds | `funds/` | Fund / cost-centre definitions |
| Parties | `party/` | Vendor and customer master records |
| Periods | `periods/` | Fiscal period definitions |
| Teams | `team/` | Internal team records |
| Roles | `roles/` | Permission roles assigned to users |
| Settings | `settings/` | Organisation-wide accounting settings |
| AP Vendors | `ap-vendors/` | Accounts payable vendor list |

All grids use Syncfusion EJ2 Grid with inline editing, sorting, filtering, and Excel export.

---

### 4.3 General Ledger (GL) Transactions

**Path:** `src/app/features/accounting/transactions/general-ledger/`

The core double-entry journal entry system.

| Component | Purpose |
|---|---|
| `gl-create.ts` | Create a new GL journal entry |
| `gl-edit.ts` | Edit an existing GL journal entry |
| `journal-create-details.ts` | Manage line items (debits/credits) within a journal |
| `transaction-evidence.ts` | Attach supporting documents to a journal entry |

**How a GL journal entry works:**
1. User creates a header (date, description, journal type, period, year, reference).
2. User adds detail lines — each line has: GL account, fund, subtype, debit or credit amount, and a narrative.
3. The system validates that total debits = total credits before allowing save.
4. Evidence files (images, PDFs) can be attached per entry.
5. Posted entries update the trial balance and financial reports in real time.

---

### 4.4 Accounts Payable (AP)

**Path:** `src/app/features/accounting/transactions/accounts-payable/`

Manages vendor invoices and payments.

| Component | Purpose |
|---|---|
| `ap-update.component.ts` | Create / edit AP journal entries linked to a vendor |
| AP vendor list (static) | Vendor master maintenance |

AP entries are journal entries that carry an additional vendor (party) reference. They feed into the AP aging reports and vendor payment tracking.

---

### 4.5 Accounts Receivable (AR)

**Path:** `src/app/features/accounting/transactions/accounts-receivable/`

Mirrors AP but for customer-facing receivable transactions. AR journal entries carry a customer party reference and are tracked for collections and ageing.

---

### 4.6 Journal Templates

**Path:** `src/app/features/accounting/transactions/template/`

Templates allow recurring journal entries (e.g. monthly depreciation, rent invoices) to be defined once and reused.

| Component | Purpose |
|---|---|
| `template-list.ts` | Browse all saved templates |
| `template-detail.ts` | View a template's header and line items |
| `template-update.ts` | Create or edit a template |

A template stores the same structure as a journal entry (header + detail lines) but without a date. When a user creates a journal from a template, the template lines are copied into a new journal entry ready for posting.

Routes are defined in `journal.template.routes.ts` with a resolver (`journal.template.resolver.ts`) that pre-fetches template data before the component loads.

---

### 4.7 Financial Reporting

**Path:** `src/app/features/reporting/`

A reporting hub accessible from a persistent left-hand drawer panel (`reporting-panel.component.ts`).

| Report | Component | Description |
|---|---|---|
| Trial Balance | `trial-balance.component` | Period-end account balances vs. debits/credits |
| Balance Sheet | `balance-sheet` | Assets, liabilities, equity (via MESCIUS ActiveReports) |
| Income Statement | `income-statement-rpt.component` | Revenue vs. expenses for a period |
| Expense Report | `expense-rpt.component` | Detailed expense breakdown |
| Distributed TB | `distributed-tb.component` | Trial balance spread across multiple periods |
| TB Pivot | `tb-pivot.component` | Pivot-table view of trial balance data |
| Distribution Comparison | `dist-list-comparison` | Compare distributions across periods |
| Transaction Analysis | (analysis component) | Deep-dive into transaction-level data |
| Grid Reports | `reporting-grid` | Customisable Syncfusion grid-based reports |

Reports are generated from live Firestore data via `reports.service.ts` and `financial-service.service.ts`. Users can filter by period, year, fund, and account range.

---

### 4.8 Budget Management

**Path:** `src/app/features/budget/`

| Component | Purpose |
|---|---|
| `budget-landing` | Overview — list of budgets and summary cards |
| `budget-main.ts` | Budget header and detail entry (Syncfusion grid) |
| `expense` | Actual vs. budget variance tracking |
| `update` | Edit existing budget lines |

Budgets are defined per period/year and account. The expense view compares posted GL amounts against budget figures, showing variances in both absolute and percentage terms.

---

### 4.9 Finance Dashboard

**Path:** `src/app/features/finance/`

A summary dashboard targeted at finance staff and board members.

- Account balance charts (ApexCharts)
- Recent transaction list
- Key financial KPI cards
- Quick-access links to common accounting tasks

---

### 4.10 Project & Condo Dashboard

**Path:** `src/app/features/dashboard/`

| Component | Purpose |
|---|---|
| `condo.dashboard.ts` | Primary project/property dashboard with charts and summaries |
| `project.component.ts` | Per-project detail view |
| `dashboard-chart.ts` | Reusable chart components |

The dashboard surfaces property-level data including financial summaries, open tasks, recent activity, and project status — designed for board members and property managers.

---

### 4.11 Kanban & Task Management

**Path:** `src/app/features/kanban/`

| Component | Purpose |
|---|---|
| `kanban-panel.component.ts` | Main entry point with board/Gantt toggle |
| `kanban.board.component.ts` | Drag-and-drop task board |
| `task.component.ts` | Individual task card |
| `kanban.task.form.ts` | Task create/edit form |

Tasks have: title, description, status, priority, assignee, start/due dates, dependencies, and attached files. The Gantt view shows tasks on a timeline with dependency arrows. Used for tracking maintenance, renovation projects, and administrative tasks within the property.

---

### 4.12 Evidence & Document Management

**Path:** `src/app/features/evidence-manager/`

Cloud-based document store backed by Firebase Storage.

- Upload files (drag-and-drop via `drag-n-drop/` feature)
- Associate files with journal entries as supporting evidence
- Image gallery with lightbox viewer (`lightbox/` feature)
- Image batch operations and indexing
- Supports PDFs, images, spreadsheets

---

### 4.13 Chat & Collaboration

**Path:** `src/app/features/chat/`

Real-time team messaging using Firestore as the message store.

- Threaded conversations
- Per-team and per-project channels
- Message history with timestamps
- Integrated with task/kanban system for task-level discussions

---

### 4.14 Admin Finance

**Path:** `src/app/features/admin/finance/`

Administrative-level finance views including:

- Sales graphs and revenue analytics
- Reconciliation management (reconciliation boards using Kanban pattern)
- Admin configuration wizards
- Image/attachment administration

---

### 4.15 User Profile & Settings

**Path:** `src/app/features/user/` and `src/app/features/pages/`

- User profile editing (name, avatar, contact details)
- Password change
- Application settings (multi-tab: general, notifications, security)
- Activity history
- Invoice history
- Pricing / plan information

---

### 4.16 Help Center

**Path:** `src/app/features/help-center/`

In-app help documentation:

- FAQ accordion lists
- User guides and how-to articles
- Support contact information

---

### 4.17 Landing Page

**Path:** `src/app/features/landing/`

The public-facing entry point for unauthenticated users. Describes the Noble platform's features and pricing, with call-to-action links to sign-in and sign-up.

---

## 5. State Management

Noble uses **NgRx Signal Stores** — a modern, signal-based alternative to traditional Redux-style stores. Each store is a class decorated with `signalStore()` that exposes computed signals and updater methods.

### Store Inventory

| Store | File | Responsibility |
|---|---|---|
| Application Store | `application.store.ts` | Current period/year, user profile, panel loading |
| Main Panel Store | `main.panel.store.ts` | Navigation state, TB parameters, start/end dates |
| Journal Store | `journal.store.ts` | Active journal header, detail lines, journal lists |
| Template Store | `template.store.ts` | Template header/details, dropdown data |
| Accounts Store | `accounts.store.ts` | GL account list and dropdown references |
| Auth Store | `auth.store.ts` | Authenticated user identity |
| Period Store | `period.store.ts` | Accounting period list |
| Date Store | `date.store.ts` | Selected date range |
| Budget Store | `budget.store.ts` | Budget data and variance tracking |
| Evidence Store | `evidence.store.ts` | Attached documents per journal |
| Funds Store | `funds.store.ts` | Fund/cost-centre references |
| GL Type Store | `gltype.store.ts` | Account type lookup |
| Party Store | `party.store.ts` | Vendor/customer references |
| Payments Store | `payments.store.ts` | AP payment records |
| Reconciliation Store | `reconciliation.store.ts` | Reconciliation state |
| Reports Store | `reports.store.ts` | Report data and filters |
| AP Vendor Store | `ap-vendor.store.ts` | Accounts payable vendor data |

Components inject stores directly and react to signal changes with no explicit subscriptions required.

---

## 6. Services Layer

Services are Angular injectables (`providedIn: 'root'`) responsible for all data access and business logic.

### Accounting Services

| Service | Responsibility |
|---|---|
| `journal.service.ts` | Full CRUD for GL journal entries, trial balance fetch |
| `accounts.service.ts` | GL account CRUD |
| `template.service.ts` | Journal template management |
| `journal-template.service.ts` | Template detail lines |
| `periods.service.ts` | Accounting period management |
| `party.service.ts` | Vendor/customer master data |
| `funds.service.ts` | Fund / cost-centre data |
| `subtype.service.ts` | Transaction subtype lookup |
| `type.service.ts` | Transaction type lookup |
| `roles.service.ts` | User role data |
| `team.service.ts` | Team data |

### Reporting Services

| Service | Responsibility |
|---|---|
| `reports.service.ts` | Generate and fetch report data |
| `distribution.ledger.service.ts` | Distributed trial balance logic |
| `financial-service.service.ts` | Financial calculations and aggregations |

### Application Services

| Service | Responsibility |
|---|---|
| `auth.service.ts` | Firebase Auth integration (sign-in, sign-out, token refresh) |
| `application.service.ts` | App initialisation — loads initial data on startup |
| `ai-agent.service.ts` | AI assistant integration |
| `plaid.service.ts` | Bank account data via Plaid API |
| `local-storage.service.ts` | Persistent client-side key-value storage |
| `grid.settings.service.ts` | Syncfusion grid column configuration per user |

### Utility Services

| Service | Responsibility |
|---|---|
| `excel.service.ts` | Export grid data to Excel |
| `image-list.service.ts` | Image collection management |
| `chat.service.ts` | Firestore-backed chat messages |
| `message.service.ts` | In-app toastr/snackbar notifications |
| `faq.service.ts` | Help centre content retrieval |
| `file-manager.service.ts` | Firebase Storage file operations |

---

## 7. Data Models

All interfaces are in `src/app/models/`.

### Journal Entry Models

```typescript
IJournalHeader {
  id: string
  date: Timestamp
  description: string
  journalType: string       // 'GL' | 'AP' | 'AR'
  status: string            // 'draft' | 'posted'
  period: number
  year: number
  reference: string
  totalDebit: number
  totalCredit: number
  tenantId: string
}

IDetail {
  id: string
  headerId: string
  accountId: string
  fundId: string
  subtypeId: string
  debit: number
  credit: number
  narrative: string
}

IJournalTemplate {
  id: string
  name: string
  description: string
  details: IJournalDetailTemplate[]
}
```

### Reference Data Models

```typescript
IAccounts {
  id: string
  accountNumber: string
  accountName: string
  accountTypeId: string
  subtypeId: string
  isActive: boolean
}

IFunds {
  id: string
  fundCode: string
  fundName: string
}

IParty {
  id: string
  partyName: string
  partyType: string   // 'vendor' | 'customer'
  email: string
  address: string
}

IPeriod {
  id: string
  periodNumber: number
  year: number
  startDate: Timestamp
  endDate: Timestamp
  isClosed: boolean
}
```

### Application Models

```typescript
ProfileModel {
  uid: string
  displayName: string
  email: string
  photoURL: string
  tenantId: string
  role: string
}

ITasks {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assigneeId: string
  startDate: Timestamp
  dueDate: Timestamp
  boardId: string
}
```

---

## 8. Routing Structure

```
/                         → Landing page (public)
/sign-in                  → Authentication
/sign-up                  → Registration
/app/                     → Authenticated shell (layout)
  dashboard/              → Condo/project dashboard
  finance/                → Finance summary dashboard
  accounting/
    gl/                   → GL transaction list
    gl/create             → New GL journal
    gl/edit/:id           → Edit GL journal
    templates/            → Template list
    templates/detail/:id  → Template detail
    templates/update/:id  → Edit template
    ap/                   → Accounts payable journals
    ar/                   → Accounts receivable journals
    setup/                → Chart of accounts panel (drawer nav)
      accts/
      gl_account_type/
      subtype/
      funds/
      party/
      periods/
      team/
      roles/
      settings/
      ap-vendors/
  reporting/              → Reporting hub (drawer nav)
    trial-balance/
    balance-sheet/
    income-statement/
    expense-report/
    distributed-tb/
    tb-pivot/
  budget/                 → Budget management
  kanban/                 → Task boards
  evidence/               → Document management
  chat/                   → Messaging
  admin/finance/          → Admin finance panel
  pages/settings          → App settings
  user/profile            → User profile
  help-center/            → FAQ and guides
```

---

## 9. Key User Workflows

### Creating a General Ledger Journal Entry

1. Navigate to **Accounting → General Ledger → Create**
2. Fill in the journal header: date, period, year, description, journal type
3. Add detail lines: select GL account, fund, subtype; enter debit or credit amount
4. Confirm debit total equals credit total (system validates)
5. Optionally attach evidence documents
6. Save as draft or post immediately

### Using a Journal Template

1. Navigate to **Accounting → Templates**
2. Select an existing template or create a new one
3. Template stores a set of pre-configured detail lines
4. When creating a new journal, choose "From Template" to auto-populate lines
5. Adjust amounts or accounts as needed and post

### Running a Trial Balance

1. Navigate to **Reporting → Trial Balance**
2. Select period and year
3. Optionally filter by fund or account range
4. Report displays opening balance, period debits/credits, and closing balance per account
5. Export to Excel if required

### Setting Up a New Vendor (AP)

1. Navigate to **Accounting → Setup → AP Vendors**
2. Add vendor name, address, contact details, and default account
3. Vendor is now available in AP journal entry dropdowns

### Creating a Budget

1. Navigate to **Budget → Create**
2. Select year and period range
3. Enter budgeted amounts per GL account
4. Save budget
5. View variance in **Budget → Expense** comparing actuals vs. budget

### Managing Tasks on a Kanban Board

1. Navigate to **Kanban**
2. Create a board or select an existing one
3. Add task cards with title, priority, assignee, and due date
4. Drag cards between status columns (To Do → In Progress → Done)
5. Switch to Gantt view for timeline/dependency visualisation

---

## 10. Infrastructure & Integrations

### Firebase

All backend data lives in Firebase:

| Service | Used For |
|---|---|
| Firebase Auth | User authentication and session management |
| Firestore | All application data (journals, accounts, tasks, chat) |
| Firebase Storage | File uploads (evidence documents, images) |
| Firebase Hosting | Static asset serving (production) |

Firestore security rules (`firestore.rules`) enforce tenant isolation and role-based read/write access.

### Multi-Tenancy

- Every Firestore document includes a `tenantId` field
- An HTTP interceptor reads the tenant from the user's profile and appends it to every outbound request
- Queries always filter by `tenantId` ensuring complete data isolation between organisations

### Plaid Integration

Plaid is integrated via `plaid.service.ts` to pull bank account balances and transaction data for reconciliation workflows.

### AI Agent

`ai-agent.service.ts` exposes an AI assistant capability — likely used for natural-language queries over financial data or automated journal suggestions.

### Deployment

| File | Purpose |
|---|---|
| `Dockerfile` | Containerise the Angular app with Nginx |
| `nginx.conf` | Serve the SPA with proper HTML5 history routing |
| `docker-compose.yaml` | Local multi-service development setup |
| `firebase.json` | Firebase Hosting, Firestore, and Storage configuration |
| `Makefile` | Common build/deploy commands |

---

*Generated from source code analysis — 2026-03-15*
