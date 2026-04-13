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
 * StadiumPulse Pro UI Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initProUI();
    setupProEventListeners();
});

// Listener for visual updates (triggered by smoothing loop in state.js)
document.addEventListener('stadiumVisualsUpdate', () => {
    renderProMap();
    updateProDashboard();
});

function initProUI() {
    updateProClock();
    setInterval(updateProClock, 1000);
    renderProMap();
    updateProDashboard();
}

function updateProClock() {
    const clock = document.getElementById('live-clock-pro');
    if (clock) clock.innerText = new Date().toLocaleTimeString();
}

function setupProEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-view`).classList.add('active');
        });
    });

    // Fan View Chips
    const chips = document.querySelectorAll('.pro-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            calculateProRoute();
        });
    });

    const gateSelect = document.getElementById('gate-selector-pro');
    if (gateSelect) gateSelect.addEventListener('change', calculateProRoute);
}

function updateProDashboard() {
    const state = window.stadiumState;
    
    // Total crowd with comma
    document.getElementById('total-crowd-val').innerText = Math.round(state.event.totalCrowd).toLocaleString();
    
    // Predictive Metrics Area
    const predContainer = document.getElementById('predictive-container');
    const forecast = document.getElementById('overload-forecast');
    
    // Calculate global risk based on all predictions
    const criticalZones = Object.values(window.Intelligence.predictions).filter(p => p.riskLevel === 'CRITICAL').length;
    const riskVal = document.getElementById('global-risk-val');
    if (criticalZones > 0) {
        riskVal.innerText = 'CRITICAL';
        riskVal.className = 'value danger';
    } else {
        riskVal.innerText = 'LOW';
        riskVal.className = 'value success';
    }

    // Update Gate Load List
    renderGateLoadList();
    
    // Update Alerts
    renderProAlerts();
}

function renderGateLoadList() {
    const list = document.getElementById('gate-load-list');
    const state = window.stadiumState;
    
    list.innerHTML = Object.keys(state.gates).map(id => {
        const gate = state.gates[id];
        const pred = window.Intelligence.predictions[`gate_${id}`] || { value: gate.crowd };
        const color = gate.crowd > 80 ? 'var(--pro-danger)' : (gate.crowd > 50 ? 'var(--pro-warning)' : 'var(--pro-success)');
        
        return `
            <div class="load-item">
                <div class="load-info">
                    <span>${gate.name}</span>
                    <span>${Math.round(gate.crowd)}% <small style="color:var(--text-dim)">(PRED: ${pred.value}%)</small></span>
                </div>
                <div class="load-bar-bg">
                    <div class="load-bar-fg" style="width: ${gate.crowd}%; background: ${color}"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderProAlerts() {
    const container = document.getElementById('alerts-container-pro');
    const alerts = window.stadiumState.alerts;
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-pro ${alert.type}">
            <div class="alert-pro-head">
                <span class="type">${alert.type.toUpperCase()}</span>
                <span class="time">${alert.time}</span>
            </div>
            <div class="alert-pro-title">${alert.title}</div>
            <div class="alert-pro-body">${alert.body}</div>
        </div>
    `).join('');
}

function renderProMap() {
    const wrapper = document.getElementById('stadium-map-pro');
    if (!wrapper) return;

    const state = window.stadiumState;
    const getColor = (val) => {
        if (val > 80) return 'var(--pro-danger)';
        if (val > 50) return 'var(--pro-warning)';
        return 'var(--pro-success)';
    };

    const svg = `
        <svg viewBox="0 0 500 350" style="width: 100%; height: 100%;">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Pitch -->
            <ellipse cx="250" cy="175" rx="100" ry="60" fill="#0f172a" stroke="#1e293b" />
            
            <!-- Zones -->
            ${Object.keys(state.zones).map(key => {
                const zone = state.zones[key];
                const color = getColor(zone.crowd);
                const isCritical = zone.crowd > 80;
                
                // Simplified paths for zones
                let d = "";
                if (zone.id === 'north') d = "M150 100 Q 250 50 350 100 L 400 80 Q 250 20 100 80 Z";
                else if (zone.id === 'south') d = "M150 250 Q 250 300 350 250 L 400 270 Q 250 330 100 270 Z";
                else if (zone.id === 'east') d = "M350 100 Q 400 175 350 250 L 420 270 Q 480 175 420 80 Z";
                else if (zone.id === 'west') d = "M150 100 Q 100 175 150 250 L 80 270 Q 20 175 80 80 Z";
                else return ''; // generic fallback

                return `
                    <path d="${d}" fill="${color}" fill-opacity="${isCritical ? 0.4 : 0.15}" 
                          stroke="${color}" stroke-width="2" 
                          class="stadium-zone ${isCritical ? 'critical' : ''}" 
                          filter="${isCritical ? 'url(#glow)' : 'none'}" />
                `;
            }).join('')}

            <!-- Predictive Warning Markers -->
            ${Object.keys(window.Intelligence.predictions).map(id => {
                const pred = window.Intelligence.predictions[id];
                if (pred.riskLevel === 'CRITICAL') {
                    // Logic to find coordinates would be here, let's put it near the gate/zone
                    return ''; // Placeholder for advanced markers
                }
                return '';
            }).join('')}
        </svg>
    `;

    wrapper.innerHTML = svg;
}

function calculateProRoute() {
    const gateId = document.getElementById('gate-selector-pro').value;
    const need = document.querySelector('.pro-chip.active').dataset.need;
    const container = document.getElementById('route-result-pro');
    
    const gate = window.stadiumState.gates[gateId];
    const pred = window.Intelligence.predictions[`gate_${gateId}`] || { value: gate.crowd };
    
    const isCritical = pred.value > 85;
    const rec = isCritical ? 'REDIRECT RECOMMENDED' : 'ALL CLEAR';

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="font-size: 1.1rem; color: white; margin-bottom: 4px;">SECTOR ANALYSIS: ${gate.name.toUpperCase()}</h3>
                    <p style="font-size: 0.7rem; color: var(--text-dim);">PREDICTIVE LOAD AT T+120S: <span style="color: ${isCritical ? 'var(--pro-danger)' : 'white'}">${pred.value}%</span></p>
                </div>
                <div style="background: ${isCritical ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; padding: 8px 16px; border-radius: 4px; border: 1px solid ${isCritical ? 'var(--pro-danger)' : 'var(--pro-success)'}; font-size: 0.7rem; font-weight: 800; color: ${isCritical ? 'var(--pro-danger)' : 'var(--pro-success)'}">
                    ${rec}
                </div>
            </div>

            <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid var(--border-pro);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 0.6rem; color: var(--text-dim);">EXPECTED WAIT</span>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--pro-secondary);">${gate.waitTime} MIN</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 0.6rem; color: var(--text-dim);">CROWD DENSITY</span>
                    <span style="font-family: var(--font-mono); font-weight: 700;">${Math.round(gate.crowd)} P/M²</span>
                </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px;">
                <div style="background: white; padding: 10px; border-radius: 6px;">
                    <div style="width: 60px; height: 60px; background: repeating-conic-gradient(black 0% 25%, white 0% 50%) 50% / 8px 8px;"></div>
                </div>
                <div>
                    <p style="font-size: 0.65rem; color: white; font-weight: 700;">PASS_ID: PR_9921_X</p>
                    <p style="font-size: 0.6rem; color: var(--text-dim);">SCAN AT SECTOR GATE FOR FAST_TRACK</p>
                </div>
            </div>
        </div>
    `;
}

window.addSystemLog = (message, type = 'system') => {
    const log = document.getElementById('admin-log-pro');
    if (!log) return;
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.innerText = `> [${new Date().toLocaleTimeString()}] ${message}`;
    log.prepend(line);
};

// CCTV Flickering effect
setInterval(() => {
    const feeds = document.querySelectorAll('.cctv-feed');
    feeds.forEach(f => {
        if (Math.random() > 0.95) {
            f.style.opacity = '0.7';
            setTimeout(() => f.style.opacity = '1', 50);
        }
    });
}, 2000);
