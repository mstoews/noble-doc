---
title: Create a customer invoice
description: Enter customer charges and prepare the resulting journal for sign-off.
sidebar:
  order: 1
---

Use **Accounts Receivable → New Invoice** for an individual customer invoice.

## Before you begin

Select the correct company. Have the customer, invoice number, issue date, revenue accounts, funds, and amounts ready. The issue date must fall in an open fiscal period.

## Enter and save the invoice

1. Select the customer in the customer panel.
2. Complete **Invoice #**, **Issue Date**, **Terms**, and **Due Date**. Add **PO / Reference** and **Memo / Description** where useful.
3. Add the invoice lines. Check each description, amount, revenue account, and fund.
4. Review the total and journal preview. Resolve the messages in the action bar, including missing revenue accounts or a closed period.
5. Choose **Save draft** and wait for confirmation. The saved invoice has a linked journal; the action bar offers **Start new invoice** afterward.

## Arrange sign-off

Saving creates the AR transaction and a draft journal awaiting sign-off. Another accountant or an administrator must review and book the journal as permitted by the application's separation-of-duties rules. Confirm the journal's posted state before expecting the charge to be available for receipt allocation.

:::note[Delivery and accounting are separate]
The screen also offers **Send invoice** and **Download PDF**. The current save and send actions both create the invoice and its draft journal. A “sent” screen status alone does not establish that email reached the customer; verify delivery separately before relying on it.
:::

## If you cannot continue

| Condition | What to check |
| --- | --- |
| Missing customer or line amount | Select the customer and enter at least one positive line. |
| Missing revenue account | Select an account on each line with an amount. |
| No email for the customer | Add the contact email or choose another delivery option before using Send invoice. |
| Closed or missing period | Check the issue date and ask your administrator to review the calendar. Keep the date consistent with the transaction. |
| Invoice already saved | Locate the existing journal before creating anything else. Start new invoice is for a separate invoice. |

Next: [review outstanding balances](/accounts-receivable/review-aging/) or [record a receipt](/accounts-receivable/record-receipt/).
