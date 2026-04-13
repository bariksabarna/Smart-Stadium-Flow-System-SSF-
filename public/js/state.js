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
 * StadiumPulse Pro State Management
 * Integrated with Predictive Intelligence
 */

window.stadiumState = {
    event: {
        name: "StadiumPulse Pro Dashboard",
        status: "LIVE MONITORING",
        totalCrowd: 42850,
        startTime: Date.now()
    },
    
    // Core data with current and target values for smoothing
    gates: {
        gate1: { name: "Gate 1 (North)", crowd: 35, targetCrowd: 35, waitTime: 4 },
        gate2: { name: "Gate 2 (East)", crowd: 20, targetCrowd: 20, waitTime: 2 },
        gate3: { name: "Gate 3 (South)", crowd: 55, targetCrowd: 55, waitTime: 8 },
        gate4: { name: "Gate 4 (West)", crowd: 85, targetCrowd: 85, waitTime: 22 }
    },
    
    zones: {
        north_concourse: { id: "north", name: "North Concourse", crowd: 40, targetCrowd: 40 },
        east_concourse: { id: "east", name: "East Concourse", crowd: 25, targetCrowd: 25 },
        south_concourse: { id: "south", name: "South Concourse", crowd: 60, targetCrowd: 60 },
        west_concourse: { id: "west", name: "West Concourse", crowd: 82, targetCrowd: 82 },
        food_court_a: { id: "food_a", name: "Food Court A", crowd: 45, targetCrowd: 45 },
        food_court_b: { id: "food_b", name: "Food Court B", crowd: 75, targetCrowd: 75 },
        main_arena: { id: "arena", name: "Main Arena", crowd: 90, targetCrowd: 90 }
    },
    
    predictions: {}, // Populated by intelligence.js
    
    alerts: [
        { id: 1, type: 'prediction', title: 'Future Overload Detected', body: 'Gate 4 predicted to hit 95% in 120s.', time: 'Now' },
        { id: 2, type: 'info', title: 'Intelligence Active', body: 'Predictive routing engine online.', time: '1m ago' }
    ],

    needs: {
        entry: { icon: 'door-open', recommendations: ['gate2', 'gate1'] },
        food: { icon: 'utensils', recommendations: ['food_court_a'] },
        toilet: { icon: 'user', recommendations: ['east_concourse', 'north_concourse'] },
        exit: { icon: 'log-out', recommendations: ['gate2', 'gate3'] }
    }
};

/**
 * Update logic for wait times based on crowd
 */
function calculateWaitTime(crowd) {
    // Non-linear wait time: base + (crowd^1.5 * multiplier)
    return Math.max(2, Math.floor(2 + (Math.pow(crowd, 1.5) * 0.02)));
}

// Global update trigger
window.updateSystemState = (updates) => {
    if (updates.gates) {
        Object.keys(updates.gates).forEach(id => {
            window.stadiumState.gates[id].targetCrowd = updates.gates[id].crowd;
        });
    }
    
    if (updates.zones) {
        Object.keys(updates.zones).forEach(id => {
            window.stadiumState.zones[id].targetCrowd = updates.zones[id].crowd;
        });
    }

    if (updates.totalCrowd) {
        window.stadiumState.event.totalCrowd = updates.totalCrowd;
    }

    // Trigger immediate UI refresh (smoothing will handle visual updates)
    const event = new CustomEvent('stadiumStateChanged', { detail: updates });
    document.dispatchEvent(event);
};

/**
 * Animation Loop for Smoothing
 */
function updateAnimations() {
    let hasChanged = false;

    // Smooth gates
    Object.keys(window.stadiumState.gates).forEach(id => {
        const gate = window.stadiumState.gates[id];
        if (Math.abs(gate.crowd - gate.targetCrowd) > 0.1) {
            gate.crowd = window.Intelligence.smooth(gate.crowd, gate.targetCrowd);
            gate.waitTime = calculateWaitTime(gate.crowd);
            
            // Run prediction
            window.Intelligence.predict(`gate_${id}`, gate.crowd);
            hasChanged = true;
        }
    });

    // Smooth zones
    Object.keys(window.stadiumState.zones).forEach(id => {
        const zone = window.stadiumState.zones[id];
        if (Math.abs(zone.crowd - zone.targetCrowd) > 0.1) {
            zone.crowd = window.Intelligence.smooth(zone.crowd, zone.targetCrowd);
            window.Intelligence.predict(`zone_${id}`, zone.crowd);
            hasChanged = true;
        }
    });

    if (hasChanged) {
        document.dispatchEvent(new CustomEvent('stadiumVisualsUpdate'));
    }

    requestAnimationFrame(updateAnimations);
}

// Start loop
requestAnimationFrame(updateAnimations);
