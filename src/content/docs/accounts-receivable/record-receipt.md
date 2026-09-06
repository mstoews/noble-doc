---
title: Record and allocate a receipt
description: Apply a customer payment to open charges and confirm the posted result.
sidebar:
  order: 2
---

Record a receipt from the customer's or resident's statement. Posting requires the **Accountant** or **Admin** role.

## Before you begin

Confirm the company, payer, payment amount, payment date, and receiving bank account. The payer must have posted open charges: the receipt must be fully applied to those charges.

## Enter the payment

1. Open **Accounts Receivable → AR Aging**, select the resident or customer name, and choose **New receipt** on the statement.
2. Enter **Amount** and **Date**. The date picker does not allow a future date.
3. Select **Method**: EFT, Cheque, Cash, Pre-auth, e-Transfer, or Other.
4. Select the **Bank deposit account**. Enter the payment **Reference**, such as a cheque number or transfer reference, and an optional **Description**.

## Apply the amount to charges

Entering an amount allocates it to charges oldest first. In **Apply to charges**, review each row's **Due**, **Reference**, **Fund**, **Open**, and **Apply** values.

Adjust **Apply** where necessary. Each allocation must stay within the charge's open amount, and the fund comes from the charge. **Re-allocate (oldest first)** discards your manual allocation choices and starts again.

The footer must show zero unallocated. Review the journal preview and confirm it is balanced, then choose **Post receipt**. Wait for the statement to reopen and check the payment and remaining charges.

## If posting is unavailable

| Condition | Next step |
| --- | --- |
| No open charges | Use **Post an invoice first** if a charge is genuinely missing, then complete its sign-off before receiving against it. |
| Unallocated amount remains | Review the amount and allocations. On-account payments and prepayments are not supported by this receipt flow. |
| Allocation exceeds a charge | Reduce that row's Apply amount and review the other open charges. |
| Role does not permit posting | Ask an Accountant or Admin to review and post. |
| Save or posting error | Read the returned message and check the statement before retrying, to avoid recording the payment twice. |

Next: [reconcile the bank account](/banking/reconciliation/).
