CREATE EXTENSION unaccent;

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
    name character varying,
    image_url character varying
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  recipe_id integer NOT NULL,
  recipe_version_id integer NOT NULL,
  author_id integer NOT NULL,
  text varchar NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
  deleted_at timestamp without time zone
);

CREATE TABLE preheats (
    id SERIAL PRIMARY KEY,
    name character varying NOT NULL,
    temperature integer NOT NULL,
    unit character varying NOT NULL
);

CREATE TABLE procedure_lines (
    id SERIAL PRIMARY KEY,
    image_url character varying,
    text text NOT NULL,
    title character varying
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
  recipe_version_id integer NOT NULL
);
CREATE UNIQUE INDEX ON recipe_branches (recipe_id, lower(name));

CREATE TABLE recipe_collaborators (
  id SERIAL PRIMARY KEY,
  recipe_id integer NOT NULL,
  user_id integer NOT NULL,
  accepted boolean NOT NULL DEFAULT false,
  UNIQUE (recipe_id, user_id)
);

CREATE TABLE recipe_durations (
  id SERIAL PRIMARY KEY,
  duration_seconds integer NOT NULL
);

CREATE TABLE recipe_version_ingredient_lists (
  recipe_version_id integer NOT NULL,
  ingredient_list_id integer NOT NULL,
  sort_key integer,
  UNIQUE (recipe_version_id, ingredient_list_id)
);

CREATE TABLE recipe_version_preheats (
  recipe_version_id integer NOT NULL,
  preheat_id integer NOT NULL,
  UNIQUE (recipe_version_id, preheat_id)
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
  recipe_duration_id integer,
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
  subtitle character varying,
  description character varying,
  image_url character varying,
  source_url character varying,
  source_author character varying,
  source_title character varying,
  source_isbn character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
);
CREATE UNIQUE INDEX ON recipes (user_id, lower(slug));

CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  user_id INT NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
);

CREATE TABLE shopping_list_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  shopping_list_id INT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
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
CREATE UNIQUE INDEX ON users (lower(username));

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR UNIQUE NOT NULL,
  last_used timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp without time zone
);

CREATE VIEW recipe_search_documents AS
  WITH rv_corpus AS (
    SELECT
      recipe_id,
      COALESCE(string_agg(ingredient_lines.name, ' ')) AS corpus
    FROM
      recipe_versions
    JOIN recipe_version_ingredient_lists ON recipe_version_ingredient_lists.recipe_version_id = recipe_versions.id
    JOIN ingredient_list_lines ON ingredient_list_lines.ingredient_list_id = recipe_version_ingredient_lists.ingredient_list_id
    JOIN ingredient_lines ON ingredient_lines.id = ingredient_list_lines.ingredient_line_id
    WHERE recipe_version_id IN (SELECT recipe_version_id FROM recipe_branches)
    GROUP BY recipe_id
    UNION
    SELECT
      recipe_id,
      COALESCE(string_agg(procedure_lines.text, ' ')) AS corpus
    FROM
      recipe_versions
    JOIN recipe_version_procedure_lists ON recipe_version_procedure_lists.recipe_version_id = recipe_versions.id
    JOIN procedure_list_lines ON procedure_list_lines.procedure_list_id = recipe_version_procedure_lists.procedure_list_id
    JOIN procedure_lines ON procedure_lines.id = procedure_list_lines.procedure_line_id
    WHERE recipe_version_id IN (SELECT recipe_version_id FROM recipe_branches)
    GROUP BY recipe_id
  )
  SELECT
    recipes.id AS recipe_id,
    recipes.user_id AS user_id,
    setweight(to_tsvector(unaccent(COALESCE(recipes.title, ''))), 'A') ||
    setweight(to_tsvector(unaccent(COALESCE(recipes.description, ''))), 'B') ||
    setweight(to_tsvector(unaccent(string_agg(rv_corpus.corpus, ' '))), 'C') AS doc
  FROM
    rv_corpus
  JOIN recipes ON recipes.id = rv_corpus.recipe_id
  WHERE recipes.deleted_at IS NULL
  GROUP BY recipes.id, recipes.user_id;

-- foreign keys
ALTER TABLE ingredient_list_lines ADD FOREIGN KEY (ingredient_line_id) REFERENCES ingredient_lines (id);
ALTER TABLE ingredient_list_lines ADD FOREIGN KEY (ingredient_list_id) REFERENCES ingredient_lists (id);
ALTER TABLE notes ADD FOREIGN KEY (author_id) REFERENCES users (id);
ALTER TABLE notes ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE notes ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE procedure_list_lines ADD FOREIGN KEY (procedure_line_id) REFERENCES procedure_lines (id);
ALTER TABLE procedure_list_lines ADD FOREIGN KEY (procedure_list_id) REFERENCES procedure_lists (id);
ALTER TABLE recipe_branches ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_branches ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_collaborators ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_collaborators ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE recipe_version_ingredient_lists ADD FOREIGN KEY (ingredient_list_id) REFERENCES ingredient_lists (id);
ALTER TABLE recipe_version_ingredient_lists ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_version_preheats ADD FOREIGN KEY (preheat_id) REFERENCES preheats (id);
ALTER TABLE recipe_version_preheats ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_version_procedure_lists ADD FOREIGN KEY (procedure_list_id) REFERENCES procedure_lists (id);
ALTER TABLE recipe_version_procedure_lists ADD FOREIGN KEY (recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (parent_recipe_version_id) REFERENCES recipe_versions (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (recipe_duration_id) REFERENCES recipe_durations (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (recipe_yield_id) REFERENCES recipe_yields (id);
ALTER TABLE recipe_versions ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE recipes ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE refresh_tokens ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE shopping_lists ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE shopping_list_items ADD FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (id);
