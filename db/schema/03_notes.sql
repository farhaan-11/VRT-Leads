-- One row per conversation a sales person had with an enquiry.
-- The lead detail page reads these in order, newest last.

CREATE TABLE notes (
  id         INT      NOT NULL AUTO_INCREMENT,
  enquiry_id INT      NOT NULL,
  user_id    INT      NOT NULL,
  body       TEXT     NOT NULL,
  created_at DATETIME NOT NULL,

  PRIMARY KEY (id),

  -- Every read of this table is "all notes for one enquiry".
  KEY notes_enquiry_id_index (enquiry_id),

  CONSTRAINT notes_enquiry_id_fk
    FOREIGN KEY (enquiry_id) REFERENCES enquiries (id),
  CONSTRAINT notes_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
