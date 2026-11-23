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

Two tabs sit in the dark bar at the top: **Leads** and **Insights**. Either
one fits the window on its own. The page never scrolls; rows that do not fit
live on the next page.

### Leads

**Six numbers across the top.** Total enquiries, not assigned, overdue
follow-ups, working leads, enrolled with its conversion share, and revenue.
The two in red are the ones that mean work is being lost. Most of them are
links - clicking "Overdue 5" lands on exactly those five rows.

**One row of filters.** Seven choices, one at a time: All, Not assigned,
Overdue, New, Follow-up, Enrolled, Not interested. Picking one changes the
rows at once, with grey placeholder rows in between so the wait is visible.
Beside them sits a single dropdown for the owner, which only the admin sees.

Everything a filter picks lives in the URL, so any view can be copied and
sent to someone else, and the back button does what it should.

**The list.** Nine rows a page, with Previous and Next underneath. Each row
carries the lead's name and company, where they came from, their owner, the
stage, what happens next, and how long they have been waiting.

"Next step" always says something. A booked follow-up shows its date and how
late it is; an enrolment shows the money; a lead nobody has called yet says
so in plain words.

### Insights

Four panels, and no chart library behind any of them. The ring is drawn by
hand in SVG and the bars are plain CSS.

**How long people are waiting.** Every open lead by age, in four bands from
green to red. Nothing else on the dashboard answers this, and it is the
question VRT started with: where do enquiries get lost?

**Who is holding what.** Each sales person with their open leads, overdue
follow-ups, enrolments, conversion share and revenue, busiest first. The
admin alone sees it - one sales person has no business reading another's
numbers.

**Where people drop out.** The funnel. The drop between two steps is drawn
into the bar in pale red rather than only written beside it.

**Which channel actually pays.** The length of a bar is how many enquiries a
channel brought; the green part is how many of them signed. A long bar with
a short green tip is a channel that brings crowds and sells nothing.

## Working a lead

Everything happens from the row itself. Each row carries one button, and
which one depends on where that lead actually is.

| The row | Its button |
| ----------------------------- | ------------------- |
| Nobody owns it yet | Assign |
| New | Log first call |
| Follow-up, already overdue | Follow up now (red) |
| Follow-up, still on time | Log call |
| Enrolled or Not interested | View |

One button, not three. A row offering choices makes the reader stop and
pick; a row with one obvious next move gets done.

**Assign** lists the sales people with how many open leads each is already
holding, fewest first. The write only lands if the lead still has no owner,
so two admins looking at the same backlog cannot both hand out the same one.
It writes a note too, so the lead never changes hands silently.

**Log first call**, **Log call** and **Follow up now** all open the same box.
It asks one question - what happened on this call? - as three choices:

| Choice | What it asks for |
| ------------------ | ------------------------------------------- |
| Book a follow-up | What was said, and the next follow-up date |
| They enrolled | Cohort, start date, amount, and a note if you want one |
| Not interested | Why they said no |

Book a follow-up is already chosen, because that is what happens after most
calls. Picking another one swaps the fields underneath. One Save button, and
the box closes itself once the write lands.

All three write a note, so the history carries the whole story including the
last word. A follow-up date can never be in the past. A rejection needs a
reason: left optional it would be left blank, and the column would be worth
nothing when VRT asks why leads are lost.

**The name** opens the history: every note so far, oldest first, with who
wrote it and when, and the next follow-up date above them. Nothing from the
row is repeated there.

A name is only clickable once the lead has at least one note. A lead nobody
has spoken to has no history to show. A closed lead keeps its history but
takes no more updates - a second enrollment would count the same money
twice. Closing a lead also clears its follow-up date, so it stops showing up
in the overdue count.

Escape, the x, or a click outside closes any of these boxes.

## The enquiry form

`/enquiries/new` is a public form. A visitor fills it, and a sales person
uses the same form for an enquiry that arrived by phone or email. It asks
how they heard about VRT, so the source table on the dashboard holds what
people actually said instead of a value we picked for them.

A new enquiry is assigned straight away to the sales person holding the
fewest open leads. Closed leads are not work any more, so they do not count.
The dashboard prints who is next in line, because a rule people can see is a
rule they trust.

## Sending an enquiry from somewhere else

VRT's landing pages are built elsewhere, so they need one address to post to.

```
POST /api/enquiries

{ "first_name": "John", "last_name": "Smith",
  "email": "john@acme.com", "company": "Acme Mfg",
  "job_title": "CEO", "source": "website" }

200  ->  { "ok": true, "id": 51, "assigned_to": "Sneha Kulkarni" }
400  ->  { "ok": false, "error": "email is required" }
```

First name, last name and email are needed. Everything else is optional.
`source` has to be one of `website`, `event`, `referral` or `linkedin`, and
defaults to `website` when it is left out.

This route holds no rules of its own. It calls the same code the form calls,
so an enquiry is born in exactly one place and the two paths cannot drift
apart.

The route is open: anyone who knows the address can post to it. That is fine
for a demo. Real use needs a shared key in a header, and it was left out
knowingly.

To try it from PowerShell, escape the quotes inside the body and keep spaces
out of it. Windows PowerShell strips plain double quotes before a program
ever sees them, and the route then answers "body must be JSON".

```powershell
curl.exe -s -X POST http://localhost:3000/api/enquiries -H "Content-Type: application/json" -d '{\"first_name\":\"John\",\"last_name\":\"Smith\",\"email\":\"john@acme.com\",\"source\":\"referral\"}'
```

A body with spaces in it is easier to send with PowerShell's own command:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/enquiries -Method Post -ContentType 'application/json' -Body '{"first_name":"John","last_name":"Smith","email":"john@acme.com","company":"Acme Mfg"}'
```

## Check the production build

```powershell
npm run build
```

## What is in the demo data

These are the numbers the seed loads. Enquiries sent through the form or the
API are added to them, so the totals on screen read higher than this table.

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
