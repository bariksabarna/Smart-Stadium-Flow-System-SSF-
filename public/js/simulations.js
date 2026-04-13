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
 * StadiumPulse Pro Simulation Scenarios
 */

window.startSimulation = (type) => {
    window.addSystemLog(`EXEC_SCENARIO: ${type.toUpperCase()}`, 'action');
    
    switch(type) {
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
    }
};

function simulateHalftimePro() {
    window.updateSystemState({
        zones: {
            food_court_a: { crowd: 95 },
            food_court_b: { crowd: 98 },
            north_concourse: { crowd: 85 },
            south_concourse: { crowd: 88 }
        },
        totalCrowd: 45200
    });
    
    window.stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'critical',
        title: 'OVERLOAD: FOOD_ZONE_B',
        body: 'Critical density detected. Predicted duration: 15 mins. Automated rerouting suggested.',
        time: 'JUST NOW'
    });
}

function simulateEntrySurgePro() {
    window.updateSystemState({
        gates: {
            gate1: { crowd: 75 },
            gate2: { crowd: 82 },
            gate3: { crowd: 78 },
            gate4: { crowd: 95 }
        }
    });
    
    window.stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'warning',
        title: 'SECTOR_INFLOW_ALARM',
        body: 'Velocity at West Gate exceeding threshold. Processing lag identified.',
        time: 'JUST NOW'
    });
}

function simulateGateSpikePro(gateId) {
    const gate = window.stadiumState.gates[gateId];
    window.updateSystemState({
        gates: {
            [gateId]: { crowd: 100 }
        }
    });
    
    window.stadiumState.alerts.unshift({
        id: Date.now(),
        type: 'critical',
        title: `GATE_LOCKDOWN: ${gateId.toUpperCase()}`,
        body: 'Safety violation risk. Recommending immediate 100% redirection to nearest sector.',
        time: 'JUST NOW'
    });
}

/**
 * Pro Predictive Scenario
 * Gradually increases crowd to test the forecasting engine
 */
function simulatePredictiveSpike() {
    window.addSystemLog('STRESS_TEST: GRADUAL_INFLOW_ACCELERATION', 'sys');
    
    let current = 40;
    const interval = setInterval(() => {
        current += 5;
        window.updateSystemState({
            gates: { gate2: { crowd: current } }
        });
        
        if (current >= 100) {
            clearInterval(interval);
            window.addSystemLog('STRESS_TEST_COMPLETE: THRESHOLD_REACHED.', 'sys');
        }
    }, 1000);

    // After 3 seconds, the prediction engine should detect the high velocity
    setTimeout(() => {
        const pred = window.Intelligence.predictions['gate_gate2'] || { value: 0 };
        if (pred.value > 80) {
            window.stadiumState.alerts.unshift({
                id: Date.now(),
                type: 'prediction',
                title: 'PREDICTIVE_ALERT: GATE_2',
                body: `Forecasting 90%+ load in < 90s based on current velocity of +5%/s.`,
                time: 'JUST NOW'
            });
        }
    }, 3500);
}

window.resetDemo = () => {
    window.addSystemLog('SYS_CMD: FULL_RECONSTRUCTION...', 'sys');
    setTimeout(() => location.reload(), 800);
};
