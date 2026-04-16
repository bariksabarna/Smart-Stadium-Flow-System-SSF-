import { addSystemLog } from './ui.js';
import { updateSystemState, stadiumState } from './state.js';
import { startSimulation, resetDemo } from './simulations.js';

/**
 * StadiumPulse Pro Main Entry Point
 */

window.addEventListener('load', () => {
    console.log('StadiumPulse Pro | Operational');

    // Greeting log
    setTimeout(() => {
        addSystemLog('STADIUMPULSE_PRO_CORE: ALL MODULES NOMINAL', 'sys');
        addSystemLog('INTELLIGENCE_ENGINE: READY_FOR_FORECASTING', 'sys');
    }, 1000);

    // Natural Crowd Fluctuation Simulation
    setInterval(() => {
        fluctuateProCrowd();
    }, 4500);
});

/**
 * Exposing simulation controls to window for HTML event handlers
 * This maintains compatibility with the existing index.html onClick events
 */
window.startSimulation = startSimulation;
window.resetDemo = resetDemo;

function fluctuateProCrowd() {
    const gateIds = Object.keys(stadiumState.gates);
    const randomGateId = gateIds[Math.floor(Math.random() * gateIds.length)];
    const gate = stadiumState.gates[randomGateId];

    // Only jitter if not in a high-density state
    if (gate.targetCrowd < 90) {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4 jitter
        const newTarget = Math.max(5, Math.min(100, gate.targetCrowd + delta));

        updateSystemState({
            gates: {
                [randomGateId]: { crowd: newTarget },
            },
        });
    }
}
