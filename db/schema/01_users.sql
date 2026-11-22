-- The four demo people: one admin and three sales people.
-- This table is created first because enquiries points at it.

CREATE TABLE users (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  role       ENUM('admin','sales') NOT NULL,
  created_at DATETIME     NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
