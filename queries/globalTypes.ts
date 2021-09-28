/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * All input for the `authenticate` mutation.
 */
export interface AuthenticateInput {
  clientMutationId?: string | null;
  username: string;
  password: string;
}

/**
 * All input for the `createRecipe` mutation.
 */
export interface CreateRecipeInput {
  clientMutationId?: string | null;
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  procedure?: string | null;
  ingredients?: string | null;
  yield?: string | null;
  duration?: number | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  sourceAuthor?: string | null;
  sourceTitle?: string | null;
  sourceIsbn?: string | null;
}

/**
 * Represents an update to a `Recipe`. Fields that are set will be updated.
 */
export interface RecipePatch {
  id?: number | null;
  userId?: number | null;
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  procedure?: string | null;
  ingredients?: string | null;
  yield?: string | null;
  duration?: number | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  sourceAuthor?: string | null;
  sourceTitle?: string | null;
  sourceIsbn?: string | null;
  createdAt?: PZDatetime | null;
  updatedAt?: PZDatetime | null;
  deletedAt?: PZDatetime | null;
}

/**
 * All input for the `registerUser` mutation.
 */
export interface RegisterUserInput {
  clientMutationId?: string | null;
  username: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
