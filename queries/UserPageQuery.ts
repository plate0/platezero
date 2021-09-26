/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserPageQuery
// ====================================================

export interface UserPageQuery_userByUsername_recipesByUserId_edges_node {
  __typename: "Recipe";
  title: string;
  slug: string;
  description: string | null;
}

export interface UserPageQuery_userByUsername_recipesByUserId_edges {
  __typename: "RecipesEdge";
  /**
   * The `Recipe` at the end of the edge.
   */
  node: UserPageQuery_userByUsername_recipesByUserId_edges_node | null;
}

export interface UserPageQuery_userByUsername_recipesByUserId {
  __typename: "RecipesConnection";
  /**
   * A list of edges which contains the `Recipe` and cursor to aid in pagination.
   */
  edges: UserPageQuery_userByUsername_recipesByUserId_edges[];
}

export interface UserPageQuery_userByUsername {
  __typename: "User";
  username: string;
  /**
   * Reads and enables pagination through a set of `Recipe`.
   */
  recipesByUserId: UserPageQuery_userByUsername_recipesByUserId;
}

export interface UserPageQuery {
  userByUsername: UserPageQuery_userByUsername | null;
}

export interface UserPageQueryVariables {
  username: string;
}
