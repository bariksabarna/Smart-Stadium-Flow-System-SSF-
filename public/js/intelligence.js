/**
 * StadiumPulse Pro Intelligence Layer
 * Advanced Prediction and Smoothing Engine for real-time crowd dynamics.
 *
 * @author Sabarna Barik
 */

export const Intelligence = {
    /** @type {Object<string, {value: number, velocity: number, riskLevel: string}>} */
    predictions: {},
    /** @type {Object<string, Array<{t: number, v: number}>>} */
    history: {},

    /**
     * Predictive Engine: Forecasts crowd levels based on linear regression of velocity.
     * Calculation: Forecast = Current + (Velocity * TimeHorizon)
     *
     * @param {string} id - The unique identifier for the monitored component (gate/zone)
     * @param {number} currentCrowd - Current occupancy percentage (0-100)
     * @param {number} timeHorizonSeconds - Future projection window in seconds (default 120s)
     * @returns {number} Predicted crowd level, clamped to valid percentage bounds (0-100)
     */
    predict(id, currentCrowd, timeHorizonSeconds = 120) {
        if (!this.history[id]) {
            this.history[id] = [];
        }

        const now = Date.now();
        this.history[id].push({ t: now, v: currentCrowd });

        // Retain only valid sliding window for velocity calculation
        if (this.history[id].length > 10) this.history[id].shift();

        if (this.history[id].length < 2) return currentCrowd;

        const first = this.history[id][0];
        const last = this.history[id][this.history[id].length - 1];
        const dt = (last.t - first.t) / 1000;
        const dv = last.v - first.v;

        // Guard against zero-division or near-instant telemetry spikes
        const velocity = dt > 0.05 ? dv / dt : 0;
        const predicted = currentCrowd + velocity * timeHorizonSeconds;

        const result = Math.max(0, Math.min(100, Math.round(predicted)));
        this.predictions[id] = {
            value: result,
            velocity: velocity,
            riskLevel: this.getRiskLevel(result),
        };

        return result;
    },

    /**
     * Heuristic Risk Classifier
     * Categorizes occupancy metrics into operational risk buckets.
     *
     * @param {number} value - Crowd percentage value to evaluate
     * @returns {'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'} The risk category
     */
    getRiskLevel(value) {
        if (value >= 85) return 'CRITICAL';
        if (value >= 70) return 'HIGH';
        if (value >= 50) return 'MODERATE';
        return 'LOW';
    },

    /**
     * Smoothing Engine (LERP)
     * Provides Linear Interpolation for fluid UI transitions between discrete telemetry updates.
     *
     * @param {number} current - Current visual/rendered value
     * @param {number} target - Actual logic-tier target value
     * @param {number} factor - Interpolation speed constant (default 0.05)
     * @returns {number} The next intermediate value for rendering
     */
    smooth(current, target, factor = 0.05) {
        if (isNaN(current)) return target;
        return current + (target - current) * factor;
    },

    /**
     * Operational Decision Support: Routing Recommendation Engine
     * Generates mitigation strategies if predicted loads exceed safe thresholds.
     *
     * @param {string} id - Component ID triggering the engine check
     * @param {number} predictedCrowd - Predicted occupancy value from the forecast
     * @returns {{action: string, percentage: string, reason: string} | null} Strategy recommendation or null
     */
    getRecommendation(id, predictedCrowd) {
        if (predictedCrowd > 80) {
            const reroutePercent = Math.min(60, (predictedCrowd - 75) * 4);
            return {
                action: 'REROUTE',
                percentage: `${Math.round(reroutePercent)}%`,
                reason: `Predictive Engine detected ${predictedCrowd}% projected load at ${id}`,
            };
        }
        return null;
    },
};
