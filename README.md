<!-- 
Copyright © Sabarna Barik 

This code is open-source for **educational and non-commercial purposes only**.

You may:
- Read, study, and learn from this code.
- Modify or experiment with it for personal learning.

You may NOT:
- Claim this code as your own.
- Use this code in commercial projects or for profit without written permission.
- Distribute this code as your own work.

If you use or adapt this code, you **must give credit** to the original author: Sabarna Barik
For commercial use or special permissions, contact: sabarnabarik@gmail.com

# Copyright © 2026 Sabarna Barik
# Non-commercial use only. Credit required if used.

License:
This project is open-source for learning only.
Commercial use is prohibited.
Credit is required if you use any part of this code.
-->

# 🏟️ StadiumPulse Pro | Advanced Operations Dashboard

> **This project was fully VIBE-CODED ⚡ and built as part of the PROMPTWARS challenge.**

## 🏁 PROJECT OVERVIEW
**StadiumPulse Pro** is a high-end, production-grade operations control system designed for large-scale sporting venues. It solves the critical challenge of real-time crowd management, safety monitoring, and predictive congestion control.

Unlike simple dashboards, this was built to feel like a real-world **Control Tower** interface used by stadium authorities to ensure attendee safety and operational efficiency during high-pressure events.

## 🧠 CORE INTELLIGENCE
The platform is powered by a rule-based **Predictive Intelligence Engine** that:
- Monitors inflow/outflow velocity at every sector.
- Forecasts congestion levels at a `T+120s` horizon.
- Triggers preemptive alerts for "Predicted Overloads".
- Suggests rerouting percentages (e.g., "Reroute 40% of traffic") to balance gate load.

## 🚀 KEY FEATURES
- **Control Room Layout**: A professional 3-column "Control Tower" interface.
- **Heatmap Intelligence**: Interactive SVG map with pulsing "Critical Zone" indicators.
- **Smoothing Logic**: High-fidelity LERP algorithms for a realistic "Live" data feel.
- **CCTV Monitoring**: Simulated camera viewports for immersive operational oversight.
- **Simulation Suite**: Includes stress-tests for "Halftime Surge", "Match Entry", and "Predictive Spikes".

## 🛠️ TECH STACK
- **Frontend**: Vanilla JS (Modular Logic), CSS3 (Modern Control Tower UI), HTML5.
- **Backend**: Node.js / Express (Asset Serving).
- **Deployment**: containerized via Docker and deployed to **Google Cloud Run**.

## 📦 LOCAL EXECUTION
```bash
npm install
npm start
```
The application will be served at `http://localhost:8080`.

## ☁️ CLOUD DEPLOYMENT
Deployed to Google Cloud Run using:
```bash
gcloud run deploy stadiumpulse --source . --project project_id --region us-central1 --allow-unauthenticated
```

---
**Created by Sabarna Barik**  
*Part of the PromptWars Challenge 2026*
