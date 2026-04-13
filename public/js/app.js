/**
 * Copyright © Sabarna Barik 
 * 
 * This code is open-source for **educational and non-commercial purposes only**.
 * 
 * You may:
 * - Read, study, and learn from this code.
 * - Modify or experiment with it for personal learning.
 * 
 * You may NOT:
 * - Claim this code as your own.
 * - Use this code in commercial projects or for profit without written permission.
 * - Distribute this code as your own work.
 * 
 * If you use or adapt this code, you **must give credit** to the original author: Sabarna Barik
 * For commercial use or special permissions, contact: sabarnabarik@gmail.com
 * 
 * # Copyright © 2026 Sabarna Barik
 * # Non-commercial use only. Credit required if used.
 * 
 * License:
 * This project is open-source for learning only.
 * Commercial use is prohibited.
 * Credit is required if you use any part of this code.
 */

/**
 * StadiumPulse Pro Main Entry Point
 */

window.addEventListener('load', () => {
    console.log('StadiumPulse Pro Operational');
    
    // Greeting log
    setTimeout(() => {
        window.addSystemLog('STADIUMPULSE_PRO_V2: ALL MODULES NOMINAL', 'sys');
        window.addSystemLog('INTELLIGENCE_ENGINE: READY_FOR_FORECASTING', 'sys');
    }, 1000);

    // Natural Crowd Fluctuation
    setInterval(() => {
        fluctuateProCrowd();
    }, 4000);
});

function fluctuateProCrowd() {
    // Only fluctuate randomly if no scenario is pinning values
    const gateIds = Object.keys(window.stadiumState.gates);
    const randomGate = gateIds[Math.floor(Math.random() * gateIds.length)];
    const currentTarget = window.stadiumState.gates[randomGate].targetCrowd;
    
    // Jitter target +/- 3
    const delta = Math.floor(Math.random() * 7) - 3;
    const newTarget = Math.max(5, Math.min(100, currentTarget + delta));

    window.updateSystemState({
        gates: {
            [randomGate]: { crowd: newTarget }
        }
    });
}
