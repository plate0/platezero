BEGIN TRANSACTION;
  CREATE TABLE favorites (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id),
    recipe_id INT NOT NULL REFERENCES recipes (id),
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone,
    UNIQUE(user_id, recipe_id)
  );
COMMIT;
