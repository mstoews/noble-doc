---
title: Maintain a fund budget
description: Edit monthly budget amounts and understand when changes are saved.
sidebar:
  order: 1
---

Open **Reports → Budget Analysis → Maintenance**. Confirm the company, current fiscal year, and approved assumptions, then select the intended **Fund**.

[![Budget Maintenance with fund selection, generation and spreading controls, and monthly amounts.](/images/workflows/budget-maintenance.png)](/images/workflows/budget-maintenance.png)

*The local application's Maintenance screen. Example amounts illustrate the layout.*

## Edit monthly amounts

1. Find the account using the grid's search field.
2. Edit the required **Budget 1** through **Budget 12** cells. Scroll horizontally for later columns.
3. Check the account, fund, and monthly distribution.
4. Choose the grid's **Update** action to commit the edits, or **Cancel** to discard pending grid edits.
5. Allow the refresh to complete, then reopen the fund and confirm the amounts persisted. Check any returned error before retrying.

## Generate a budget

**Growth %** adjusts prior-year actuals. **Blend (1=actuals, 0=prior budget)** sets the weighting: 1 uses adjusted prior-year actuals, 0 uses the existing budget, and values between them blend the two. The control's “prior budget” input is the budget currently loaded for the account.

For example, 5% growth and a blend of 1 turn a prior-year monthly actual of 100 into 105. Missing historical amounts need review before generation.

:::caution[Generation saves immediately]
**Generate Budget** calculates and saves revenue and expense account budgets for the selected fund. It is not a preview. Keep a copy of the existing amounts and review the fund and assumptions before using it.
:::

## Redistribute an annual total

**Spread budget** preserves each account's existing annual total and redistributes it over twelve months. **Even** uses equal shares with a rounding adjustment. **Seasonal** uses predefined monthly weights, not your own historical seasonality. A zero annual total stays zero.

Spreading also saves immediately. Check all twelve amounts after the operation completes.

Next: [review budget variances](/budgets/review-variances/).
