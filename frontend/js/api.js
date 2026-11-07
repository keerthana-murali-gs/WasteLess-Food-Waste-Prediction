/**
 * WasteLess - REST API Service Layer
 * Abstracts backend HTTP communication and provides transparent fallback to mock data.
 */
const api = {
    // Current connection state
    isLive: false,
    
    async checkBackend() {
        if (CONFIG.isMockMode()) {
            this.isLive = false;
            return false;
        }
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/auth/me`, {
                method: 'GET',
                signal: AbortSignal.timeout(1500)
            });
            this.isLive = res.ok;
            return res.ok;
        } catch (e) {
            this.isLive = false;
            return false;
        }
    },

    // -------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------
    async login(username, password) {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
            }
            return data;
        } else {
            // Mock authentication
            if (username === 'admin' && (password === 'admin123' || password === 'admin' || password.length >= 4)) {
                const user = MOCK_DATA.user;
                localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
                return { success: true, message: 'Logged in successfully (Mock Mode)', user };
            }
            return { success: false, error: 'Invalid username or password. Demo: admin / admin123' };
        }
    },

    async logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_USER);
        if (this.isLive) {
            try {
                await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, { method: 'POST' });
            } catch (e) {}
        }
        return { success: true };
    },

    getUser() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_USER);
        return stored ? JSON.parse(stored) : MOCK_DATA.user;
    },

    // -------------------------------------------------------------
    // Dashboard & Analytics
    // -------------------------------------------------------------
    async getDashboardKPIs() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/kpis`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        return MOCK_DATA.kpis;
    },

    async getAlerts() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/alerts`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        return MOCK_DATA.alerts;
    },

    async getAnalytics() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/analytics`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        return MOCK_DATA.analytics;
    },

    // -------------------------------------------------------------
    // Food Catalog CRUD
    // -------------------------------------------------------------
    async getFoods() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/foods`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        return MOCK_DATA.getFoods();
    },

    async addFood(foodData) {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/foods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData)
            });
            return await res.json();
        } else {
            const foods = MOCK_DATA.getFoods();
            const newId = foods.length > 0 ? Math.max(...foods.map(f => f.id)) + 1 : 1;
            const newFood = {
                id: newId,
                name: foodData.name,
                category: foodData.category,
                price_per_serving: parseFloat(foodData.price_per_serving) || 0,
                unit: foodData.unit || 'servings',
                description: foodData.description || ''
            };
            foods.push(newFood);
            MOCK_DATA.saveFoods(foods);
            return { success: true, message: `"${newFood.name}" added successfully.`, data: newFood };
        }
    },

    async updateFood(id, foodData) {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/foods/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData)
            });
            return await res.json();
        } else {
            const foods = MOCK_DATA.getFoods();
            const index = foods.findIndex(f => f.id === parseInt(id));
            if (index !== -1) {
                foods[index] = { ...foods[index], ...foodData, id: parseInt(id) };
                MOCK_DATA.saveFoods(foods);
                return { success: true, message: 'Food item updated.', data: foods[index] };
            }
            return { success: false, error: 'Food not found.' };
        }
    },

    async deleteFood(id) {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/foods/${id}`, { method: 'DELETE' });
            return await res.json();
        } else {
            let foods = MOCK_DATA.getFoods();
            foods = foods.filter(f => f.id !== parseInt(id));
            MOCK_DATA.saveFoods(foods);
            return { success: true, message: 'Food item removed.' };
        }
    },

    // -------------------------------------------------------------
    // Daily Records
    // -------------------------------------------------------------
    async getRecords(filters = {}) {
        if (await this.checkBackend()) {
            try {
                const params = new URLSearchParams(filters).toString();
                const res = await fetch(`${CONFIG.API_BASE_URL}/records?${params}`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        let records = MOCK_DATA.getRecords();
        if (filters.food_id) {
            records = records.filter(r => r.food_id == filters.food_id);
        }
        if (filters.category) {
            records = records.filter(r => r.category == filters.category);
        }
        return records;
    },

    async addRecord(recordData) {
        const prep = parseFloat(recordData.prepared_quantity) || 0;
        const cons = parseFloat(recordData.consumed_quantity) || 0;
        const disc = parseFloat(recordData.actual_discarded_quantity) || 0;
        
        // Frontend validation
        if (cons > prep) {
            return { success: false, error: 'Consumed quantity cannot exceed prepared quantity.' };
        }
        const rem = Math.max(0, +(prep - cons).toFixed(2));
        if (disc > rem + 0.01) {
            return { success: false, error: 'Discarded quantity cannot exceed leftover remaining quantity.' };
        }
        const wastePct = prep > 0 ? +((disc / prep) * 100).toFixed(2) : 0;

        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recordData)
            });
            return await res.json();
        } else {
            const records = MOCK_DATA.getRecords();
            const foods = MOCK_DATA.getFoods();
            const food = foods.find(f => f.id == recordData.food_id);
            
            const newRecord = {
                id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
                date: recordData.date,
                food_id: parseInt(recordData.food_id),
                food_name: food ? food.name : 'Selected Food',
                category: food ? food.category : 'General',
                unit: food ? food.unit : 'servings',
                price_per_serving: food ? food.price_per_serving : 50.0,
                prepared_quantity: prep,
                consumed_quantity: cons,
                remaining_quantity: rem,
                actual_discarded_quantity: disc,
                waste_percentage: wastePct,
                notes: recordData.notes || ''
            };
            records.unshift(newRecord);
            MOCK_DATA.saveRecords(records);
            return { success: true, message: 'Daily record logged successfully.', data: newRecord };
        }
    },

    async deleteRecord(id) {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/records/${id}`, { method: 'DELETE' });
            return await res.json();
        } else {
            let records = MOCK_DATA.getRecords();
            records = records.filter(r => r.id !== parseInt(id));
            MOCK_DATA.saveRecords(records);
            return { success: true, message: 'Record deleted.' };
        }
    },

    // -------------------------------------------------------------
    // Machine Learning Prediction
    // -------------------------------------------------------------
    async predictDemand(payload) {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        // Realistic Mock Predictions
        const foods = MOCK_DATA.getFoods();
        const buffer = parseFloat(payload.safety_buffer) || 0.08;
        const targetDate = payload.target_date || new Date().toISOString().split('T')[0];
        const modelLabel = payload.model_type === 'random_forest' ? 'Random Forest Regressor' : 'Linear Regression (Baseline)';
        
        let targetFoods = foods;
        if (payload.food_id) {
            targetFoods = foods.filter(f => f.id == payload.food_id);
        }
        
        return targetFoods.map(food => {
            const baseDemand = {
                1: 68.0, 2: 82.0, 3: 56.0, 4: 125.0, 5: 98.0, 6: 76.0,
                7: 88.0, 8: 145.0, 9: 102.0, 10: 72.0, 11: 124.0, 12: 74.0
            }[food.id] || 70.0;
            
            // Random fluctuation for realism
            const predDemand = +(baseDemand * (0.95 + Math.random() * 0.1)).toFixed(1);
            const prepRec = +(predDemand * (1 + buffer)).toFixed(1);
            
            return {
                food_id: food.id,
                food_name: food.name,
                category: food.category,
                unit: food.unit,
                price_per_serving: food.price_per_serving,
                prediction_date: targetDate,
                historical_avg_demand: baseDemand,
                predicted_demand: predDemand,
                recommended_preparation: prepRec,
                safety_buffer_pct: +(buffer * 100).toFixed(1),
                model_used: modelLabel,
                prediction_status: predDemand > baseDemand * 1.15 ? 'High Demand Peak' : 'Optimal Steady Demand'
            };
        });
    },

    async getModelStatus() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/model/status`);
                const json = await res.json();
                if (json.success) return json;
            } catch (e) {}
        }
        return {
            trained: true,
            trained_at: '2026-11-06 18:30:00',
            metrics: {
                linear_regression: { mae: 9.241, rmse: 12.144, r2: 0.8660 },
                random_forest: { mae: 6.906, rmse: 8.972, r2: 0.9269 },
                improvement_pct: 25.26
            },
            total_samples: 1092,
            train_samples: 864,
            test_samples: 228
        };
    },

    async retrainModel() {
        if (await this.checkBackend()) {
            const res = await fetch(`${CONFIG.API_BASE_URL}/train`, { method: 'POST' });
            return await res.json();
        } else {
            return {
                success: true,
                message: 'ML models retrained with 1,092 records (Mock Mode simulation).',
                metrics: {
                    linear_regression: { mae: 9.241, rmse: 12.144, r2: 0.8660 },
                    random_forest: { mae: 6.906, rmse: 8.972, r2: 0.9269 }
                }
            };
        }
    },

    // -------------------------------------------------------------
    // Reports
    // -------------------------------------------------------------
    async getReportsSummary() {
        if (await this.checkBackend()) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/reports/summary`);
                const json = await res.json();
                if (json.success) return json.data;
            } catch (e) {}
        }
        return {
            records_logged: 1092,
            days_tracked: 91,
            total_prepared: 102450.0,
            total_consumed: 95420.0,
            total_wasted: 3820.5,
            waste_percentage: 3.73,
            cost_loss: 218450.0
        };
    },

    exportCSV() {
        if (this.isLive) {
            window.location.href = `${CONFIG.API_BASE_URL}/reports/export/csv`;
        } else {
            // Client-side CSV generation in mock mode
            const records = MOCK_DATA.getRecords();
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Record_ID,Date,Food_ID,Food_Name,Category,Unit,Price,Quantity_Prepared,Quantity_Consumed,Remaining_Quantity,Actual_Discarded_Quantity,Waste_Percentage,Notes\n";
            records.forEach(r => {
                csvContent += `${r.id},${r.date},${r.food_id},"${r.food_name}",${r.category},${r.unit},${r.price_per_serving},${r.prepared_quantity},${r.consumed_quantity},${r.remaining_quantity},${r.actual_discarded_quantity},${r.waste_percentage},"${r.notes}"\n`;
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `wasteless_mock_records_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

window.api = api;

