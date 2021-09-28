/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RecipeQuery
// ====================================================

export interface RecipeQuery_recipeBySlug {
  __typename: "Recipe";
  /**
   * The primary unique identifier for the recipe.
   */
  id: number;
  slug: string;
  title: string;
  ingredients: string | null;
  description: string | null;
  procedure: string | null;
}

export interface RecipeQuery {
  recipeBySlug: RecipeQuery_recipeBySlug | null;
}

export interface RecipeQueryVariables {
  slug: string;
}
