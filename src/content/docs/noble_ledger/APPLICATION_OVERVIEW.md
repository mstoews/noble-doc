---
title: Application Overview
description: What Noble Ledger is, what it does, and how it is built — an accurate map of the application as it ships today.
---

> **Last reviewed:** 2026-07-29 · against `v0.5.219-dev`
> **Stack:** Angular 21 (zoneless, standalone) · NgRx Signal Store · Go/Postgres API · PrimeNG 21 + Syncfusion · Firebase Storage

---

## 1. What Noble Ledger is

Noble Ledger is a cloud accounting and property-management platform built for
**condominium corporations** and other organisations that must account by fund
rather than by profit centre:

- **Condominium corporations** — operating and reserve funds, owner
  assessments, special levies, reserve studies, board reporting
- **Property management companies** — several corporations under one login,
  each fully isolated
- **Non-profit organisations** — restricted and unrestricted net assets
- **Small and medium businesses** needing full double-entry books

It covers the complete accounting cycle — chart of accounts, journals, payables,
receivables, banking and reconciliation, budgets, period close, year-end, and
financial reporting — with fund accounting enforced in the ledger itself rather
than bolted on as a reporting dimension.

For how the fund-accounting features work in depth, see
[Fund Accounting for Condominium Corporations](/noble_ledger/condo_fund_accounting/).

---

## 2. Architecture at a glance

Noble Ledger is **two deployed applications plus managed services**:

| Piece | What it is | Where it runs |
|---|---|---|
| `noble-web` | Angular 21 single-page application | Firebase Hosting |
| `noble-go-server` | Go REST API — the system of record | Cloud Run (`api.nobleledger.com`) |
| PostgreSQL | All accounting data | Managed Postgres behind the API |
| Firebase Storage | Uploaded documents and evidence images | Firebase |
| Firebase Firestore | A few peripheral, non-accounting features only | Firebase |

> **Correction to earlier documentation.** Previous versions of this page said
> "all backend data lives in Firebase." That is no longer true and has not been
> for some time. **The Go API over PostgreSQL is the system of record for all
> accounting data** — journals, accounts, funds, balances, owners, units,
> assessments. Firestore now backs only a handful of peripheral services
> (in-app messages, FAQ content, image indexing, saved grid layouts).

The OpenAPI specification published by `noble-go-server` is the contract
between the two. Frontend request and response types are generated from it
rather than hand-written.

### Authentication

Sign-in is handled by the Go API, not Firebase Auth. The login form takes
**tenant, email, and password** and posts to `/v1/auth/login`. The platform
supports multi-factor authentication (TOTP and email factors, recovery codes)
and named session management, so a user can see and revoke their active
sessions. Accounts are provisioned by an administrator, who sends a
set-password invitation — there is no public self-service sign-up.

A legacy Firebase Auth service remains in the tree but is not on the live
sign-in path.

### Multi-tenancy

Every corporation is a tenant. Tenancy is enforced in two places:

- **In the URL.** Authenticated routes live under a tenant segment —
  `/{tenant}/dashboards`, `/{tenant}/gl/journals`. A route guard rejects
  mismatched tenants, and legacy bare URLs are redirected into the current
  tenant, preserving path, query, and fragment.
- **In every request.** An HTTP interceptor injects the tenant into outbound
  API calls. Identity-level routes (`/v1/auth/*`) are exempt.

### HTTP pipeline

Requests pass through interceptors in this order:

`tenant` → `credentials` → `connection` → `authToken` → `forbidden` → `retry`

On boot the app probes `GET /status`. When the API is unreachable it raises a
sticky **"Server Unavailable"** toast. In local development with the Go server
stopped, this is expected rather than a defect.

### Frontend architecture

- **Angular 21**, standalone components throughout — no NgModules.
- **Zoneless change detection** with signal-based reactivity.
- **Lazy loading** on every feature route.
- **NgRx Signal Store** — roughly 37 application-level stores plus about 21
  scoped to the accounting maintenance area. Stores pair with services that
  talk to the API; components inject stores and read signals with no manual
  subscriptions.
- **Signal Forms** for new entry screens, with global validity CSS classes.
- **Fuse** vendored layout kit provides the shell (dense vertical layout);
  treat `src/app/fuse/` as framework scaffolding, not application code.
- **Transloco** for internationalisation.
- **Tailwind CSS v4**, plus a custom PrimeNG Aura-based theme with light and
  dark variants.

### UI libraries

PrimeNG 21 is the primary component library. Syncfusion EJ2 supplies the heavy
data grids, spreadsheet, scheduler, Gantt, and pivot views. Angular Material
appears in older screens. Charting uses ApexCharts. Reporting uses MESCIUS
ActiveReportsJS, with jsPDF, ExcelJS, and SheetJS behind the various export
paths.

---

## 3. Functional map

The left-hand navigation reflects the real information architecture. Routes
below are shown without their tenant prefix.

### Dashboards — *board and fund overview*

| Screen | Route |
|---|---|
| Condo Board | `/dashboards` |
| Funds Overview | `/finance` |

### General Ledger — *journals, chart and close*

