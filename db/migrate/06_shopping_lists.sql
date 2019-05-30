BEGIN TRANSACTION;
  
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

ALTER TABLE shopping_lists ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE shopping_list_items ADD FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (id);

COMMIT;
