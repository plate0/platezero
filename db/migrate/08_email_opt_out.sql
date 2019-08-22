BEGIN TRANSACTION;
ALTER TABLE users ADD COLUMN email_opt_out boolean not null default false;
COMMIT;
