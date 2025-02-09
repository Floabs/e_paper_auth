// src/backend/index.ts
import express, { Request, Response } from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config"; // Ensure config.displayControllerURL is defined
import { QRCode } from "../api/api"; // Your interface: { qrCode: string }

const app = express();
const port = 4200;

app.use(express.json());

// Set up session middleware (for production, use a persistent session store)
app.use(
  session({
    secret: "yourSecretKeyHere", // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true when using HTTPS
  })
);

// Basic GET endpoint at "/"
app.get("/", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  const hello = {
    greeting: "I am the backend"
  };
  res.send(hello);
});

// GET endpoint at "/flo"
app.get("/flo", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("x-flo-was-here", "Florian");
  const hello = {
    greeting: "hello, Flo!"
  };
  res.send(hello);
});

// POST endpoint at "/verify"
// This endpoint reads an authorization header, logs the token, creates a QR code payload, and sends it to the controller.
app.post("/verify", async (req: Request, res: Response) => {
  const body = req.body;
  console.log("backend: received body", body);

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.replace("Bearer ", "");
    console.log("credentials received:", accessToken);

    // TODO: Here you would normally verify the bearer token and perform additional actions.

    // Create a QR code payload using the access token
    const code: QRCode = {
      qrCode: `QR---${accessToken}--RQ`
    };

    // Send the QR code payload to the controller
    const qrResponse = await sendQRToController(code);
    console.log("Controller responded with status:", qrResponse.status);

    res.status(200).json({ message: "Verification processed, QR code sent." });
  } else {
    res.status(401).json({ error: "No authorization header provided" });
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

/**
 * sendQRToController:
 * Sends a PUT request with the QR code payload to the controller (embedded device).
 */
async function sendQRToController(code: QRCode) {
  const url = `${config.displayControllerURL}/code`;
  const body = JSON.stringify(code);
  console.log("PUT to", url, "with body:", body);

  // In Node 18+, fetch is globally available. If not, install node-fetch@3.
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });
  console.log("Controller response is", response.status);
  return response;
}
