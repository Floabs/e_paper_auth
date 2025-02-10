import "express-session";

declare module "express-session" {
  interface session {
    initialToken: string;
    validationToken: string;
    stage?: "awaitingValidation" | "validated";
  }
}

