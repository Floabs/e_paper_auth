[User]
   │
   ▼
[Mobile App]
   │   (1. Scans QR code displayed on Embedded Device)
   ▼
[Central Server/Backend] ←──────── (2. Receives authentication token from Mobile App)
   │
   │ (3. Queries User Database for credentials/permissions)
   ▼
[User Database]
   │
   │ (Returns validation info)
   ▼
[Central Server/Backend]
   │
   │ (4. Sends unlock command to Embedded Device)
   ▼
[Embedded Device]
   │
   │ (Activates door unlock)
   ▼
[Door Lock Mechanism]
   │
   │ (5. Logs the access event)
   ▼
[Access Log Database]

