/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AuthenticateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_authenticate {
  __typename: "AuthenticatePayload";
  jwtToken: PZJwtToken | null;
}

export interface Login {
  /**
   * Creates a JWT token that will securely identify a user and give them certain permissions. This token expires in 7 days.
   */
  authenticate: Login_authenticate | null;
}

export interface LoginVariables {
  input: AuthenticateInput;
}
