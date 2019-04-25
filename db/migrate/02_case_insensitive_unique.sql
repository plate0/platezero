BEGIN TRANSACTION;
CREATE UNIQUE INDEX ON recipe_branches (recipe_id, lower(name));
ALTER TABLE recipe_branches DROP CONSTRAINT recipe_branches_recipe_id_name_key;
CREATE UNIQUE INDEX ON recipes (user_id, lower(slug));
ALTER TABLE recipes DROP CONSTRAINT recipes_user_id_slug_key;
CREATE UNIQUE INDEX ON users (lower(username));
COMMIT;
