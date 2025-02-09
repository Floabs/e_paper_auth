/*console.log("hello world!")

import express, { Request, Response, NextFunction } from "express"
import { Credentials } from "./credentials"
import { QRCode } from "../api/api"
import { config } from "./config"
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
app.get("/flo", floResponse)

app.post("/verify", async (request, response) => {
    const body = request.body
    console.log("backend: ignore body", body)
    const authHeader = request.headers.authorization
    if (authHeader) {
        const accessToken = authHeader.replace("Bearer ", "")
        console.log("credentials received", accessToken)
        console.log("todo: verify bearer token, open a transaction")
        const code: QRCode = {
            qrCode: `QR---${accessToken}--RQ`
        }
        const qrResponse = await sendQRToController(code)
        response.status(200)
    } else {
        response.status(401)
    }
    response.send()
})
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})
function floResponse(req: Request, res: Response) {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("x-flo-was-here", "Florian")
    const hello = {
        greeting: "hello, Flo!"
    }
    res.send(hello)
}


async function sendQRToController(code: QRCode) {
    const url = `${config.displayControllerURL}/code`
    const body = JSON.stringify(code)
    console.log("PUT to", url, "body: ", body)
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    console.log("controller response is", response)
    return response
}

*/