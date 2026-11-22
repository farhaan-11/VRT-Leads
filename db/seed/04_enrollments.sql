-- The 12 enquiries that became paying members, grouped by cohort.
-- Three cohorts: two that have run, and one that starts in January.
-- Amounts differ per member because the agreements differ.

INSERT INTO enrollments (enquiry_id, cohort, start_date, amount, created_at) VALUES

(30, 'VEGA Summer 2026', '2026-06-15', 11400.00, '2026-05-28 14:20:00'),
(35, 'VEGA Summer 2026', '2026-06-15',  9800.00, '2026-05-20 16:08:00'),
(39, 'VEGA Summer 2026', '2026-06-15', 12750.00, '2026-06-04 15:40:00'),

(31, 'VEGA Fall 2026',   '2026-09-14', 14500.00, '2026-08-12 11:35:00'),
(32, 'VEGA Fall 2026',   '2026-09-14',  8900.00, '2026-08-19 15:52:00'),
(33, 'VEGA Fall 2026',   '2026-09-14', 11400.00, '2026-08-27 10:14:00'),

-- Two seats, hers and her COO, charged as one agreement.
(36, 'VEGA Fall 2026',   '2026-09-14', 16200.00, '2026-09-02 12:30:00'),

(40, 'VEGA Fall 2026',   '2026-09-14',  9800.00, '2026-09-04 11:18:00'),

(34, 'VEGA Winter 2027', '2027-01-11', 12750.00, '2026-10-16 13:44:00'),
(37, 'VEGA Winter 2027', '2027-01-11', 11400.00, '2026-10-29 14:55:00'),
(38, 'VEGA Winter 2027', '2027-01-11',  8900.00, '2026-11-07 10:22:00'),
(41, 'VEGA Winter 2027', '2027-01-11', 13600.00, '2026-11-13 16:02:00');
