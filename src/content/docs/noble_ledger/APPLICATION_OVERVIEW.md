---
title: Application Overview
description: A complete, verified map of the Noble Ledger application — what it does, how it is built, every screen and route, the permission model, and how it is developed and deployed.
---

> **Last reviewed:** 2026-07-29 · against `v0.5.219-dev` (`57b708ea`)
> **Stack:** Angular 21 (zoneless, standalone) · NgRx Signal Store · Go/PostgreSQL API · PrimeNG 21 + Syncfusion EJ2 · ActiveReportsJS · Firebase Storage

This page is written against the source. Where it disagrees with the code, the
code is right.

---

## 1. What Noble Ledger is

Noble Ledger is a cloud accounting and property-management platform built for
**condominium corporations** and other organisations that must account by fund
rather than by profit centre:

- **Condominium corporations** — operating and reserve funds, owner
  assessments, special levies, reserve studies, delinquency tracking, board
  reporting
- **Property management companies** — many corporations under one login, each
  tenant fully isolated
- **Non-profit organisations** — restricted and unrestricted net assets
- **Small and medium businesses** needing full double-entry books

It covers the complete accounting cycle — chart of accounts, journals, payables,
receivables, banking and reconciliation, budgets, period close, year-end, and
financial reporting — plus the property-management surfaces a condo corporation
actually needs: an owner and unit register, assessment billing, a reserve study,
document evidence, and project tracking.

The distinguishing feature is that **fund accounting is enforced in the ledger
itself**, not layered on as a reporting dimension. See
[Fund Accounting for Condominium Corporations](/noble_ledger/condo_fund_accounting/).

---

## 2. System shape

Noble Ledger is **two deployed applications plus managed services**:

| Piece | What it is | Where it runs |
|---|---|---|
| `noble-web` | Angular 21 single-page application | Firebase Hosting |
| `noble-go-server` | Go REST API — the system of record | Cloud Run (`api.nobleledger.com`) |
| PostgreSQL | All accounting data | Managed Postgres behind the API |
| Firebase Storage | Uploaded documents and evidence images | Firebase |
| Firebase Firestore | A few peripheral, non-accounting features only | Firebase |

> **Correction to earlier documentation.** Previous versions of this page said
> "all backend data lives in Firebase" and described the app as Angular 18.
> Neither is true. **The Go API over PostgreSQL is the system of record** for
> every accounting entity — journals, accounts, funds, balances, periods,
> owners, units, assessments, vendors, customers. Roughly 49 frontend files
> talk to it. Firestore now backs only four peripheral services (in-app
> messages, FAQ content, image indexing, saved grid layouts).

The OpenAPI specification published by `noble-go-server` is the contract
between the two. Frontend request and response types are **generated** from it
(`npm run gen:api-types` → `src/app/models/api/openapi.d.ts`) rather than
hand-written, so a backend shape change surfaces as a TypeScript error.

---

## 3. Identity, tenancy and permissions

### Authentication

Sign-in is handled by the Go API, **not** Firebase Auth. The login form takes
**tenant, email, and password** and posts to `/v1/auth/login`.

The platform supports:

- **Multi-factor authentication** — TOTP and email factors, enrolment and
  confirmation flows, and regenerable recovery codes (`/v1/auth/mfa/*`)
- **Session management** — users can list and revoke their active sessions
- **Token refresh** and explicit logout

Accounts are provisioned by an administrator, who sends a set-password
invitation; the `/set-password` route serves that link. **There is no public
self-service sign-up.** A legacy Firebase Auth service remains in the tree but
is not on the live sign-in path.

### Multi-tenancy

Every corporation is a tenant, and tenancy is enforced in two independent
places:

- **In the URL.** Authenticated routes live under a tenant segment — the whole
  feature surface sits inside a `/:c` shell, so real URLs read
  `/{tenant}/dashboards`, `/{tenant}/gl/journals`. A `tenantParamGuard`
  rejects mismatched tenants. Legacy bare URLs (`/gl/journals/123`) are
  redirected into the current tenant with path, query, and fragment preserved.
