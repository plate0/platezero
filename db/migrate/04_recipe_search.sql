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
