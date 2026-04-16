import { stadiumState } from './state.js';
import { Intelligence } from './intelligence.js';
import { GCP_Manager } from './google-services.js';

/**
 * StadiumPulse Pro UI Engine
 * Handles rendering, events, and telemetry
 */

document.addEventListener('DOMContentLoaded', () => {
    initProUI();
    setupProEventListeners();
    simulateGoogleAnalytics();
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
    if (clock) {
        clock.textContent = new Date().toLocaleTimeString();
    }
}

/**
 * Google Services Integration: Dashboard Telemetry
 * Real integration simulation using GCP_Manager (GTAG / Cloud Logging)
 */
function simulateGoogleAnalytics() {
    GCP_Manager.Logging.log('INFO', 'StadiumPulse Pro Dashboard Initialized', {
        version: '2.1.0-elite',
        environment: 'master_control',
    });

    window.setInterval(() => {
        GCP_Manager.trackEvent('operational_telemetry_sync', {
            total_crowd: stadiumState.event.totalCrowd,
            active_alerts: stadiumState.alerts.length,
            system_nominal: true,
        });
    }, 15000);
}

function setupProEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            document
                .querySelectorAll('.tab-content')
                .forEach((c) => c.classList.remove('active'));

            tab.classList.add('active');
            const content = document.getElementById(`${tab.dataset.tab}-view`);
            if (content) content.classList.add('active');
        });
    });

    // Fan View Chips
    const chips = document.querySelectorAll('.pro-chip');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            calculateProRoute();
        });
    });

    const gateSelect = document.getElementById('gate-selector-pro');
    if (gateSelect) {
        gateSelect.addEventListener('change', calculateProRoute);
    }

    // Initial route calculation
    calculateProRoute();
}

function updateProDashboard() {
    // Total crowd
    const totalCrowdEl = document.getElementById('total-crowd-val');
    if (totalCrowdEl) {
        totalCrowdEl.textContent = Math.round(
            stadiumState.event.totalCrowd
        ).toLocaleString();
    }

    // Global Risk Level logic
    const criticalZonesCount = Object.values(Intelligence.predictions).filter(
        (p) => p.riskLevel === 'CRITICAL'
    ).length;

    const riskVal = document.getElementById('global-risk-val');
    if (riskVal) {
        if (criticalZonesCount > 0) {
            riskVal.textContent = 'CRITICAL';
            riskVal.className = 'value danger';
            riskVal.setAttribute('aria-label', 'System Status: Critical Risk');
        } else {
            riskVal.textContent = 'STABLE';
            riskVal.className = 'value success';
            riskVal.setAttribute('aria-label', 'System Status: Stable');
        }
    }

    renderGateLoadList();
    renderProAlerts();
}

/**
 * Security Fix: Using DOM Creation logic instead of innerHTML for Dynamic Lists
 */
function renderGateLoadList() {
    const list = document.getElementById('gate-load-list');
    if (!list) return;

    list.innerHTML = ''; // Clear for refresh

    Object.values(stadiumState.gates).forEach((gate) => {
        const pred = Intelligence.predictions[`gate_${gate.id}`] || {
            value: gate.crowd,
        };
        const color =
            gate.crowd > 80
                ? 'var(--pro-danger)'
                : gate.crowd > 50
                    ? 'var(--pro-warning)'
                    : 'var(--pro-success)';

        const item = document.createElement('div');
        item.className = 'load-item';

        const info = document.createElement('div');
        info.className = 'load-info';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = gate.name;

        const valSpan = document.createElement('span');
        valSpan.innerHTML = `${Math.round(gate.crowd)}% <small style="color:var(--text-dim)">(PRED: ${pred.value}%)</small>`;

        info.appendChild(nameSpan);
        info.appendChild(valSpan);

        const barBg = document.createElement('div');
        barBg.className = 'load-bar-bg';

        const barFg = document.createElement('div');
        barFg.className = 'load-bar-fg';
        barFg.style.width = `${gate.crowd}%`;
        barFg.style.backgroundColor = color;

        barBg.appendChild(barFg);
        item.appendChild(info);
        item.appendChild(barBg);
        list.appendChild(item);
    });
}

function renderProAlerts() {
    const container = document.getElementById('alerts-container-pro');
    if (!container) return;

    container.innerHTML = '';

    stadiumState.alerts.forEach((alert) => {
        const div = document.createElement('div');
        div.className = `alert-pro ${alert.type}`;
        div.setAttribute(
            'role',
            alert.type === 'critical' ? 'alert' : 'status'
        );

        const head = document.createElement('div');
        head.className = 'alert-pro-head';

        const type = document.createElement('span');
        type.className = 'type';
        type.textContent = alert.type.toUpperCase();

        const time = document.createElement('span');
        time.className = 'time';
        time.textContent = alert.time;

        head.appendChild(type);
        head.appendChild(time);

        const title = document.createElement('div');
        title.className = 'alert-pro-title';
        title.textContent = alert.title;

        const body = document.createElement('div');
        body.className = 'alert-pro-body';
        body.textContent = alert.body;

        div.appendChild(head);
        div.appendChild(title);
        div.appendChild(body);
        container.appendChild(div);

        // Firebase Sync simulation for each alert
        GCP_Manager.Firebase.syncAlert(alert);
    });
}