- **In every request.** `tenantInterceptor` injects tenant context into
  outbound API calls. Identity-level routes (`/v1/auth/*`) are exempt, and
  sign-out and unlock-session deliberately sit outside the tenant shell so they
  work without a `:c`.

### Permissions

Authorisation is a **capability model**, not a role check. `CapabilitiesStore`
holds the resolved permissions and tenant feature flags for the active user,
hydrated after sign-in.

The rule the codebase enforces on itself: **never gate on a role label — gate
on the resolved permission boolean.** The server sends every known key with a
resolved boolean, so the frontend never guesses. Server-side role-matrix
changes then propagate with no frontend change.

Current permission keys:

| Area | Keys |
|---|---|
| Journals | `journal.book`, `journal.delete`, `journal.clone` |
| Period | `period.close`, `period.reopen` |
| Year-end | `year_end.close`, `year_end.reopen`, `year_end.restate` |
| Master data | `vendor.update_status`, `customer.update_status` |
| Banking | `banking.reconcile`, `banking.unlink_item`, `plaid.create` |
| Team | `team.assign_role` |

Route guards: `isAuthenticatedGuard` (the shell), `tenantParamGuard` (tenant
match), and `isAdminGuard` — which gates admin surfaces on `team.assign_role`
rather than on the word "admin", and bounces non-admins to the tenant dashboard
instead of rendering an empty page.

### HTTP pipeline

Six interceptors, composed in this order:

`tenant` → `credentials` → `connection` → `authToken` → `forbidden` → `retry`

On boot the app probes `GET /status` and raises a sticky **"Server
Unavailable"** toast when the API is unreachable. In local development with the
Go server stopped, that toast is expected, not a defect.

---

## 4. Frontend architecture

- **Angular 21**, standalone components throughout — no NgModules.
- **Zoneless change detection** (`provideZonelessChangeDetection`) with
  signal-based reactivity.
- **Lazy loading** on every feature route, with a custom **idle-time
  preloading** strategy. This deliberately replaced `PreloadAllModules`, which
  used to pull every heavy chunk (Syncfusion, ActiveReportsJS) exactly when the
  landing dashboard's API calls needed the bandwidth.
- **Router configuration** worth knowing: view transitions, scroll-position
  restoration, component input binding, and
  `paramsInheritanceStrategy: "always"` — the last is what lets descendant
  pages read the tenant `:c` from their own `paramMap` instead of walking up
  to the shell route.
- **NgRx Signal Store** — about **37** application-level stores in
  `src/app/store/` plus **21** scoped to the accounting maintenance area. Each
  store pairs with a service that talks to the API. Components inject stores
  and read signals; there are no manual subscriptions.
- **Signal Forms** on newer entry screens, with global CSS classes (`invalid`,
  `touched`, `marked-invalid`) bound to control state.
- **Fuse** — a vendored layout kit providing the app shell (dense vertical
  layout). Treat `src/app/fuse/` as framework scaffolding, not application code.
- **Transloco** for internationalisation.
- **Tailwind CSS v4**, plus a custom PrimeNG theme extending Aura with light
  and dark variants, defined centrally in `app.config.ts`.

### UI libraries

PrimeNG 21 is the primary component library. **Syncfusion EJ2** supplies the
heavy data grids, spreadsheet, scheduler, Gantt, and pivot views. Angular
Material appears in older screens. Charts use ApexCharts. Reporting uses
**MESCIUS ActiveReportsJS**, with jsPDF, ExcelJS, and SheetJS behind the export
paths.

ActiveReportsJS ships global stylesheets that clash with Tailwind, so they are
deliberately **not** registered globally — only components that host a report
viewer import them, paired with `ViewEncapsulation.None`.

---

## 5. Feature map

Twenty feature areas live under `src/app/features/`. Routes below are shown
without their tenant prefix.

### Dashboards

| Screen | Route |
|---|---|
| Condo Board | `/dashboards` |
| Funds Overview | `/finance` |
| My Dashboards | `/my-dashboards` |

### General Ledger