| Screen | Route |
|---|---|
| Journal Entries | `/gl/journals` |
| Journal Templates | `/gl/templates` |
| Chart of Accounts | `/gl/chart-of-accounts/accounts` |
| Accounts Listing | `/reporting/accounts-listing` |
| Trial Balance by Fund | `/reporting/trial-balance-by-fund` |
| Fund Transfer | `/journals/fund-transfer` |
| Period Close | `/journals/period-close` |
| Year-End | `/journals/year-end` |

### Accounts Receivable — *customers, assessments and receipts*

| Screen | Route |
|---|---|
| AR Dashboard | `/ar/dashboard` |
| Customers | `/ar/customers` |
| Assessments | `/ar/assessments` |
| New Invoice | `/ar/invoices/new` |
| AR Aging | `/ar/aging` |
| Delinquencies | `/ar/delinquencies` |

### Accounts Payable — *vendors, bills and payments*

| Screen | Route |
|---|---|
| AP Dashboard | `/accounts-payable/dashboard` |
| Vendors | `/accounts-payable/vendors` |
| Bills | `/accounts-payable/bills` |
| AP Aging | `/accounts-payable/aging` |
| Payments | `/accounts-payable/payment` |
| Auto-post review | `/accounts-payable/auto-post-review` |

### Banking — *reconcile cash*

| Screen | Route |
|---|---|
| Bank Feed | `/journals/bank-feed` |
| Bank Reconciliation | `/journals/bank-reconciliation` |

Bank data is pulled through Plaid. The Plaid link persists the bank *item* and
balances; transactions arrive through the bank feed.

### Reports — *statements and analysis*

| Screen | Route |
|---|---|
| Balance Sheet | `/reports/balance-sheet` |
| Income Statement | `/reports/income-statement` |
| Cash Flow | `/reports/cash-flow` |
| Budget Analysis | `/budget` |
| Report Library | `/reporting` |

Balance retrieval always goes through the account-amount endpoints; reports are
never built against raw ledger tables.

### Community — *owners, units and reserve study*

| Screen | Route |
|---|---|
| Owners | `/community/condo-owners` |
| Units | `/community/condo-units` |
| Reserve Study | `/reserve-study` |

### Company — *funds, periods and team*

| Screen | Route |
|---|---|
| Funds | `/company/funds` |
| Fund Targets | `/company/fund-targets` |
| Periods | `/company/periods` |
| Team & Roles | `/company/team` |

### System — *documents, audit and settings*

| Screen | Route |
|---|---|
| Users & Roles | `/admin/users-roles` |
| Documents | `/docs` |
| Audit Trail | `/audit-trail` |
| Projects (Kanban / Gantt) | `/kanban` |
| Settings | `/settings` |

---

## 4. The accounting core

### Journals

A journal has a header (date, description, type, period, fiscal year,
reference) and detail lines. Each line carries an account, a child account, a
**fund**, and a debit or credit amount.

Two invariants are enforced **server-side**, so they hold on every path into
the ledger:

1. Total debits equal total credits.
2. Debits equal credits **within each fund** the journal touches.

The second is what makes fund accounting real rather than cosmetic — it means
every fund carries a complete, self-balancing set of books. See
[Fund Accounting for Condominium Corporations](/noble_ledger/condo_fund_accounting/).

Period and fiscal year are derived from the transaction date on the newer entry
screens rather than being maintained by hand.

### Chart of accounts

Accounts are two-level (account and child). **Accounts are not fund-scoped** —
there is no fund column on the chart of accounts. The fund lives on the journal
line. Adding a fund therefore does not multiply the chart of accounts.

### Funds

A fund carries a code, description, a restriction class (`unrestricted`,
`temporarily_restricted`, `permanently_restricted`), and an optional
`disallow_negative` flag that blocks postings which would overdraw it.

### Templates

Recurring entries are saved as templates — the same header-and-lines structure
without a date — and copied into a new journal when used.

### Period close and year-end

Period close runs a severity-ranked checklist: trial balance balanced
(blocker), bank accounts reconciled, no unmapped accounts posted, no unbooked
journals, AR aging snapshot. Year-end closes revenue and expense to equity
**per fund**, with a nominated retained-earnings target for each fund.

### Evidence

Documents and images attach to journal entries through a drag-and-drop uploader
backed by Firebase Storage, so support for an entry travels with it.

---

## 5. Beyond the ledger

- **Budgets** — budget by period, year, and account, with actual-versus-budget
  variance analysis.
- **Projects** — Kanban board, Gantt timeline, and scheduler for maintenance
  and capital work.
- **Documents** — evidence manager with gallery and lightbox.
- **Chat and messages** — team collaboration.
- **AI conversations** — assistant surface over financial data.
- **Hierarchy mapper** — maps accounts to reporting hierarchy nodes; the period
  close checks that nothing posted this period is left unmapped.
- **Audit trail** — who created, booked, and changed what.

---

## 6. Development

| Command | Purpose |
|---|---|
| `make start` | Dev server, no watch |
| `make dev` | Dev server with watch and inspector |
| `make build` | Optimised production build |
| `make deploy` | Production build and deploy to Firebase Hosting |
| `make test` | Jest suite |
| `npm run gen:api-types` | Regenerate API types from the backend OpenAPI spec |

The dev server requires Node 22. The backend deploys separately from the
`noble-go-server` repository.

Testing is **Jest** via `jest-preset-angular`. (Any reference to Karma is
stale.)

---

*This page is maintained by hand against the source. When it disagrees with the
code, the code is right — please file a correction.*