function renderProMap() {
    const wrapper = document.getElementById('stadium-map-pro');
    if (!wrapper) return;

    const getColor = (val) => {
        if (val > 80) return 'var(--pro-danger)';
        if (val > 50) return 'var(--pro-warning)';
        return 'var(--pro-success)';
    };

    // SVG rendering (simplified since it's a static template structure)
    let zonesSvg = Object.values(stadiumState.zones)
        .map((zone) => {
            const color = getColor(zone.crowd);
            const isCritical = zone.crowd > 80;
            let d;
            if (zone.id === 'north')
                d = 'M150 100 Q 250 50 350 100 L 400 80 Q 250 20 100 80 Z';
            else if (zone.id === 'south')
                d = 'M150 250 Q 250 300 350 250 L 400 270 Q 250 330 100 270 Z';
            else if (zone.id === 'east')
                d = 'M350 100 Q 400 175 350 250 L 420 270 Q 480 175 420 80 Z';
            else if (zone.id === 'west')
                d = 'M150 100 Q 100 175 150 250 L 80 270 Q 20 175 80 80 Z';
            else return '';

            return `
            <path d="${d}" fill="${color}" fill-opacity="${isCritical ? 0.4 : 0.15}" 
                  stroke="${color}" stroke-width="2" 
                  class="stadium-zone ${isCritical ? 'critical' : ''}" 
                  filter="${isCritical ? 'url(#glow)' : 'none'}" />
        `;
        })
        .join('');

    wrapper.innerHTML = `
        <svg viewBox="0 0 500 350" style="width: 100%; height: 100%;" aria-hidden="true">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <ellipse cx="250" cy="175" rx="100" ry="60" fill="#0f172a" stroke="#1e293b" />
            ${zonesSvg}
        </svg>
    `;
}

export function calculateProRoute() {
    const gateIdSelect = document.getElementById('gate-selector-pro');
    if (!gateIdSelect) return;
    const gateId = gateIdSelect.value;

    const activeChip = document.querySelector('.pro-chip.active');
    // Operational metric placeholder (internal metadata sync can be added here)
    const _need = activeChip ? activeChip.dataset.need : 'entry';
    GCP_Manager.Logging.log('DEBUG', `Routing calculation for: ${_need}`);

    const container = document.getElementById('route-result-pro');
    if (!container) return;

    const gate = stadiumState.gates[gateId];
    if (!gate) return;

    const pred = Intelligence.predictions[`gate_${gateId}`] || {
        value: gate.crowd,
    };
    const isCritical = pred.value > 85;
    const recText = isCritical ? 'REDIRECT RECOMMENDED' : 'OPTIMAL SECTOR';

    // Build route result safely
    container.innerHTML = '';
    const mainDiv = document.createElement('div');
    mainDiv.style.cssText = 'display: flex; flex-direction: column; gap: 20px;';

    const head = document.createElement('div');
    head.style.cssText =
        'display: flex; justify-content: space-between; align-items: flex-start;';

    const titleBox = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.style.cssText = 'font-size: 1.1rem; color: white; margin-bottom: 4px;';
    h3.textContent = `SECTOR ANALYSIS: ${gate.name.toUpperCase()}`;
    const p = document.createElement('p');
    p.style.cssText = 'font-size: 0.7rem; color: var(--text-dim);';
    p.textContent = 'PREDICTIVE LOAD AT T+120S: ';
    const predSpan = document.createElement('span');
    predSpan.style.color = isCritical ? 'var(--pro-danger)' : 'white';
    predSpan.textContent = `${pred.value}%`;
    p.appendChild(predSpan);
    titleBox.appendChild(h3);
    titleBox.appendChild(p);

    const badge = document.createElement('div');
    badge.style.cssText = `background: ${isCritical ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; padding: 8px 16px; border-radius: 4px; border: 1px solid ${isCritical ? 'var(--pro-danger)' : 'var(--pro-success)'}; font-size: 0.7rem; font-weight: 800; color: ${isCritical ? 'var(--pro-danger)' : 'var(--pro-success)'}`;
    badge.textContent = recText;

    head.appendChild(titleBox);
    head.appendChild(badge);

    const stats = document.createElement('div');
    stats.style.cssText =
        'padding: 16px; background: rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid var(--border-pro);';

    const row1 = document.createElement('div');
    row1.style.cssText =
        'display: flex; justify-content: space-between; margin-bottom: 12px;';
    row1.innerHTML = `<span style="font-size: 0.6rem; color: var(--text-dim);">EXPECTED WAIT</span><span style="font-family: var(--font-mono); font-weight: 700; color: var(--pro-secondary);">${gate.waitTime} MIN</span>`;

    const row2 = document.createElement('div');
    row2.style.cssText = 'display: flex; justify-content: space-between;';
    row2.innerHTML = `<span style="font-size: 0.6rem; color: var(--text-dim);">CROWD DENSITY</span><span style="font-family: var(--font-mono); font-weight: 700;">${Math.round(gate.crowd)} P/M²</span>`;

    stats.appendChild(row1);
    stats.appendChild(row2);

    mainDiv.appendChild(head);
    mainDiv.appendChild(stats);
    container.appendChild(mainDiv);
}

export function addSystemLog(message, type = 'system') {
    const log = document.getElementById('admin-log-pro');
    if (!log) return;
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.textContent = `> [${new Date().toLocaleTimeString()}] ${message}`;
    log.prepend(line);
}

// CCTV Flickering effect
setInterval(() => {
    const feeds = document.querySelectorAll('.cctv-feed');
    feeds.forEach((f) => {
        if (Math.random() > 0.95) {
            f.style.opacity = '0.7';
            setTimeout(() => {
                if (f) f.style.opacity = '1';
            }, 50);
        }
    });
}, 2000);
