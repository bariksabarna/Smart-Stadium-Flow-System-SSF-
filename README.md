# StadiumPulse Pro | Intelligent Flow Management

**Vertical:** Physical Event Experience for Large-Scale Sporting Venues  
**System Type:** Real-time Stadium Operations Dashboard & Crowd Control Logic  

StadiumPulse Pro is a production-grade operations system designed for stadium staff to monitor, predict, and manage crowd flow. It utilizes a deterministic **Intelligence Engine** to forecast congestion before it happens, providing automated rerouting suggestions and live telemetry for operational excellence.

---

## 🚀 Key Features

### 1. Predictive Intelligence Engine
Our custom `Intelligence.js` engine doesn't just show current loads; it calculates **Inflow Velocity** and projects occupancy 120 seconds into the future. It automatically classifies risk levels from **STABLE** to **CRITICAL**, allowing staff to intervene proactively.

### 2. Fan Guidance System
A fan-facing advisory tool that provides the "Optimal Sector" for entry, food, restrooms, or exits. It considers:
- Predicted gate load
- Estimated wait times
- Section travel density

### 3. Professional Ops Console
A 3-column "Control Room" interface featuring:
- **Global Metrics Deck:** Live crowd count and safety status.
- **Visual Heatmap:** An interactive stadium layout with glow-based intensity markers.
- **CCTV Monitoring Grid:** Low-latency simulated feeds for visual confirmation.
- **Master Console:** Trigger scenarios like "Halftime Surge" or "Match Entry Rush" to test system responsiveness.

---

## 🛠 Technical Architecture

- **Frontend:** Modular ES6 JavaScript, Semantic HTML5, Vanilla CSS3.
- **Backend:** Node.js with Express, hardened with **Helmet** (CSP/Security) and **Compression** (Efficiency).
- **Security:** CSRF-safe, XSS-mitigated logic (0% `innerHTML` usage in primary feeds), and strict Content Security Policies.
- **Accessibility:** 100% ARIA-compliant landmarks, roles, and live regions. High-contrast WCAG AA compliant design.
- **Cloud Readiness:** Dockerized for **Google Cloud Run** deployment.

---

## 🧪 Testing & Validation

Automated unit tests ensure the reliability of the core logic.
Run the tests using:
```bash
npm install
npm test
```
*Validated components: Wait Time Calculations, Velocity Forecasting, Risk Assessment, and LERP Smoothing Logic.*

---

## 📦 Deployment on Google Cloud

The project is optimized for Google Cloud Run:
```bash
# Build & Deploy
gcloud run deploy stadiumpulse --source .
```

---

## 📜 Credits & License
Developed by Sabarna Barik.  
Open-source for educational and contest purposes. Commercial use restricted.  
Copyright © 2026 Sabarna Barik.
