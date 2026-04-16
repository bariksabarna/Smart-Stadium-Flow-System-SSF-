import { Intelligence } from './intelligence.js';

/**
 * StadiumPulse Pro State Management
 * Centralized store for all stadium metrics
 */

export const stadiumState = {
    event: {
        name: 'StadiumPulse Pro Dashboard',
        status: 'LIVE MONITORING',
        totalCrowd: 42850,
        startTime: Date.now(),
    },

    // Core data with current and target values for smoothing
    gates: {
        gate1: {
            id: 'gate1',
            name: 'Gate 1 (North)',
            crowd: 35,
            targetCrowd: 35,
            waitTime: 4,
        },
        gate2: {
            id: 'gate2',
            name: 'Gate 2 (East)',
            crowd: 20,
            targetCrowd: 20,
            waitTime: 2,
        },
        gate3: {
            id: 'gate3',
            name: 'Gate 3 (South)',
            crowd: 55,
            targetCrowd: 55,
            waitTime: 8,
        },
        gate4: {
            id: 'gate4',
            name: 'Gate 4 (West)',
            crowd: 85,
            targetCrowd: 85,
            waitTime: 22,
        },
    },

    zones: {
        north_concourse: {
            id: 'north',
            name: 'North Concourse',
            crowd: 40,
            targetCrowd: 40,
        },
        east_concourse: {
            id: 'east',
            name: 'East Concourse',
            crowd: 25,
            targetCrowd: 25,
        },
        south_concourse: {
            id: 'south',
            name: 'South Concourse',
            crowd: 60,
            targetCrowd: 60,
        },
        west_concourse: {
            id: 'west',
            name: 'West Concourse',
            crowd: 82,
            targetCrowd: 82,
        },
        food_court_a: {
            id: 'food_a',
            name: 'Food Court A',
            crowd: 45,
            targetCrowd: 45,
        },
        food_court_b: {
            id: 'food_b',
            name: 'Food Court B',
            crowd: 75,
            targetCrowd: 75,
        },
        main_arena: {
            id: 'arena',
            name: 'Main Arena',
            crowd: 90,
            targetCrowd: 90,
        },
    },

    alerts: [
        {
            id: 1,
            type: 'prediction',
            title: 'Future Overload Detected',
            body: 'Gate 4 predicted to hit 95% in 120s.',
            time: 'Now',
        },
        {
            id: 2,
            type: 'info',
            title: 'Intelligence Active',
            body: 'Predictive routing engine online.',
            time: '1m ago',
        },
    ],

    needs: {
        entry: { icon: 'door-open', recommendations: ['gate2', 'gate1'] },
        food: { icon: 'utensils', recommendations: ['food_court_a'] },
        toilet: {
            icon: 'user',
            recommendations: ['east_concourse', 'north_concourse'],
        },
        exit: { icon: 'log-out', recommendations: ['gate2', 'gate3'] },
    },
};

/**
 * Calculates estimated wait time based on crowd density
 * @param {number} crowd - Crowd percentage (0-100)
 * @returns {number} Wait time in minutes
 */
export function calculateWaitTime(crowd) {
    // Non-linear wait time logic for realism
    return Math.max(2, Math.floor(2 + Math.pow(crowd, 1.5) * 0.02));
}

/**
 * Global update trigger for state transitions
 * @param {Object} updates - State delta
 */
export function updateSystemState(updates) {
    if (updates.gates) {
        Object.keys(updates.gates).forEach((id) => {
            if (stadiumState.gates[id]) {
                stadiumState.gates[id].targetCrowd = updates.gates[id].crowd;
            }
        });
    }

    if (updates.zones) {
        Object.keys(updates.zones).forEach((id) => {
            if (stadiumState.zones[id]) {
                stadiumState.zones[id].targetCrowd = updates.zones[id].crowd;
            }
        });
    }

    if (updates.totalCrowd) {
        stadiumState.event.totalCrowd = updates.totalCrowd;
    }

    // Custom event to notify UI of logic changes
    document.dispatchEvent(
        new CustomEvent('stadiumStateChanged', { detail: updates })
    );
}

/**
 * Animation Loop for Smoothing and Real-time Predictions
 */
function updateAnimations() {
    let hasChanged = false;

    // Smooth gate values
    Object.values(stadiumState.gates).forEach((gate) => {
        if (Math.abs(gate.crowd - gate.targetCrowd) > 0.01) {
            gate.crowd = Intelligence.smooth(gate.crowd, gate.targetCrowd);
            gate.waitTime = calculateWaitTime(gate.crowd);

            // Run prediction engine concurrently
            Intelligence.predict(`gate_${gate.id}`, gate.crowd);
            hasChanged = true;
        }
    });

    // Smooth zone values
    Object.values(stadiumState.zones).forEach((zone) => {
        if (Math.abs(zone.crowd - zone.targetCrowd) > 0.01) {
            zone.crowd = Intelligence.smooth(zone.crowd, zone.targetCrowd);
            Intelligence.predict(`zone_${zone.id}`, zone.crowd);
            hasChanged = true;
        }
    });

    if (hasChanged) {
        document.dispatchEvent(new CustomEvent('stadiumVisualsUpdate'));
    }

    requestAnimationFrame(updateAnimations);
}

// Start loop only in browser environment
if (typeof window !== 'undefined') {
    requestAnimationFrame(updateAnimations);
}
