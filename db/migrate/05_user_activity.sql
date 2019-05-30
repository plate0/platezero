BEGIN TRANSACTION;
CREATE TABLE user_activity (
  date date NOT NULL,
  user_id integer NOT NULL,
  UNIQUE(date, user_id)
);
ALTER TABLE user_activity ADD FOREIGN KEY (user_id) REFERENCES users (id);
COMMIT;
