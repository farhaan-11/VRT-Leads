-- What a lead became once they joined VEGA: which cohort, and what they paid.

CREATE TABLE enrollments (
  id         INT           NOT NULL AUTO_INCREMENT,
  enquiry_id INT           NOT NULL,
  cohort     VARCHAR(60)   NOT NULL,
  start_date DATE          NOT NULL,

  -- US dollars. There is no currency column because every row would hold
  -- the same value. The dollar sign is added when printing.
  amount     DECIMAL(10,2) NULL,

  created_at DATETIME      NOT NULL,

  PRIMARY KEY (id),

  -- One enrollment per enquiry. This stops a double enrollment from
  -- counting the same money twice on the dashboard.
  UNIQUE KEY enrollments_enquiry_id_unique (enquiry_id),

  CONSTRAINT enrollments_enquiry_id_fk
    FOREIGN KEY (enquiry_id) REFERENCES enquiries (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
