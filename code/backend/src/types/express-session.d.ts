import "express-session";

declare module "express-session" {
  interface SessionData {
    initialToken?: string;
    validationToken?: string;
    stage?: "awaitingValidation" | "validated";
  }
  
export { SessionData }
}

