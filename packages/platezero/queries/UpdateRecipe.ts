/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RecipePatch } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateRecipe
// ====================================================

export interface UpdateRecipe_updateRecipeById_recipe_userByUserId {
  __typename: "User";
  username: string;
}

export interface UpdateRecipe_updateRecipeById_recipe {
  __typename: "Recipe";
  /**
   * The primary unique identifier for the recipe.
   */
  id: number;
  slug: string;
  /**
   * Reads a single `User` that is related to this `Recipe`.
   */
  userByUserId: UpdateRecipe_updateRecipeById_recipe_userByUserId | null;
}

export interface UpdateRecipe_updateRecipeById {
  __typename: "UpdateRecipePayload";
  /**
   * The `Recipe` that was updated by this mutation.
   */
  recipe: UpdateRecipe_updateRecipeById_recipe | null;
}

export interface UpdateRecipe {
  /**
   * Updates a single `Recipe` using a unique key and a patch.
   */
  updateRecipeById: UpdateRecipe_updateRecipeById | null;
}

export interface UpdateRecipeVariables {
  recipePatch: RecipePatch;
  id: number;
}
