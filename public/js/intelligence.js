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
 * StadiumPulse Pro Intelligence Layer
 * Prediction and Smoothing Engine
 */

window.Intelligence = {
    predictions: {},
    history: {},
    
    /**
     * Predictive Engine: Forecasts crowd levels based on velocity
     * Forecast = Current + (Velocity * TimeHorizon)
     */
    predict(id, currentCrowd, timeHorizonSeconds = 120) {
        if (!this.history[id]) {
            this.history[id] = [];
        }
        
        // Add current value to history for velocity calculation
        const now = Date.now();
        this.history[id].push({ t: now, v: currentCrowd });
        
        // Keep only last 10 samples
        if (this.history[id].length > 10) this.history[id].shift();
        
        if (this.history[id].length < 2) return currentCrowd;

        const first = this.history[id][0];
        const last = this.history[id][this.history[id].length - 1];
        const dt = (last.t - first.t) / 1000; // seconds
        const dv = last.v - first.v;
        
        const velocity = dv / (dt || 1); // units per second
        const predicted = currentCrowd + (velocity * timeHorizonSeconds);
        
        const result = Math.max(0, Math.min(100, Math.round(predicted)));
        this.predictions[id] = {
            value: result,
            velocity: velocity,
            riskLevel: this.getRiskLevel(result)
        };
        
        return result;
    },

    getRiskLevel(predictedValue) {
        if (predictedValue > 85) return 'CRITICAL';
        if (predictedValue > 70) return 'HIGH';
        if (predictedValue > 50) return 'MODERATE';
        return 'LOW';
    },

    /**
     * Smoothing Engine (LERP)
     * For high-fidelity "live" movement feel
     */
    smooth(current, target, factor = 0.05) {
        return current + (target - current) * factor;
    },

    /**
     * Reroute Recommendation Logic
     */
    getRecommendation(id, predictedCrowd) {
        if (predictedCrowd > 80) {
            const reroutePercent = Math.min(60, (predictedCrowd - 75) * 4);
            return {
                action: 'REROUTE',
                percentage: `${Math.round(reroutePercent)}%`,
                reason: 'Anticipated overload detected by Pro Engine'
            };
        }
        return null;
    }
};
