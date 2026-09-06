---
title: Create your first journal
description: Enter a balanced journal, save it as a draft, and post it when authorized.
---

Create a journal when you need to record a general ledger transaction. Saving a draft and posting are separate actions.

## Before you begin

Confirm your company, transaction date, account selections, and fund allocations. Have the supporting document available. Posting requires the Accountant or Admin role, and the server may enforce separation of duties between the creator and poster.

## Open the journal editor

Open **General Ledger → Journal Entries** and start a new journal. Check that the editor identifies the record as **New journal**.

## Enter the transaction

1. Complete the journal header with the transaction date and a description that explains the entry.
2. Add the debit and credit lines, selecting the appropriate accounts and funds.
3. Review the balance summary and resolve any validation messages. Total debits and credits must agree.
4. Add supporting evidence where needed.
5. Choose **Save draft**. Wait for the save to finish and confirm that the journal has an identifier.

## Post the saved draft

Review the saved entry, then choose **Post journal** if your role permits it. Posting changes the journal from Draft to Posted. Posted and cancelled entries are read-only in this editor.

:::caution[Review before posting]
Confirm the company, date, accounts, funds, amounts, and supporting evidence before posting. If a posted entry needs correction, follow your organization's correction process.
:::

## Confirm the result

Return to the journal list and locate the saved record. Check its identifier, description, and state. A saved draft is not yet a posted transaction.

## If posting is unavailable

| Message or condition | Next step |
| --- | --- |
| Save the draft before posting | Save, wait for confirmation, then review the saved journal. |
| Fix the validation errors before posting | Correct the indicated fields and balance the lines. |
| Posting requires the Accountant or Admin role | Ask an authorized colleague to review and post. |
| Server rejects the posting action | Read the returned message; separation-of-duties rules can require another person to post. |

Next: [enter a vendor bill](/accounts-payable/first-bill/) or [read your financial statements](/accounting/how_to_read_financial_statement/).
