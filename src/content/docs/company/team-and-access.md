---
title: Add team members and review access
description: Create a sign-in, assign roles, and understand immediate access changes.
---

Open **Company → Team & Roles**. The **Team** tab lists names, email addresses, usernames, roles, and status. Only an administrator can add people or change roles.

## Add a team member

1. Choose **New** to open **Add User**.
2. Enter **Email**, **First Name**, and **Last Name**. The email becomes the sign-in address and cannot be changed here afterward.
3. Add **Title** and **Location** if needed. **Member ID** defaults to the email name and must be unique.
4. Select one **Initial Role**. Review **Roles & Access** on the Team page to choose the role appropriate to the person's work.
5. Review **Email an invitation to set their password**, then choose **Create User** when the identity and access are correct.
6. Confirm the member in the roster and follow the displayed invitation instructions. Have the member complete their own password setup.

[![Empty Add User form with identity fields, Initial Role choices, invitation option, and Create User.](/images/workflows/add-user.png)](/images/workflows/add-user.png)

*Add User before entering a new member's details.*

## Review or change roles

Select the member's row to open their details. Confirm the email address so you are editing the intended person.

:::caution[Role changes apply immediately]
Clicking a role assigns or revokes it; there is no separate Save step for roles. Review the intended access before toggling a role. The application blocks revoking the last ADMIN.
:::

Check the updated role list after the action completes. **Roles & Access** descriptions are a starting point; task-specific restrictions and separation-of-duties rules can still apply.

## When someone leaves

Review access as part of the handover. Disabling a member signs them out and stops their roles from taking effect while retaining the grants. Enabling them later restores those grants, so review the roles before restoring access.

Use [Audit Trail](/documents/audit-trail/) to look for recorded administration events. For the accounting handover, see [audit preparation](/guides/prepare_for_audit/).
