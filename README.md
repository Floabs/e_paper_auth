# e_paper_auth
User Authentification using e_paper and q_r codes

### Objective
Replace traditional card-based gym access with a secure, QR-code–driven system using an e-paper display, a mobile app, and a minimal embedded hardware setup (e.g., a Raspberry Pi per studio). The system will:

- Display a dynamic QR code at the door.
- Allow users (via a mobile app) to scan the QR code, authenticate, and request door unlocking.
- Implement a two-step QR code verification to reduce spoofing (e.g., screenshot sharing).
- Log entries and track who is inside the facility.

---

# Key Components & Technologies

## Central Server/Backend
- Manages user data, authentication, and access logs.
- Generates dynamic QR codes and handles token-based access requests.
- Provides API endpoints (e.g., REST or MQTT-based) for communication with mobile apps and embedded devices.

## Embedded Device (Raspberry Pi/Arduino)
- Controls the e-paper display and the door lock mechanism.
- Communicates with the central server to fetch and update QR codes.
- Manages local fail-safes and status monitoring.

## E-Paper Display
- Displays the initial QR code and updates it to a “verification” QR code after the first scan.
- Chosen for its low power consumption and good outdoor/ambient light readability.

## Mobile App
- Allows users to scan the QR code.
- Sends an access request (including a secure token, such as a JWT or similar) to the server.
- Guides users through the two-step QR scanning process (initial scan and verification scan).

## Door Lock Mechanism
- The physical mechanism that is activated to unlock the door when authentication is successful.
- Interfaced via the Raspberry Pi/Arduino (through relays or similar actuators).

---

# Project Phases

## Phase 1: Requirements & Research

### Define Functional Requirements
- User registration and management (linked with the fitness center’s existing system).
- Secure access request flow with token-based authentication.
- Dynamic QR code generation and real-time updates.
- Two-step verification: initial QR scan triggers a new code that must be scanned within a set time (e.g., 5 seconds).
- Logging of access events (who and when).

### Define Non-Functional Requirements
- Security (protection against replay attacks, screenshot spoofing, etc.).
- Reliability (24/7 operation with minimal downtime).
- Scalability (support for multiple studios and easy remote updates).

### Research & Evaluate
- **Hardware options:** Best Raspberry Pi model for power, connectivity, and cost.
- **E-paper display compatibility and integration.**
- **Communication protocols:** HTTPS for secure API calls, MQTT for real-time messaging.
- **Token frameworks:** JWT or another secure mechanism.

## Phase 2: System Architecture & Design

### Create System Diagrams
- **Component Diagram:** Illustrates interactions between the server, embedded device, mobile app, and door lock.
- **Data Flow Diagram:** Maps the flow from user scan → token validation → QR code update → door unlock.

### Define APIs & Protocols
#### API endpoints for:
- Fetching the initial QR code.
- Submitting the first scan (and triggering QR code update).
- Submitting the second (verification) scan.
- Logging access events.

#### Communication Protocols:
- Secure WebSockets or MQTT for low latency between Raspberry Pi and the server.

### Security Considerations
- Each access request is tied to a time-limited token.
- Encrypt all communications (TLS/SSL).
- Implement rate limiting and logging for suspicious activities.

## Phase 3: Hardware Prototyping & Setup

### Hardware Assembly
- Set up a Raspberry Pi (or Arduino) with the e-paper display.
- Interface the Raspberry Pi with the door lock (using relays or similar drivers).

### Preliminary Testing
- Test the e-paper display for refresh rate and clarity.
- Verify that the embedded device can reliably communicate with the server.
- Simulate door lock control via the Raspberry Pi.

## Phase 4: Software Development

### Embedded Device Software
- Fetch and update the QR code from the server.
- Display the QR code on the e-paper display.
- Handle local logging and status updates.
- Listen for commands (e.g., “unlock door”) and control the door lock.

### Server-Side Development
- Implement API endpoints for QR code generation, token validation, and access logging.
- Develop logic for:
  - Issuing the initial QR code.
  - Changing the code to a “verification” state upon first scan.
  - Enforcing a time limit on the verification scan.
- Integrate with the fitness center’s existing user management system.

### Mobile App Development
- Authenticate users.
- Use the camera to scan QR codes.
- Communicate securely with the server to submit open requests.
- Provide real-time feedback (e.g., “please scan the verification code” and “door unlocked”).

## Phase 5: Testing & Iteration

### Unit & Integration Testing
- Test individual components (e.g., QR code generation, token validation).
- End-to-end testing of the full access flow (initial scan → verification scan → door unlock).

### User Testing
- Validate the timing for the second scan—experiment with the time window to balance security and usability.
- Gather feedback from fitness center staff and users.

### Security Testing
- Simulate replay attacks or attempts to use screenshots.
- Review all communication for encryption and potential vulnerabilities.

## Phase 6: Deployment & Maintenance

### Deployment Strategy
- Roll out a pilot installation in one studio to monitor performance.
- Gradually scale to other locations once reliability and security are confirmed.

### Remote Management & Updates
- Develop mechanisms for remote firmware updates on the Raspberry Pi.
- Implement centralized logging and monitoring dashboards.

### Maintenance Plan
- Schedule regular security audits.
- Prepare documentation for troubleshooting and support.
- Establish a process for handling hardware failures or connectivity issues.

## Phase 7: Documentation & Training

### Documentation
- Detailed technical documentation covering hardware setup, software architecture, API usage, and troubleshooting.
- User guides for the mobile app and instructions for fitness center staff.

### Training
- Train staff on the operational procedures.
- Provide FAQs and support channels for end-users.

---

# Additional Suggestions

### Fallback Mechanisms
- In case of connectivity issues, consider local caching of QR codes or a backup unlocking method (e.g., a manual override code).

### Security Enhancements
- Evaluate additional layers of security such as Bluetooth Low Energy (BLE) proximity checks if feasible.

### Scalability
- Design the server infrastructure to handle multiple studios and concurrent access requests efficiently.
- Consider cloud-based services if needed.

### User Experience
- Ensure the mobile app is intuitive.
- Consider adding features like a “recent activity” log for users to see their own access history.

### Compliance
- Ensure the solution complies with relevant data protection laws (e.g., GDPR), especially since it involves personal access data.

---

# Next Steps

### Validate Hardware & Software Choices
- Confirm the compatibility of the Raspberry Pi and e-paper display setup.
- Outline the communication method between the embedded device and the server.

### Prototype Development
- Build a basic prototype covering the QR code display, server communication, and door lock control.
- Develop a simple mobile app module to test QR scanning and access requests.

### Stakeholder Feedback
- Present the prototype and workflow to the fitness center’s management.
- Collect feedback and adjust the design accordingly.

### Iterative Improvement
- Enhance the security model and refine the timing for the second scan based on real-world testing.
- Expand the feature set as needed based on user and staff feedback.
