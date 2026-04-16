/**
 * StadiumPulse Pro Intelligence Layer
 * Prediction and Smoothing Engine
 */

export const Intelligence = {
    predictions: {},
    history: {},
    
    /**
     * Predictive Engine: Forecasts crowd levels based on velocity
     * Forecast = Current + (Velocity * TimeHorizon)
     * @param {string} id - The unique identifier for the gate/zone
     * @param {number} currentCrowd - Current occupancy percentage (0-100)
     * @param {number} timeHorizonSeconds - How far in the future to project (default 120s)
     * @returns {number} Predicted crowd level
     */
    predict(id, currentCrowd, timeHorizonSeconds = 120) {
        if (!this.history[id]) {
            this.history[id] = [];
        }
        
        const now = Date.now();
        this.history[id].push({ t: now, v: currentCrowd });
        
        // Keep last 10 samples for velocity calculation
        if (this.history[id].length > 10) this.history[id].shift();
        
        if (this.history[id].length < 2) return currentCrowd;

        const first = this.history[id][0];
        const last = this.history[id][this.history[id].length - 1];
        const dt = (last.t - first.t) / 1000; 
        const dv = last.v - first.v;
        
        const velocity = dv / (dt || 1); 
        const predicted = currentCrowd + (velocity * timeHorizonSeconds);
        
        const result = Math.max(0, Math.min(100, Math.round(predicted)));
        this.predictions[id] = {
            value: result,
            velocity: velocity,
            riskLevel: this.getRiskLevel(result)
        };
        
        return result;
    },

    /**
     * Determines risk category based on predicted volume
     * @param {number} value - Crowd percentage
     * @returns {string} Risk category (CRITICAL, HIGH, MODERATE, LOW)
     */
    getRiskLevel(value) {
        if (value >= 85) return 'CRITICAL';
        if (value >= 70) return 'HIGH';
        if (value >= 50) return 'MODERATE';
        return 'LOW';
    },

    /**
     * Smoothing Engine (LERP)
     * Used for fluid UI transitions
     * @param {number} current - Current visual value
     * @param {number} target - Logic target value
     * @param {number} factor - Smoothing factor
     * @returns {number} New smoothed value
     */
    smooth(current, target, factor = 0.05) {
        return current + (target - current) * factor;
    },

    /**
     * Routing Recommendation Engine
     * @param {string} id - Component ID
     * @param {number} predictedCrowd - Predicted occupancy
     * @returns {Object|null} Recommendation object or null
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
