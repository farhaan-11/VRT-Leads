-- Enquiries and leads share this one table. They are the same person in
-- the same row, so a second table would only be a copy with joins.
-- assigned_to being empty is what makes a row "still only an enquiry".

CREATE TABLE enquiries (
  id              INT          NOT NULL AUTO_INCREMENT,
  first_name      VARCHAR(60)  NOT NULL,
  last_name       VARCHAR(60)  NOT NULL,

  -- I do not make email unique. The same person enquiring twice is normal.
  email           VARCHAR(150) NOT NULL,

  -- 30 characters fits a US number with an extension: +1 (203) 304-1918 x12
  phone           VARCHAR(30)  NULL,

  job_title       VARCHAR(80)  NULL,
  company         VARCHAR(150) NULL,
  company_size    VARCHAR(20)  NULL,

  -- Two letters is a US state code: CT, NY, CA.
  state           VARCHAR(2)   NULL,

  source          VARCHAR(50)  NULL,
  message         TEXT         NULL,

  assigned_to     INT          NULL,
  assigned_at     DATETIME     NULL,

  stage           ENUM('new','follow_up','enrolled','rejected') NOT NULL DEFAULT 'new',

  -- This is a DATE and not a DATETIME on purpose. A time here would shift
  -- across time zones and make the overdue count wrong by a day.
  follow_up_on    DATE         NULL,

  rejected_reason VARCHAR(120) NULL,

  created_at      DATETIME     NOT NULL,
  updated_at      DATETIME     NOT NULL,

  PRIMARY KEY (id),

  -- The dashboard filters on these three columns on every page load.
  KEY enquiries_assigned_to_index (assigned_to),
  KEY enquiries_stage_index (stage),
  KEY enquiries_follow_up_on_index (follow_up_on),

  CONSTRAINT enquiries_assigned_to_fk
    FOREIGN KEY (assigned_to) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
