// src/backend/index.ts
import express, { Request, Response } from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
// For Node 18+, fetch is globally available.
// If using an older Node version, install node-fetch@3 and import it accordingly:
// import fetch from "node-fetch";
import { config } from "./config"; // Ensure config.displayControllerURL is defined
import { QRCode } from "../api/api"; // Interface: { qrCode: string }

const app = express();
const port = 4200;

app.use(express.json());

// Set up session middleware (use a persistent store in production)
app.use(
  session({
    secret: "yourSecretKeyHere", // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS in production
  })
);

app.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send({ greeting: "I am the backend" });
});

app.get("/flo", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("x-flo-was-here", "Florian");
  res.send({ greeting: "hello, Flo!" });
});

/**
 * POST /api/initial-scan
 * - Expects an Authorization header with a bearer token.
 * - Stores the bearer token in the session.
 * - Generates a unique validation token and sets session.stage to "awaitingValidation".
 * - Constructs a payload containing ONLY the validation token,
 *   wrapped as "QR-VALID-<validationToken>-RQ", and sends it to the controller.
 */
app.post("/api/initial-scan", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Missing Authorization header" });
  } else {
    // Extract and store the bearer token in the session
    const bearerToken = authHeader.replace("Bearer ", "");
    console.log("Bearer token received:", bearerToken);
    req.session.bearerToken = bearerToken;

    // Generate a validation token using uuidv4
    const validationToken = uuidv4();
    req.session.validationToken = validationToken;
    req.session.stage = "awaitingValidation";

    // Construct a payload string that only contains the validation token
    // Format: "QR-VALID-<validationToken>-RQ"
    const payloadString = `QR-VALID-${validationToken}-RQ`;
    const code: QRCode = { qrCode: payloadString };

    console.log("Generated validation QR payload:", code.qrCode);

    // Send the validation payload to the controller (embedded device)
    const controllerResponse = await sendQRToController(code);
    console.log("Controller response status:", controllerResponse.status);

    res.status(200).json({ message: "Initial scan processed. Await validation scan." });
  }
});

/**
 * POST /api/validate-scan
 * - Receives the validation token (as a QR code string) from the mobile app.
 * - Extracts the raw token by removing the "QR-VALID-" prefix and "-RQ" suffix.
 * - Compares it with the token stored in the session.
 * - If valid, updates session.stage to "validated" and triggers the door unlock.
 */
app.post("/api/validate-scan", async (req: Request, res: Response) => {
  const { token: scannedToken } = req.body;
  if (!scannedToken) {
    res.status(400).json({ error: "Missing validation token" });
  } else if (!req.session || req.session.stage !== "awaitingValidation") {
    res.status(400).json({ error: "Session not in validation stage" });
  } else {
    const prefix = "QR-VALID-";
    const suffix = "-RQ";

    if (scannedToken.startsWith(prefix) && scannedToken.endsWith(suffix)) {
      const extractedToken = scannedToken.substring(prefix.length, scannedToken.length - suffix.length);
      if (extractedToken === req.session.validationToken) {
        req.session.stage = "validated";
        console.log("Validation successful, door unlocking...");
        await unlockDoor(); // Trigger door unlock command
        res.status(200).json({ message: "Validation successful, door unlocked." });
      } else {
        res.status(403).json({ error: "Validation token mismatch" });
      }
    } else {
      res.status(400).json({ error: "Invalid token format" });
    }
  }
});

/**
 * POST /verify
 * - Reads an authorization header, extracts the bearer token,
 *   creates a QR code payload using the bearer token (format: "QR---<accessToken>--RQ"),
 *   and sends it to the controller.
 */
app.post("/verify", async (req: Request, res: Response) => {
  const body = req.body;
  console.log("Backend received body:", body);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No authorization header provided" });
  } else {
    const accessToken = authHeader.replace("Bearer ", "");
    console.log("Credentials received:", accessToken);
    // TODO: Optionally verify the bearer token here.

    const code: QRCode = {
      qrCode: `QR---${accessToken}--RQ`
    };

    const qrResponse = await sendQRToController(code);
    console.log("Controller responded with status:", qrResponse.status);

    res.status(200).json({ message: "Verification processed, QR code sent." });
  }
});

/**
 * Function: unlockDoor
 * Sends a POST request to the controller's /unlock endpoint to unlock the door.
 */
async function unlockDoor(): Promise<void> {
  const url = `${config.displayControllerURL}/unlock`;
  console.log("Sending unlock command to controller at", url);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "unlock" })
  });
  console.log("Unlock command response status:", response.status);
}

/**
 * Function: sendQRToController
 * Sends a PUT request with the QR code payload to the controller (embedded device).
 */
async function sendQRToController(code: QRCode) {
  const url = `${config.displayControllerURL}/code`;
  const body = JSON.stringify(code);
  console.log("PUT to", url, "with body:", body);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });
  console.log("Controller response is", response.status);
  return response;
}

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
