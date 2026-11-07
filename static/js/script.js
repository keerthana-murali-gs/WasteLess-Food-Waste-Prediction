/**
 * WasteLess - Interactive Frontend Script
 * Handles sidebar toggles, live calculations, Chart.js graphs, and table filtering
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Mobile Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', function () {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }

    // 2. Real-time Calculation Helper for Add/Edit Daily Record Form
    const prepInput = document.getElementById('prepared_quantity');
    const consInput = document.getElementById('consumed_quantity');
    const remInput = document.getElementById('remaining_quantity');
    const discInput = document.getElementById('actual_discarded_quantity');
    const wasteBadge = document.getElementById('waste_calc_badge');

    function updateLiveCalculations() {
        if (!prepInput || !consInput) return;

        const prep = parseFloat(prepInput.value) || 0;
        const cons = parseFloat(consInput.value) || 0;
        const remaining = Math.max(0, prep - cons);

        if (remInput) {
            remInput.value = remaining.toFixed(1);
        }

        if (discInput && wasteBadge) {
            const disc = parseFloat(discInput.value) || 0;
            let wastePct = 0;
            if (prep > 0) {
                wastePct = ((disc / prep) * 100).toFixed(1);
            }

            wasteBadge.textContent = `${wastePct}% Waste Rate`;
            wasteBadge.className = 'badge ';
            if (wastePct > 15) {
                wasteBadge.className += 'bg-danger';
            } else if (wastePct > 8) {
                wasteBadge.className += 'bg-warning text-dark';
            } else {
                wasteBadge.className += 'bg-success';
            }
        }
    }

    if (prepInput && consInput) {
        prepInput.addEventListener('input', updateLiveCalculations);
        consInput.addEventListener('input', updateLiveCalculations);
        if (discInput) {
            discInput.addEventListener('input', updateLiveCalculations);
        }
        updateLiveCalculations();
    }

    // 3. Client-side Table Search & Category Filter
    const searchInput = document.getElementById('tableSearchInput');
    const categoryFilter = document.getElementById('tableCategoryFilter');
    const dataTable = document.getElementById('filterableTable');

    function filterTableRows() {
        if (!dataTable) return;
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCat = categoryFilter ? categoryFilter.value.toLowerCase().trim() : '';
        const rows = dataTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const rowCat = row.getAttribute('data-category') ? row.getAttribute('data-category').toLowerCase() : '';

            const matchesQuery = !query || rowText.includes(query);
            const matchesCat = !selectedCat || rowCat === selectedCat;

            if (matchesQuery && matchesCat) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterTableRows);
    if (categoryFilter) categoryFilter.addEventListener('change', filterTableRows);

    // 4. Auto-dismiss Flash Alerts after 5 seconds
    const autoAlerts = document.querySelectorAll('.alert-dismissible');
    autoAlerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) bsAlert.close();
        }, 5000);
    });
});

/**
 * Chart Creation Helper Functions
 */
const WasteLessCharts = {
    // Sustainability Palette
    colors: {
        forestGreen: '#1b4332',
        primaryGreen: '#2d6a4f',
        lightGreen: '#52b788',
        mint: '#b7e4c7',
        accentYellow: '#f59e0b',
        dangerRed: '#ef4444',
        skyBlue: '#0284c7'
    },

    // Daily Consumption Line Chart
    renderConsumptionChart: function (canvasId, labels, prepData, consData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Prepared (Units)',
                        data: prepData,
                        borderColor: this.colors.primaryGreen,
                        backgroundColor: 'rgba(45, 106, 79, 0.08)',
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: this.colors.primaryGreen,
                        pointRadius: 4
                    },
                    {
                        label: 'Consumed / Sold (Units)',
                        data: consData,
                        borderColor: this.colors.lightGreen,
                        backgroundColor: 'rgba(82, 183, 136, 0.15)',
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: this.colors.lightGreen,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } },
                    tooltip: { padding: 10, cornerRadius: 8 }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                }
            }
        });
    },

    // Food Wastage Bar Chart
    renderWastageBarChart: function (canvasId, labels, wasteData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Actual Discarded Waste (Units)',
                    data: wasteData,
                    backgroundColor: 'rgba(239, 68, 68, 0.75)',
                    hoverBackgroundColor: '#dc2626',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { padding: 10, cornerRadius: 8 }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                }
            }
        });
    },

    // Category Distribution Doughnut Chart
    renderCategoryPieChart: function (canvasId, labels, dataValues) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'],
                    hoverOffset: 6,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } }
                }
            }
        });
    },

    // Weekly Demand / Day-of-Week Pattern Chart
    renderWeeklyDemandChart: function (canvasId, labels, avgDemand) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Avg Daily Consumption',
                    data: avgDemand,
                    backgroundColor: 'rgba(45, 106, 79, 0.8)',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                }
            }
        });
    }
};

