import express from "express"
import { QRCode } from "../api/api"
const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    const hello = {
        greeting: "I am the controller"
    }
    res.send(hello)
})

app.put("/code", (request, response) => {
    const code = request.body as QRCode
    console.log("code is", code)
    response.status(204)
    response.send()
})

app.listen(port, () => {
    console.log(`Controller listening on port ${port}`)
})

