// index.js
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Parse JSON bodies for PUT requests
app.use(express.json());

/**
 * GET /
 * A simple endpoint to verify the controller is running.
 */
app.get('/', (req, res) => {
  res.json({ greeting: "I am the controller" });
});

/**
 * PUT /code
 * Receives a JSON payload with a "qrCode" string,
 * converts it to a QR code image, saves it as "qrcode.png"
 * in the controller directory, and simulates displaying it on an e-paper.
 */
app.put('/code', async (req, res) => {
  const { qrCode } = req.body;
  if (!qrCode) {
    return res.status(400).json({ error: 'Missing qrCode in request body' });
  }
  
  console.log('Received QR code payload:', qrCode);
  
  try {
    // Generate QR code as a Data URL (PNG format)
    const qrDataUrl = await qrcode.toDataURL(qrCode);
    
    // Convert Data URL to base64 and write to file in the controller directory
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(__dirname, 'qrcode.png');
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    console.log('QR code image generated and saved as', filePath);
    
    // Here, replace this with code to display the image on your e-paper display.
    console.log('QR code is now displayed on the e-paper display.');
    
    res.sendStatus(204); // No Content
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

/**
 * GET /qrcode
 * Serves the generated "qrcode.png" image so that it can be viewed in a browser.
 */
app.get('/qrcode', (req, res) => {
  const filePath = path.join(__dirname, 'qrcode.png');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "QR code image not found" });
  }
});

/**
 * POST /unlock
 * Receives an unlock command and simulates door unlocking.
 */
app.post('/unlock', (req, res) => {
  const { command } = req.body;
  console.log('Unlock command received:', req.body);
  if (command === 'unlock') {
    // Insert hardware-specific logic to physically unlock the door.
    console.log('Door unlocked successfully.');
    res.status(200).json({ message: 'Door unlocked.' });
  } else {
    res.status(400).json({ error: 'Invalid command' });
  }
});

app.listen(port, () => {
  console.log(`Controller listening on port ${port}`);
});
