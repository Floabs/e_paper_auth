// controller.ts (for the embedded device)
import express from "express";
import { QRCode } from "../api/api";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const hello = { greeting: "I am the controller" };
  res.send(hello);
});

app.put("/code", (req, res) => {
  const code = req.body as QRCode;
  console.log("Received QR code payload:", code);
  // Here, implement the logic to update the e-paper display with the new QR code.
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Controller listening on port ${port}`);
});
