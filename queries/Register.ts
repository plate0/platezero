/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RegisterUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_registerUser_user {
  __typename: "User";
  username: string;
}

export interface Register_registerUser {
  __typename: "RegisterUserPayload";
  user: Register_registerUser_user | null;
}

export interface Register {
  /**
   * Registers a user and creates an account in PlateZero.
   */
  registerUser: Register_registerUser | null;
}

export interface RegisterVariables {
  input: RegisterUserInput;
}
