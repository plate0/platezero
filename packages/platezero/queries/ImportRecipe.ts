/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRecipeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ImportRecipe
// ====================================================

export interface ImportRecipe_createRecipe_recipe_userByUserId {
  __typename: "User";
  username: string;
}

export interface ImportRecipe_createRecipe_recipe {
  __typename: "Recipe";
  slug: string;
  /**
   * Reads a single `User` that is related to this `Recipe`.
   */
  userByUserId: ImportRecipe_createRecipe_recipe_userByUserId | null;
}

export interface ImportRecipe_createRecipe {
  __typename: "CreateRecipePayload";
  recipe: ImportRecipe_createRecipe_recipe | null;
}

export interface ImportRecipe {
  createRecipe: ImportRecipe_createRecipe | null;
}

export interface ImportRecipeVariables {
  input: CreateRecipeInput;
}
