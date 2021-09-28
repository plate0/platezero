/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRecipeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRecipe
// ====================================================

export interface CreateRecipe_createRecipe_recipe_userByUserId {
  __typename: "User";
  username: string;
}

export interface CreateRecipe_createRecipe_recipe {
  __typename: "Recipe";
  slug: string;
  /**
   * Reads a single `User` that is related to this `Recipe`.
   */
  userByUserId: CreateRecipe_createRecipe_recipe_userByUserId | null;
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
