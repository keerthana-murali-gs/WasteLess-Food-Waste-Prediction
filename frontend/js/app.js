/**
 * WasteLess - Application UI Controller & Helper Utilities
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize API Connection Status Indicator
    await initConnectionStatus();

    // 2. Highlight Active Navigation Item in Sidebar
    highlightActiveNav();

    // 3. Initialize Mobile Sidebar Toggle
    initSidebarToggle();

    // 4. Update Current User details if present
    updateUserDisplay();
});

async function initConnectionStatus() {
    const badge = document.getElementById('apiStatusBadge');
    if (!badge) return;

    const isLive = await api.checkBackend();
    if (isLive) {
        badge.className = 'api-status-badge connected';
        badge.innerHTML = '<span class="pulse-dot connected"></span> Live Backend (Connected)';
        badge.title = 'Connected to Flask REST API at ' + CONFIG.API_BASE_URL;
    } else {
        badge.className = 'api-status-badge mock';
        badge.innerHTML = '<span class="pulse-dot mock"></span> Standalone Mock Mode';
        badge.title = 'Running independently with sample data. Click to retry backend connection.';
    }

    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => {
        const currentMock = CONFIG.isMockMode();
        const action = currentMock ? 'Switch to Live API Mode?' : 'Force Standalone Mock Mode?';
        if (confirm(`${action}\n\nLive API connects to Flask on port 5000.\nMock Mode uses local sample data.`)) {
            CONFIG.setMockMode(!currentMock);
        }
    });
}

function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link-custom');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });

        // Close on click outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }
}

function updateUserDisplay() {
    const user = api.getUser();
    const nameEl = document.getElementById('currentUserName');
    if (nameEl && user) {
        nameEl.textContent = user.full_name || user.username || 'Admin';
    }
}

// -------------------------------------------------------------
// Interactive Record Form Live Calculations
// -------------------------------------------------------------
function setupRecordCalculations(prepInputId, consInputId, discInputId, remInputId, wastePctId) {
    const prepInput = document.getElementById(prepInputId);
    const consInput = document.getElementById(consInputId);
    const discInput = document.getElementById(discInputId);
    const remInput = document.getElementById(remInputId);
    const wastePctEl = document.getElementById(wastePctId);

    if (!prepInput || !consInput) return;

    function recalculate() {
        const prep = parseFloat(prepInput.value) || 0;
        const cons = parseFloat(consInput.value) || 0;
        const disc = discInput ? (parseFloat(discInput.value) || 0) : 0;

        // 1. Calculate Remaining = Prepared - Consumed
        const remaining = Math.max(0, +(prep - cons).toFixed(2));
        if (remInput) {
            remInput.value = remaining;
        }

        // 2. Calculate Waste % = (Discarded / Prepared) * 100
        if (wastePctEl) {
            if (prep > 0) {
                const pct = +((disc / prep) * 100).toFixed(2);
                wastePctEl.textContent = `${pct}%`;

                // Visual color coding
                if (pct < 5.0) {
                    wastePctEl.className = 'badge bg-success';
                } else if (pct <= 10.0) {
                    wastePctEl.className = 'badge bg-warning text-dark';
                } else {
                    wastePctEl.className = 'badge bg-danger';
                }
            } else {
                wastePctEl.textContent = '0.0%';
                wastePctEl.className = 'badge bg-secondary';
            }
        }
    }

    prepInput.addEventListener('input', recalculate);
    consInput.addEventListener('input', recalculate);
    if (discInput) discInput.addEventListener('input', recalculate);
}

// -------------------------------------------------------------
// Toast Notification Helper
// -------------------------------------------------------------
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:350px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : 'bg-primary text-white';
    toast.className = `toast align-items-center ${bgClass} border-0 show mb-2 shadow`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Formatters
function formatCurrency(val) {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatNumber(val, decimals = 1) {
    return Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

