---
title: Set up the fiscal calendar
description: Configure the year end and generate the initial monthly period calendar.
---

**Fiscal year setup** configures the company's initial period calendar. Access requires an administrator.

## Before you begin

Confirm the agreed fiscal year-end month and conversion period-end date with the person responsible for the books. This operation replaces the default calendar created with the organization; it is an initial setup task, not the routine year-end close procedure.

## Generate the calendar

1. Open the company's **Fiscal year setup** page. Its application path is `/<company>/setup/fiscal-year`, using the company segment from your current application URL.
2. Select **Fiscal year end month**. The application derives the year-end day from that month.
3. Enter **Conversion period-end date**. New periods begin the following day.
4. Set **Months to generate** between 12 and 60. The default is 24.
5. Review the values, then choose **Generate fiscal year**.
6. Confirm **Period calendar generated successfully.** Check the first open period number, year, start date, and end date against your intended calendar.

For example, if the conversion period ends on March 31, the new periods begin on April 1. This example does not determine which year-end month your company should use.

## If setup is blocked

If the page says **Fiscal year is already configured. Contact support to change.**, contact support to arrange a calendar change. Do not treat repeated generation as a way to advance the current period.

For a missing-period message during transaction entry, first check the transaction date and calendar coverage. For routine closing work, continue to [year-end close](/guides/year_end_close/).
