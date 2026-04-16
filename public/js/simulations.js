import { updateSystemState, stadiumState } from './state.js';
import { addSystemLog } from './ui.js';
import { Intelligence } from './intelligence.js';

/**
 * StadiumPulse Pro Simulation Scenarios
 * Used for stress tests and operational drills
 */

export const startSimulation = (type) => {
    addSystemLog(`EXEC_SCENARIO: ${type.toUpperCase()}`, 'action');

    switch (type) {
    case 'halftime':
        simulateHalftimePro();
        break;
    case 'entryMatch':
        simulateEntrySurgePro();
        break;
    case 'spikeGate4':
        simulateGateSpikePro('gate4');
        break;
    case 'predictiveSpike':
        simulatePredictiveSpike();
        break;
    default:
        addSystemLog(`UNKNOWN_SCENARIO: ${type}`, 'sys');
    }
};

function simulateHalftimePro() {
    updateSystemState({
        zones: {
            food_court_a: { crowd: 95 },
            food_court_b: { crowd: 98 },
            north_concourse: { crowd: 85 },
            south_concourse: { crowd: 88 },
        },
        totalCrowd: 45200,
    });

    stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'critical',
        title: 'OVERLOAD: FOOD_ZONE_B',
        body: 'Critical density detected. Predicted duration: 15 mins. Automated rerouting suggested.',
        time: 'JUST NOW',
    });
}

function simulateEntrySurgePro() {
    updateSystemState({
        gates: {
            gate1: { crowd: 75 },
            gate2: { crowd: 82 },
            gate3: { crowd: 78 },
            gate4: { crowd: 95 },
        },
    });

    stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'warning',
        title: 'SECTOR_INFLOW_ALARM',
        body: 'Velocity at West Gate exceeding threshold. Processing lag identified.',
        time: 'JUST NOW',
    });
}

function simulateGateSpikePro(gateId) {
    updateSystemState({
        gates: {
            [gateId]: { crowd: 100 },
        },
    });

    stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'critical',
        title: `GATE_LOCKDOWN: ${gateId.toUpperCase()}`,
        body: 'Safety violation risk. Recommending immediate 100% redirection to nearest sector.',
        time: 'JUST NOW',
    });
}

/**
 * Pro Predictive Scenario
 * Gradually increases crowd to test the forecasting engine's accuracy
 */
function simulatePredictiveSpike() {
    addSystemLog('STRESS_TEST: GRADUAL_INFLOW_ACCELERATION', 'sys');

    let current = 40;
    const interval = setInterval(() => {
        current += 5;
        updateSystemState({
            gates: { gate2: { crowd: current } },
        });

        if (current >= 100) {
            clearInterval(interval);
            addSystemLog('STRESS_TEST_COMPLETE: THRESHOLD_REACHED.', 'sys');
        }
    }, 1000);

    // After 3.5 seconds, verify the prediction engine detected the velocity
    setTimeout(() => {
        const pred = Intelligence.predictions['gate_gate2'] || { value: 0 };
        if (pred.value > 80) {
            stadiumState.alerts.unshift({
                id: Date.now(),
                type: 'prediction',
                title: 'PREDICTIVE_ALERT: GATE_2',
                body: 'Forecasting 90%+ load in < 90s based on velocity of +5%/s.',
                time: 'JUST NOW',
            });
        }
    }, 3500);
}

export const resetDemo = () => {
    addSystemLog('SYS_CMD: FULL_RECONSTRUCTION...', 'sys');
    setTimeout(() => location.reload(), 800);
};
