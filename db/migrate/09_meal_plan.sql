begin transaction;

  create table planned_recipes (
    id serial not null primary key,
    user_id integer not null references users (id),
    recipe_id integer not null references recipes (id),
    plan_date timestamp without time zone not null,
    created_at timestamp without time zone not null default now(),
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
  );

commit;
