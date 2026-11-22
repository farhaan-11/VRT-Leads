# VRT Leads Dashboard

One screen that follows a VEGA enquiry from first contact to payment:
enquiry -> lead -> enrollment.

Built with Next.js, MySQL and raw SQL. `PLAN.md` holds the full
requirement.

## Set up the database

MySQL has to be installed and running. Five steps, in this order.

**1. Put your connection string in `.env.local`** at the root of the
project. This file is gitignored and is never committed.

```
DATABASE_URL=mysql://user:password@host:3306/vrt_leads
```

For a MySQL running on this machine that reads:

```
DATABASE_URL=mysql://root:your_password@localhost:3306/vrt_leads
```

One line rather than five. A hosted database hands you this string ready to
copy, so there is nothing to retype and nothing to get wrong.

All the SQL below runs in MySQL Workbench. Only `npm` commands run in
PowerShell.

**2. Create an empty database and switch into it.** Open a query tab in
Workbench and run all three lines together:

```sql
DROP DATABASE IF EXISTS vrt_leads;
CREATE DATABASE vrt_leads;
USE vrt_leads;
```

`USE` is the line that matters. Without it Workbench keeps writing into
whichever database was selected last, and the tables quietly land
somewhere else.

To make the choice stick across tabs, double-click `vrt_leads` in the
SCHEMAS sidebar on the left. Its name goes bold when it is the one in use.

**3. Create the four tables, in this order.** `enquiries` points at
`users`, and `notes` and `enrollments` point at `enquiries`, so a table
cannot be created before the one it points at. The numbers in the file
names are that order.

In Workbench, open each file with File > Open SQL Script, then run it:

1. `db/schema/01_users.sql`
2. `db/schema/02_enquiries.sql`
3. `db/schema/03_notes.sql`
4. `db/schema/04_enrollments.sql`

**4. Load the demo data,** the same four names in the same order:

1. `db/seed/01_users.sql`
2. `db/seed/02_enquiries.sql`
3. `db/seed/03_notes.sql`
4. `db/seed/04_enrollments.sql`

**5. Check it loaded.** Run this in Workbench:

```sql
SELECT
  (SELECT COUNT(*) FROM users)       AS users,
  (SELECT COUNT(*) FROM enquiries)   AS enquiries,
  (SELECT COUNT(*) FROM notes)       AS notes,
  (SELECT COUNT(*) FROM enrollments) AS enrollments;
```

It has to read 4, 50, 120 and 12. Anything else means a file did not run.

### The same thing from the terminal

If you would rather not use Workbench, steps 2 to 4 are three PowerShell
commands:

```powershell
mysql -u root -p -e "DROP DATABASE IF EXISTS vrt_leads; CREATE DATABASE vrt_leads;"
```

```powershell
Get-Content db/schema/01_users.sql, db/schema/02_enquiries.sql, db/schema/03_notes.sql, db/schema/04_enrollments.sql | mysql -u root -p vrt_leads
```

```powershell
Get-Content db/seed/01_users.sql, db/seed/02_enquiries.sql, db/seed/03_notes.sql, db/seed/04_enrollments.sql | mysql -u root -p vrt_leads
```

Here the database name is already in the command, so no `USE` line is
needed. If PowerShell says `mysql` is not recognized, it is not on your
PATH. Use the full path instead, for example
`& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`.

## Run it

```powershell
npm run dev
```

Open http://localhost:3000.

## What the screen shows

One page, read from the top down.

**Six numbers.** Total enquiries, not assigned yet, overdue follow-ups,
working leads, enrolled with its conversion share, and revenue. The two in
red are the ones that mean work is being lost.

**A funnel.** How many people survive each step, and how many drop out
between them. Plain CSS bars, no chart library.

**The enquiry list.** Every enquiry with its owner, stage, next follow-up
and age. Overdue rows sort to the top, then the ones nobody owns, then
newest first. A new enquiry is safe; a forgotten one is not.

Three of the numbers are links. Clicking "Overdue 5" lands on exactly those
five rows. Every filter lives in the URL, so any view can be copied and sent
to someone else.

## Check the production build

```powershell
npm run build
```

## What is in the demo data

| Number             | Value                     |
| ------------------ | ------------------------- |
| Total enquiries    | 50                        |
| Not assigned yet   | 8                         |
| Overdue follow-ups | 5                         |
| Working leads      | 29                        |
| Enrolled           | 12                        |
| Rejected           | 9                         |
| Revenue            | $141,400                  |

There is no login. Four people exist in the demo: one admin and three sales
people. The "View as" dropdown in the header switches between them, and the
screen changes with it. A sales person sees only their own enquiries, and
the "Not assigned" card disappears for them, because an enquiry nobody owns
is not theirs to chase.
