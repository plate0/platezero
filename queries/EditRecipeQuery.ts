/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditRecipeQuery
// ====================================================

export interface EditRecipeQuery_recipeBySlug {
  __typename: "Recipe";
  /**
   * The primary unique identifier for the recipe.
   */
  id: number;
  title: string;
  description: string | null;
  yield: string | null;
  duration: number | null;
  ingredients: string | null;
  procedure: string | null;
}

export interface EditRecipeQuery {
  recipeBySlug: EditRecipeQuery_recipeBySlug | null;
}

export interface EditRecipeQueryVariables {
  slug: string;
  username: string;
}
