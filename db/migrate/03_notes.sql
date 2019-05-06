BEGIN TRANSACTION;

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  recipe_id integer not null references recipes (id),
  recipe_version_id integer not null references recipe_versions (id),
  author_id integer not null references users (id),
  text varchar not null,
  pinned boolean not null default false,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone,
  deleted_at timestamp without time zone
);

COMMIT;
