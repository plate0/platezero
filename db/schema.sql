CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name character varying NOT NULL
);

CREATE TABLE cookbook_authors (
    author_id integer NOT NULL,
    cookbook_id integer NOT NULL,
    UNIQUE (author_id, cookbook_id)
);

CREATE TABLE cookbook_recipes (
    id SERIAL PRIMARY KEY,
    cookbook_id integer NOT NULL,
    page character varying NOT NULL,
    title character varying NOT NULL
);

CREATE TABLE cookbooks (
    id SERIAL PRIMARY KEY,
    title character varying NOT NULL,
    isbn character varying NOT NULL UNIQUE
);

CREATE TABLE ingredient_lines (
    id SERIAL PRIMARY KEY,
    name character varying NOT NULL,
    quantity_numerator integer,
    quantity_denominator integer,
    unit character varying,
    preparation character varying,
    optional boolean NOT NULL DEFAULT false
);

CREATE TABLE ingredient_list_lines (
    ingredient_list_id integer NOT NULL,
    ingredient_line_id integer NOT NULL,
    sort_key integer,
    UNIQUE (ingredient_list_id, ingredient_line_id)
);

CREATE TABLE ingredient_lists (
    id SERIAL PRIMARY KEY,
    name character varying
);

CREATE TABLE oven_preheats (
    id SERIAL PRIMARY KEY,
    temperature integer NOT NULL,
    unit character varying NOT NULL
);

CREATE TABLE procedure_lines (
    id SERIAL PRIMARY KEY,
    text text NOT NULL
);

CREATE TABLE procedure_list_lines (
  procedure_list_id integer NOT NULL,
  procedure_line_id integer NOT NULL,
  sort_key integer,
  UNIQUE (procedure_list_id, procedure_line_id)
);

CREATE TABLE procedure_lists (
  id SERIAL PRIMARY KEY,
  name character varying
);

CREATE TABLE recipe_branches (
  recipe_id integer NOT NULL,
  name character varying NOT NULL,
  recipe_version_id integer NOT NULL,
  UNIQUE (recipe_id, name)
);

CREATE TABLE recipe_collaborators (
  id SERIAL PRIMARY KEY,
  recipe_id integer NOT NULL,
  user_id integer NOT NULL,
  accepted boolean NOT NULL DEFAULT false,
  UNIQUE (recipe_id, user_id)
);

CREATE TABLE recipe_version_ingredient_lists (
  recipe_version_id integer NOT NULL,
  ingredient_list_id integer NOT NULL,
  sort_key integer,
  UNIQUE (recipe_version_id, ingredient_list_id)
);

CREATE TABLE recipe_version_procedure_lists (
  recipe_version_id integer NOT NULL,
  procedure_list_id integer NOT NULL,
  sort_key integer,
  UNIQUE (recipe_version_id, procedure_list_id)
);

CREATE TABLE recipe_versions (
  id SERIAL PRIMARY KEY,
  recipe_id integer NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  user_id integer NOT NULL,
  parent_recipe_version_id integer,
  recipe_yield_id integer,
  oven_preheat_id integer,
  sous_vide_preheat_id integer,
  message text NOT NULL
);

CREATE TABLE recipe_yields (
  id SERIAL PRIMARY KEY,
  text character varying NOT NULL
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  slug character varying NOT NULL,
  title character varying NOT NULL,
  image_url character varying,
  source_url character varying,
  source_cookbook_recipe_id integer,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone DEFAULT now(),
  UNIQUE (user_id, slug)
);

CREATE TABLE sous_vide_preheats (
  id SERIAL PRIMARY KEY,
  temperature numeric NOT NULL,
  unit character varying NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username character varying UNIQUE NOT NULL,
  email character varying UNIQUE NOT NULL,
  password_hash character varying,
  avatar_url character varying,
  name character varying,
  confirmed_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
);

-- foreign keys
ALTER TABLE cookbook_authors ADD FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE cookbook_authors ADD FOREIGN KEY (cookbook_id) REFERENCES cookbooks (id);
ALTER TABLE cookbook_recipes ADD FOREIGN KEY (cookbook_id) REFERENCES cookbooks (id);
ALTER TABLE ingredient_list_lines ADD FOREIGN KEY (ingredient_list_id) REFERENCES ingredient_lists (id);
ALTER TABLE ingredient_list_lines ADD FOREIGN KEY (ingredient_line_id) REFERENCES ingredient_lines (id);
ALTER TABLE procedure_list_lines ADD FOREIGN KEY (procedure_list_id) REFERENCES procedure_lists (id);
ALTER TABLE procedure_list_lines ADD FOREIGN KEY (procedure_line_id) REFERENCES procedure_lines (id);
ALTER TABLE recipe_branches ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_branches ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_collaborators ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_collaborators ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE recipe_version_ingredient_lists ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_version_ingredient_lists ADD FOREIGN KEY (ingredient_list_id) REFERENCES ingredient_lists (id);
ALTER TABLE recipe_version_procedure_lists ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_version_procedure_lists ADD FOREIGN KEY (procedure_list_id) REFERENCES procedure_lists (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (parent_recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (recipe_yield_id) REFERENCES recipe_yields (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (oven_preheat_id) REFERENCES oven_preheats (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (sous_vide_preheat_id) REFERENCES sous_vide_preheats (id);
ALTER TABLE recipes ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE recipes ADD FOREIGN KEY (source_cookbook_recipe_id) REFERENCES cookbook_recipes (id);
