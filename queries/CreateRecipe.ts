/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRecipeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRecipe
// ====================================================

export interface CreateRecipe_createRecipe_recipe {
  __typename: "Recipe";
  slug: string;
}

export interface CreateRecipe_createRecipe {
  __typename: "CreateRecipePayload";
  /**
   * The `Recipe` that was created by this mutation.
   */
  recipe: CreateRecipe_createRecipe_recipe | null;
}

export interface CreateRecipe {
  /**
   * Creates a single `Recipe`.
   */
  createRecipe: CreateRecipe_createRecipe | null;
}

export interface CreateRecipeVariables {
  input: CreateRecipeInput;
}
