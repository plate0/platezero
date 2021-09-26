CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the schemas for PlateZero
-- pz_public holds everything accessible to GraphQL
-- pz_private holds all private data that is not accessible via GraphQL
create schema pz_public;
create schema pz_private;

-- Remove permissions on the default schema
alter default privileges revoke execute on functions from public;

-- This is not the password we use on production :)
create role pz_postgraphile login password 'password';

-- pz_anonymous represents a user who is not logged in. They can view public
-- recipes on PlateZero, but no private information.
create role pz_anonymous;
grant pz_anonymous to pz_postgraphile;

-- pz_account represents the logged in user
create role pz_account;
grant pz_account to pz_postgraphile;


-------------------------------------------------------------------------------

CREATE FUNCTION pz_private.set_updated_at() RETURNS trigger AS $$
BEGIN
  new.updated_at := current_timestamp;
  return new;
END;
$$ language plpgsql;








create table pz_public.user (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  confirmed_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
);
CREATE UNIQUE INDEX ON pz_public.user (lower(username));
COMMENT ON TABLE pz_public.user IS 'A user of PlateZero.';


CREATE TABLE pz_private.user_account (
  user_id INTEGER PRIMARY KEY REFERENCES pz_public.user(id) ON DELETE CASCADE,
  email TEXT UNIQUE CHECK (email ~* '^.+@.+$'),
  password_hash TEXT NOT NULL
);

COMMENT ON TABLE pz_private.user_account IS 'Private information about a users account.';





--------

-- Recipe is the heart of PlateZero
CREATE TABLE pz_public.recipe (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES pz_public.user(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  procedure TEXT,
  ingredients TEXT,
  image_url TEXT,
  source_url TEXT,
  source_author TEXT,
  source_title TEXT,
  source_isbn TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);
COMMENT ON TABLE pz_public.recipe IS 'A recipe.';
COMMENT ON COLUMN pz_public.recipe.id IS 'The primary unique identifier for the recipe.';



CREATE TRIGGER recipe_updated_at BEFORE UPDATE
  on pz_public.recipe
  for each row
  execute procedure pz_private.set_updated_at();




------------



create function pz_public.register_user(
  username text,
  password text
) returns pz_public.user as $$
declare
  account pz_public.user;
begin
  insert into pz_public.user (username) values
    (username)
    returning * into account;

  insert into pz_private.user_account (user_id, password_hash) values
    (account.id, crypt(password, gen_salt('bf')));

  return account;
end;
$$ language plpgsql strict security definer;

comment on function pz_public.register_user(text, text) is 'Registers a user and creates an account in PlateZero.';


------------

create type pz_public.jwt_token as (
  role text,
  user_id integer,
  exp bigint
);


create function pz_public.authenticate(
  username text,
  password text
) returns pz_public.jwt_token as $$
declare
  publicuser pz_public.user;
  account pz_private.user_account;
begin
  select a.* into publicuser
  from pz_public.user as a
  where a.username = $1;

  select a.* into account
  from pz_private.user_account as a
  where a.user_id = publicuser.id;

  if account.password_hash = crypt(password, account.password_hash) then
    return ('pz_account', account.user_id, extract(epoch from (now() + interval '7 days')))::pz_public.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

comment on function pz_public.authenticate(text, text) is 'Creates a JWT token that will securely identify a user and give them certain permissions. This token expires in 7 days.';


create function pz_public.current_user() returns pz_public.user as $$
  select *
  from pz_public.user
  where id = nullif(current_setting('jwt.claims.user_id', true), '')::integer
$$ language sql stable;

comment on function pz_public.current_user() is 'Gets the user who was identified by our JWT.';




--

grant usage on schema pz_public to pz_anonymous, pz_account;

grant select on table pz_public.user to pz_anonymous, pz_account;
grant update, delete on table pz_public.user to pz_account;

grant select on table pz_public.recipe to pz_anonymous, pz_account;
grant insert, update, delete on table pz_public.recipe to pz_account;
grant usage on sequence pz_public.recipe_id_seq to pz_account;

grant execute on function pz_public.authenticate(text, text) to pz_anonymous, pz_account;
grant execute on function pz_public.current_user() to pz_anonymous, pz_account;

grant execute on function pz_public.register_user(text, text) to pz_anonymous;


alter table pz_public.user enable row level security;
alter table pz_public.recipe enable row level security;

create policy select_user on pz_public.user for select
  using (true);

create policy select_recipe on pz_public.recipe for select
  using (true);

create policy update_user on pz_public.user for update to pz_account
  using (id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);

create policy insert_recipe on pz_public.recipe for insert to pz_account
  with check (user_id = nullif(current_setting('jwt.claims.user_id', true), '')::integer);