| Screen | Route |
|---|---|
| Journal Entries | `/gl/journals` |
| New / edit journal | `/gl/journals/new`, `/gl/journals/:id` |
| Journal Templates | `/gl/templates` |
| Chart of Accounts | `/gl/chart-of-accounts/accounts` |
| Account Types / Subtypes | `/gl/chart-of-accounts/types`, `/subtypes` |
| Account Ledger (drill-down) | `/gl/account/:account/ledger` |
| Trial Balance | `/gl/trial-balance` |
| Balance Sheet | `/gl/balance-sheet` |
| Fund Transfer | `/journals/fund-transfer`, `/journals/fund-transfer/:id` |
| Period Close | `/journals/period-close` |
| Year-End | `/journals/year-end` |

### Accounts Receivable

| Screen | Route |
|---|---|
| AR Dashboard | `/ar/dashboard` |
| Customers | `/ar/customers`, `/ar/customers/:id` |
| Assessments (recurring + special tabs) | `/ar/assessments` |
| Special assessments | `/ar/special-assessments`, `/new`, `/:id` |
| New Invoice | `/ar/invoices/new` |
| AR Aging | `/ar/aging` |
| Delinquencies | `/ar/delinquencies` |
| Receipt sign-off queue | `/ar/signoff` |
| Owner statement | `/ar/residents/:identityKey/statement` |
| Record receipt | `/ar/residents/:identityKey/receipts/new` |

### Accounts Payable

| Screen | Route |
|---|---|
| AP Dashboard | `/accounts-payable/dashboard` |
| Vendors | `/accounts-payable/vendors`, `/vendors/:id` |
| Bills | `/accounts-payable/bills`, `/bill-entry`, `/bill/:id`, `/bill/:id/edit` |
| AP Aging | `/accounts-payable/aging` |
| Payments | `/accounts-payable/payment`, `/payments`, `/payments/:transactionId/edit` |
| Auto-post review | `/accounts-payable/auto-post-review` |

### Banking

| Screen | Route |
|---|---|
| Bank Feed | `/journals/bank-feed` |
| Bank Reconciliation | `/journals/bank-reconciliation` |

Bank data arrives through **Plaid**. Linking persists the Plaid *item* and
balances; transactions flow into the bank feed. Minting a link token is gated
on `plaid.create`.

### Reports

Two report surfaces coexist:

**Statement pages** (`/reports/*`) — Balance Sheet (optionally as-of a date),
Income Statement, Cash Flow.

**Report library** (`/reporting/*`) — 22 ActiveReportsJS reports:

Condo Board · Balance Sheet Report · Balance Sheet Statement · Statement of
Operations · Cash Flow Statement · Accounts Listing · Trial Balance by Period ·
**Trial Balance by Fund** · Distribution Ledger · Distribution Report · AP
Vendors Listing · AR Customers Listing · AR Aging · AP Aging · AR Summary by
Customer · AP Summary by Vendor · Payments Listing · Receipts Listing · Change
of Position · Budget Analysis Dashboard

All GL balance retrieval goes through the account-amount endpoints; reports are
never built against raw ledger tables.

### Community

| Screen | Route |
|---|---|
| Owners | `/community/condo-owners` |
| Units | `/community/condo-units` |
| Reserve Study | `/reserve-study` |

### Company

| Screen | Route |
|---|---|
| Funds | `/company/funds` |
| Fund Targets | `/company/fund-targets` |
| Periods | `/company/periods` |
| Team | `/company/team` |
| Roles | `/company/roles` |

### Budget

| Screen | Route |
|---|---|
| Budget dashboard | `/budget/dashboard` |
| Budget entry | `/budget/update` |
| Forecast | `/budget/forecast` |
| Variance analysis | `/budget/analysis` |

### Projects (Kanban)

| Screen | Route |
|---|---|
| Board | `/kanban/board` |
| Projects | `/kanban/projects` |
| Team | `/kanban/team` |
| Schedule | `/kanban/schedule` |
| Gantt | `/kanban/gantt` |

### System and other

