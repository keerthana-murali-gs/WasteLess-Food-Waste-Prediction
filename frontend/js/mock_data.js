/**
 * WasteLess - Standalone Mock Data Store
 * Used by Member 1 to develop, test, and present the UI completely independently.
 */
const MOCK_DATA = {
    user: {
        id: 1,
        username: 'admin',
        full_name: 'Member 1 (Frontend Lead)',
        email: 'member1@wasteless.org',
        role: 'Administrator'
    },
    
    initialFoods: [
        { id: 1, name: 'Masala Dosa', category: 'Breakfast', price_per_serving: 50.0, unit: 'servings', description: 'Crispy fermented crepe with spiced potato filling' },
        { id: 2, name: 'Idli Sambar', category: 'Breakfast', price_per_serving: 40.0, unit: 'plates', description: 'Steamed fluffy rice-lentil cakes served with sambar' },
        { id: 3, name: 'Poha', category: 'Breakfast', price_per_serving: 35.0, unit: 'plates', description: 'Flattened rice cooked with turmeric, mustard & peanuts' },
        { id: 4, name: 'Steamed Basmati Rice', category: 'Lunch', price_per_serving: 45.0, unit: 'servings', description: 'Aromatic long-grain steamed basmati rice' },
        { id: 5, name: 'Dal Makhani', category: 'Lunch', price_per_serving: 65.0, unit: 'servings', description: 'Slow-cooked black lentils enriched with butter' },
        { id: 6, name: 'Vegetable Pulao', category: 'Lunch', price_per_serving: 70.0, unit: 'servings', description: 'Basmati rice pilaf cooked with garden vegetables' },
        { id: 7, name: 'Paneer Butter Masala', category: 'Lunch', price_per_serving: 95.0, unit: 'servings', description: 'Cottage cheese cubes in rich tomato-butter gravy' },
        { id: 8, name: 'Tandoori Roti', category: 'Dinner', price_per_serving: 20.0, unit: 'pieces', description: 'Whole wheat flatbread baked in traditional clay tandoor' },
        { id: 9, name: 'Chicken Biryani', category: 'Dinner', price_per_serving: 135.0, unit: 'portions', description: 'Dum biryani with marinated tender chicken and saffron rice' },
        { id: 10, name: 'Mixed Vegetable Curry', category: 'Dinner', price_per_serving: 60.0, unit: 'servings', description: 'Seasonal vegetables braised in onion-tomato gravy' },
        { id: 11, name: 'Crispy Samosa', category: 'Snacks', price_per_serving: 18.0, unit: 'pieces', description: 'Golden fried pastry with spiced potato and pea filling' },
        { id: 12, name: 'Chole Bhature', category: 'Snacks', price_per_serving: 80.0, unit: 'plates', description: 'Spiced chickpea curry paired with deep-fried bread' }
    ],
    
    initialRecords: [
        { id: 1, date: '2026-11-06', food_id: 1, food_name: 'Masala Dosa', category: 'Breakfast', unit: 'servings', price_per_serving: 50.0, prepared_quantity: 75.0, consumed_quantity: 70.0, remaining_quantity: 5.0, actual_discarded_quantity: 2.0, waste_percentage: 2.67, notes: 'Breakfast rush handled well' },
        { id: 2, date: '2026-11-06', food_id: 4, food_name: 'Steamed Basmati Rice', category: 'Lunch', unit: 'servings', price_per_serving: 45.0, prepared_quantity: 130.0, consumed_quantity: 122.0, remaining_quantity: 8.0, actual_discarded_quantity: 3.5, waste_percentage: 2.69, notes: 'Standard operational shift' },
        { id: 3, date: '2026-11-06', food_id: 7, food_name: 'Paneer Butter Masala', category: 'Lunch', unit: 'servings', price_per_serving: 95.0, prepared_quantity: 90.0, consumed_quantity: 82.0, remaining_quantity: 8.0, actual_discarded_quantity: 5.0, waste_percentage: 5.56, notes: 'Portion tuning recommended' },
        { id: 4, date: '2026-11-06', food_id: 9, food_name: 'Chicken Biryani', category: 'Dinner', unit: 'portions', price_per_serving: 135.0, prepared_quantity: 110.0, consumed_quantity: 105.0, remaining_quantity: 5.0, actual_discarded_quantity: 2.0, waste_percentage: 1.82, notes: 'High Friday night footfall' },
        { id: 5, date: '2026-11-06', food_id: 11, food_name: 'Crispy Samosa', category: 'Snacks', unit: 'pieces', price_per_serving: 18.0, prepared_quantity: 130.0, consumed_quantity: 120.0, remaining_quantity: 10.0, actual_discarded_quantity: 4.0, waste_percentage: 3.08, notes: 'Evening tea snack rush' },
        { id: 6, date: '2026-11-05', food_id: 2, food_name: 'Idli Sambar', category: 'Breakfast', unit: 'plates', price_per_serving: 40.0, prepared_quantity: 85.0, consumed_quantity: 78.0, remaining_quantity: 7.0, actual_discarded_quantity: 3.0, waste_percentage: 3.53, notes: 'Normal operational shift' },
        { id: 7, date: '2026-11-05', food_id: 5, food_name: 'Dal Makhani', category: 'Lunch', unit: 'servings', price_per_serving: 65.0, prepared_quantity: 100.0, consumed_quantity: 92.0, remaining_quantity: 8.0, actual_discarded_quantity: 3.0, waste_percentage: 3.00, notes: 'Clean preparation' },
        { id: 8, date: '2026-11-05', food_id: 8, food_name: 'Tandoori Roti', category: 'Dinner', unit: 'pieces', price_per_serving: 20.0, prepared_quantity: 160.0, consumed_quantity: 142.0, remaining_quantity: 18.0, actual_discarded_quantity: 8.5, waste_percentage: 5.31, notes: 'Late evening slowdown' },
        { id: 9, date: '2026-11-04', food_id: 9, food_name: 'Chicken Biryani', category: 'Dinner', unit: 'portions', price_per_serving: 135.0, prepared_quantity: 100.0, consumed_quantity: 91.0, remaining_quantity: 9.0, actual_discarded_quantity: 4.0, waste_percentage: 4.00, notes: 'Normal operations' },
        { id: 10, date: '2026-11-04', food_id: 12, food_name: 'Chole Bhature', category: 'Snacks', unit: 'plates', price_per_serving: 80.0, prepared_quantity: 75.0, consumed_quantity: 68.0, remaining_quantity: 7.0, actual_discarded_quantity: 3.2, waste_percentage: 4.27, notes: 'Normal shift' }
    ],
    
    kpis: {
        total_items: 12,
        total_prepared: 102450.0,
        total_consumed: 95420.0,
        total_wasted: 3820.5,
        waste_percentage: 3.73,
        next_day_demand: 1145.0,
        estimated_cost: 218450.0
    },
    
    alerts: [
        { id: 1, alert_type: 'high_waste', title: 'High Food Wastage Detected', message: 'Tandoori Roti recorded 5.31% waste on Nov 5. Review dough batch sizes.', severity: 'danger', date_generated: '2026-11-06', is_read: false },
        { id: 2, alert_type: 'waste_reduced', title: 'Waste Reduction Milestone', message: 'Discards dropped by 18.4% this week thanks to AI demand forecasting!', severity: 'success', date_generated: '2026-11-06', is_read: false },
        { id: 3, alert_type: 'demand_status', title: 'ML Demand Predictor Ready', message: 'Linear Regression and Random Forest models calibrated with 1,092 historical records.', severity: 'info', date_generated: '2026-11-06', is_read: false }
    ],
    
    analytics: {
        categories: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
        cat_prep: [21400.0, 36200.0, 32150.0, 12700.0],
        cat_cons: [20120.0, 33850.0, 29800.0, 11650.0],
        cat_waste: [640.0, 1280.0, 1420.0, 480.0],
        timeline_dates: ['Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 01', 'Nov 02', 'Nov 03', 'Nov 04', 'Nov 05', 'Nov 06'],
        timeline_prepared: [1120, 1180, 1250, 1090, 1140, 1160, 1280, 1310, 1100, 1150, 1180, 1210, 1240, 1280],
        timeline_consumed: [1060, 1110, 1190, 1030, 1080, 1100, 1220, 1250, 1050, 1090, 1120, 1150, 1180, 1220],
        timeline_waste: [32, 41, 38, 29, 34, 31, 45, 42, 28, 33, 35, 36, 40, 39],
        most_wasted: [
            { name: 'Tandoori Roti', wasted: 485.0, prepared: 8200.0, waste_pct: 5.91, cost_loss: 9700.0, unit: 'pieces' },
            { name: 'Paneer Butter Masala', wasted: 412.0, prepared: 7850.0, waste_pct: 5.25, cost_loss: 39140.0, unit: 'servings' },
            { name: 'Idli Sambar', wasted: 345.0, prepared: 7120.0, waste_pct: 4.85, cost_loss: 13800.0, unit: 'plates' },
            { name: 'Chicken Biryani', wasted: 310.0, prepared: 8450.0, waste_pct: 3.67, cost_loss: 41850.0, unit: 'portions' },
            { name: 'Steamed Basmati Rice', wasted: 290.0, prepared: 9800.0, waste_pct: 2.96, cost_loss: 13050.0, unit: 'servings' }
        ],
        least_wasted: [
            { name: 'Vegetable Pulao', wasted: 140.0, prepared: 6500.0, waste_pct: 2.15, cost_loss: 9800.0, unit: 'servings' },
            { name: 'Masala Dosa', wasted: 185.0, prepared: 6900.0, waste_pct: 2.68, cost_loss: 9250.0, unit: 'servings' },
            { name: 'Poha', wasted: 155.0, prepared: 5400.0, waste_pct: 2.87, cost_loss: 5425.0, unit: 'plates' }
        ]
    },
    
    // Helper to get or initialize persistent storage
    getFoods() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.FOODS);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(CONFIG.STORAGE_KEYS.FOODS, JSON.stringify(this.initialFoods));
        return this.initialFoods;
    },
    
    saveFoods(foods) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.FOODS, JSON.stringify(foods));
    },
    
    getRecords() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.RECORDS);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(CONFIG.STORAGE_KEYS.RECORDS, JSON.stringify(this.initialRecords));
        return this.initialRecords;
    },
    
    saveRecords(records) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.RECORDS, JSON.stringify(records));
    }
};

window.MOCK_DATA = MOCK_DATA;

