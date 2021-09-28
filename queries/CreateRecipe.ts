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
  recipe: CreateRecipe_createRecipe_recipe | null;
}

export interface CreateRecipe {
  createRecipe: CreateRecipe_createRecipe | null;
}

export interface CreateRecipeVariables {
  input: CreateRecipeInput;
}
