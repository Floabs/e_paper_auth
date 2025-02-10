// src/backend/index.ts
import express, { Request, Response } from "express"
import session from "express-session"
import { v4 as uuidv4 } from "uuid"
// If you're on Node 18+, fetch is globally available otherwise install node-fetch@3
import { config } from "./config" // Ensure config.displayControllerURL is defined
import { QRCode } from "../api/api" // Interface: { qrCode: string }

const app = express()
const port = 4200

app.use(express.json())

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    const hello = {
        greeting: "I am the backend"
    }
    res.send(hello)
})
// GET endpoint at "/flo" returns a custom JSON greeting with an extra header
app.get("/flo", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("x-flo-was-here", "Florian")
    const hello = { greeting: "hello, Flo!" }
    res.send(hello)
})

// Set up session middleware (use a persistent store in production)
app.use(
    session({
        secret: "yourSecretKeyHere", // Replace with a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set secure: true if using HTTPS in production
    })
)

/**
 * POST /api/initial-scan
 * - Receives the initial token from the mobile app (from scanning the initial QR code).
 * - Stores the initial token in the session.
 * - Generates a unique validation token and sets session.stage to "awaitingValidation".
 * - Sends a validation QR code payload (as a string) to the controller (embedded device).
 */
app.post("/api/initial-scan", async (req: Request res: Response) => {
    const { token: initialToken } = req.body
    if (!initialToken) {
        return res.status(401).json({ error: "Missing initial token" })
    }

    // Store the initial token in the session
    req.session.initialToken = initialToken

    // Generate a validation token using uuidv4
    const validationToken = uuidv4()
    req.session.validationToken = validationToken
    req.session.stage = "awaitingValidation"

    // Create the validation QR payload (a simple string your controller converts it into a QR code)
    const code: QRCode = {
        qrCode: `QR-VALID-${validationToken}-RQ`
    }

    console.log("Generated validation QR payload:", code.qrCode)

    // Send the validation payload to the controller (embedded device)
    const controllerResponse = await sendQRToController(code)
    console.log("Controller response status:", controllerResponse.status)

    res.status(200).json({ message: "Initial scan processed. Await validation scan." })
})

/**
 * POST /api/validate-scan
 * - Receives the validation token from the mobile app (from scanning the validation QR code).
 * - Compares it with the token stored in the session.
 * - If valid, updates session.stage to "validated" and simulates unlocking the door.
 */
app.post("/api/validate-scan", async (req: Request, res: Response) => {
    const { token: scannedToken } = req.body
    if (!scannedToken) {
        res.status(400)
        res.send({ error: "Missing validation token" })
        return
    }
    if (!req.session || req.session.stage !== "awaitingValidation") {
        res.status(400)
        res.send({ error: "Session not in validation stage" })
        return
    }

    const prefix = "QR-VALID-"
    const suffix = "-RQ"

    if (scannedToken.startsWith(prefix) && scannedToken.endsWith(suffix)) {
        const extractedToken = scannedToken.substring(prefix.length, scannedToken.length - suffix.length)
        if (extractedToken === req.session.validationToken) {
            req.session.stage = "validated"
            console.log("Validation successful, door unlocking...")
            await unlockDoor()
            res.send({ message: "Validation successful, door unlocked." })
            return
        } else {
            res.status(403)
            res.send({ error: "Validation token mismatch" })
            return
        }
    } else {
        res.status(401)
        res.send({ error: "Invalid token format" })
    }
})

async function unlockDoor() {
    const url = `${config.displayControllerURL}/unlock`
    console.log("Sending unlock command to controller at", url)
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "unlock" })
    })
    console.log("Unlock command response status:", response.status)
}

// POST endpoint at "/verify"
// This endpoint reads an authorization header, logs the token, creates a QR code payload, and sends it to the controller.
app.post("/verify", async (req: Request, res: Response) => {
    const body = req.body
    console.log("backend: received body", body)

    const authHeader = req.headers.authorization
    if (authHeader) {
        const accessToken = authHeader.replace("Bearer ", "")
        console.log("credentials received:", accessToken)
        // TODO: Here you would normally verify the bearer token and perform additional actions.

        // Create a QR code payload using the access token
        const code: QRCode = {
            qrCode: `QR---${accessToken}--RQ`
        }

        // Send the QR code payload to the controller
        const qrResponse = await sendQRToController(code)
        console.log("Controller responded with status:", qrResponse.status)

        res.status(200).json({ message: "Verification processed, QR code sent." })
    } else {
        res.status(401).json({ error: "No authorization header provided" })
    }
})

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})


/**
 * sendQRToController:
 * Sends a PUT request with the QR code payload to the controller (embedded device).
 */
async function sendQRToController(code: QRCode) {
    const url = `${config.displayControllerURL}/code`
    const body = JSON.stringify(code)
    console.log("PUT to", url, "with body:", body)

    const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body
    })
    console.log("Controller response is", response.status)
    return response
}
