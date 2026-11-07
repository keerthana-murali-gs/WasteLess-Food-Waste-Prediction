/**
 * WasteLess - Frontend Configuration
 * Enables seamless switching between Live Backend REST API and Standalone Mock Data.
 */
const CONFIG = {
    // Backend API Base URL
    API_BASE_URL: 'http://127.0.0.1:5000/api',
    
    // LocalStorage Keys
    STORAGE_KEYS: {
        MOCK_MODE: 'wasteless_mock_mode',
        AUTH_USER: 'wasteless_auth_user',
        FOODS: 'wasteless_mock_foods',
        RECORDS: 'wasteless_mock_records'
    },
    
    // Check if Mock Mode is forced by user or offline
    isMockMode() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.MOCK_MODE);
        if (stored !== null) {
            return stored === 'true';
        }
        // If loaded via file:// protocol, automatically default to mock mode
        if (window.location.protocol === 'file:') {
            return true;
        }
        return false;
    },
    
    // Toggle Mock Mode manually
    setMockMode(enable) {
        localStorage.setItem(this.STORAGE_KEYS.MOCK_MODE, enable ? 'true' : 'false');
        window.location.reload();
    }
};

// Expose globally
window.CONFIG = CONFIG;

