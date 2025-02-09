%% Component Diagram for Keyfit: QR Code-Based Access Control System
graph LR
    subgraph "Keyfit System Components"
        MA[Mobile App]
        CS[Central Server/Backend]
        ED[Embedded Device<br/>(with E-Paper Display)]
        DL[Door Lock Mechanism]
        AL[Access Log Database]
    end

    %% Relationships between components
    MA -- "Scans QR Code & Sends authentication request" --> CS
    CS -- "Generates dynamic QR code" --> ED
    ED -- "Displays QR code on E-paper" --> MA
    CS -- "Validates token & issues command" --> ED
    ED -- "Activates door unlock" --> DL
    CS -- "Logs access events" --> AL

Explanation:
Mobile App (MA): The user's mobile application scans the QR code shown on the e-paper display and sends an authentication request (token) to the central server.
Central Server/Backend (CS): Manages user data, generates dynamic QR codes, validates tokens, sends commands to unlock the door, and logs all access events.
Embedded Device (ED): Equipped with an e-paper display that shows the QR code and interfaces with the door lock mechanism.
Door Lock Mechanism (DL): The physical device that unlocks when the embedded device receives the appropriate command from the server.
Access Log Database (AL): Stores all access events for audit and monitoring purposes.