| Screen | Route |
|---|---|
| Users & Roles (admin-gated) | `/admin` |
| Documents / evidence manager | `/docs` |
| Audit Trail | `/audit-trail` |
| Hierarchy mapping | `/hierarchy-mapping`, `/flow-canvas` |
| Analysis | `/analysis` |
| Analytics (admin finance) | `/analytics` |
| AI conversations | `/ai-conversations` |
| Chat | `/chat` |
| Settings | `/settings` |

---

## 6. The accounting core

### Journals

A journal has a header (date, description, type, period, fiscal year,
reference, booked state) and detail lines. Each line carries an account, a
child account, a **fund**, and a debit or credit amount.

Two invariants are enforced **server-side**, so they hold on every path into
the ledger — UI, import, or direct API call:

1. Total debits equal total credits.
2. Debits equal credits **within each fund** the journal touches.

The second is what makes the fund accounting real rather than cosmetic: every
fund carries a complete, self-balancing set of books.

Period and fiscal year are derived from the transaction date on newer entry
screens rather than being maintained by hand. Booking a journal is gated on
`journal.book`.

### Chart of accounts

Accounts are two-level (account and child). **Accounts are not fund-scoped** —
there is no fund column on the chart of accounts. The fund lives on the journal
line, so adding a fund does not multiply the chart of accounts.

### Funds

A fund carries a code, description, a restriction class (`unrestricted`,
`temporarily_restricted`, `permanently_restricted`), and an optional
`disallow_negative` flag that blocks postings which would overdraw it.

### Templates

Recurring entries are saved as templates — the same header-and-lines structure
without a date — and copied into a new journal when used.

### Period close and year-end

Period close runs a severity-ranked checklist:

| Check | Severity |
|---|---|
| Trial balance is balanced (all funds, ±$0.005) | Blocker |
| All bank accounts reconciled | Error |
| No unmapped accounts received postings | Error |
| No open or draft journals in period | Warning |
| AR aging snapshot | Advisory |

Year-end closes revenue and expense to equity **per fund**, with a nominated
retained-earnings target for each fund. Close, reopen, and restate are each
separately permissioned.

### Evidence

Documents and images attach to journal entries through a drag-and-drop uploader
backed by Firebase Storage, so the support for an entry travels with it.

---

## 7. Development

| Command | Purpose |
|---|---|
| `make start` | Dev server, no watch |
| `make dev` | Dev server with watch and `--inspect` |
| `make prod` | Serve against the production configuration |
| `make build` | Optimised production build |
| `make deploy` | Production build + `firebase deploy --only hosting` |
| `make functions` | Deploy Firebase functions |
| `make test` | Jest suite |
| `npm run gen:api-types` | Regenerate API types from the backend OpenAPI spec |

**Node 22 is required** for the dev server. The default dev port is 43221.

**Testing is Jest** via `jest-preset-angular` — a single `parent` project over
`src/**/*.spec.ts`, currently around **200 spec files**. Run one file with
`npx jest path/to/file.spec.ts`, or one case with `npx jest -t "name"`. Any
reference to Karma is stale.

Typecheck with `npx tsc -p tsconfig.app.json --noEmit` before declaring a
TypeScript task complete.

The backend deploys separately from the `noble-go-server` repository; the
public API is the Cloud Run service `noble-server` in `us-central1`.

---

## 8. Repository orientation

```
src/app/
├── app.config.ts        # composition root — providers, interceptors, theme
├── app.routing.ts       # tenant shell + lazy feature routes
├── features/            # 20 lazy-loaded feature areas
│   └── accounting/
│       ├── maintenance/ # gl, ap, ar, banking, period-close, year-end, audit
│       ├── transactions/# journals, fund transfer, bank rec, templates
│       └── static/      # reference data: funds, periods, units, owners, team
├── store/               # 37 signal stores
├── services/            # 51 injectable services
├── models/              # domain types + generated api/openapi.d.ts
├── shared/              # guards, shared components, utilities
└── fuse/                # vendored layout kit (framework scaffolding)
```

Path aliases (`app/*`, `@fuse`, `environments/*`) are preferred over deep
relative imports, though existing code mixes both.

---

*Maintained by hand against the source. Corrections welcome.*
