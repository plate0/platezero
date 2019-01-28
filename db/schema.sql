CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  forked_recipe_id INT,
  user_id INT NOT NULL,

  title VARCHAR NOT NULL,
  source_url VARCHAR,
  source_cookbook_id INT,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE ingredient_sections (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL,

  name VARCHAR NOT NULL,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_section_id INT,

  name VARCHAR NOT NULL,
  quantity_numerator INT,
  quantity_denominator INT,
  unit VARCHAR,
  preparation VARCHAR,
  note VARCHAR,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE procedure_sections (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL,

  name VARCHAR NOT NULL,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE procedure_steps (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL,

  step VARCHAR NOT NULL,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE cookbooks (
  id SERIAL PRIMARY KEY,

  isbn VARCHAR UNIQUE,
  author VARCHAR,
  title VARCHAR,
  year INT,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE cookbook_recipes (
  id SERIAL PRIMARY KEY,
  cookbook_id INT NOT NULL,

  title VARCHAR NOT NULL,
  page VARCHAR NOT NULL,
  brief VARCHAR,

  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX ON recipes (forked_recipe_id);
ALTER TABLE recipes ADD FOREIGN KEY (forked_recipe_id) REFERENCES recipes (id);

CREATE INDEX ON recipes (user_id);
ALTER TABLE recipes ADD FOREIGN KEY (user_id) REFERENCES users (id);

CREATE INDEX ON recipes (source_cookbook_id);
ALTER TABLE recipes ADD FOREIGN KEY (source_cookbook_id) REFERENCES cookbooks (id);

CREATE INDEX ON ingredient_sections (recipe_id);
ALTER TABLE ingredient_sections ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);

CREATE INDEX ON ingredients (recipe_id);
ALTER TABLE ingredients ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);

CREATE INDEX ON ingredients (ingredient_section_id);
ALTER TABLE ingredients ADD FOREIGN KEY (ingredient_section_id) REFERENCES ingredient_sections (id);

CREATE INDEX ON procedure_sections (recipe_id);
ALTER TABLE procedure_sections ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);

CREATE INDEX ON procedure_steps (recipe_id);
ALTER TABLE procedure_steps ADD FOREIGN KEY (recipe_id) REFERENCES recipes (id);

CREATE INDEX ON cookbook_recipes (cookbook_id);
ALTER TABLE cookbook_recipes ADD FOREIGN KEY (cookbook_id) REFERENCES cookbooks (id);
