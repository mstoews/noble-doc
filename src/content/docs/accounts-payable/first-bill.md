---
title: Enter your first vendor bill
description: Record a supplier invoice, check its allocation, and submit it for approval.
---

Use a bill to record a vendor invoice. The bill editor provides **Save draft** and **Submit for approval** actions for new bills.

## Before you begin

Have the vendor invoice available. Confirm the company, vendor, invoice number, bill date, and expense allocation. The bill date must fall within a configured, open fiscal period.

## Create the bill

1. Open **Accounts Payable → Bills** and choose **New bill**.
2. Select the vendor from the vendor panel.
3. Enter **Bill #** exactly as shown on the invoice. Add **PO / Reference** if useful.
4. Set **Bill Date** and review the posting-period indicator.
5. Select **Terms** and check the automatically calculated **Due Date**.
6. Enter the invoice lines and assign an expense account to every line with an amount. Check the total and any fund allocation against the invoice.
7. Review the journal preview and supporting information before saving.

## Save or submit

Choose **Save draft** to save the bill for further work. Wait for the **Draft saved** confirmation and check the bill list.

When the form is ready, choose **Submit for approval**. The action bar displays blocking reasons until the required fields and period checks pass. Submission is a separate step from payment; check the resulting bill status before continuing.

## Resolve common blockers

| Message | What to check |
| --- | --- |
| Pick a vendor | Select the vendor record. |
| Add a bill number | Enter the supplier's invoice number. |
| Add at least one line amount | The bill total must be greater than zero. |
| Give every line an expense account | Assign an account to each nonzero line. |
| Period is closed | Confirm the correct date and ask your administrator about the period. |
| No fiscal period covers the bill date | Ask your administrator to check the period calendar. |

Do not change an accurate invoice date just to bypass a closed period. Follow your organization's handling of prior-period invoices.

## Confirm the result

Find the bill in **Accounts Payable → Bills**. Check its vendor, invoice number, amount, and status. If a save or submission fails, read the error before retrying and check whether the bill already exists.

Related: [create a journal](/general-ledger/first-journal/) and [prepare for an audit](/guides/prepare_for_audit/).
