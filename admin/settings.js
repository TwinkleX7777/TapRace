// settings.js - Final Working Version
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.database();
    const settingsContent = document.getElementById('settings-management');

    // Default settings if none exist
    const defaultSettings = {
        min_withdrawal: 10,
        max_daily_taps: 5000,
        maintenance_mode: false,
        ad_refresh_rate: 30
    };

    function loadSettings() {
        settingsContent.innerHTML = '<div class="loading">Loading settings...</div>';
        
        db.ref('settings').once('value', (snapshot) => {
            const settings = snapshot.exists() ? snapshot.val() : defaultSettings;
            
            const html = `
                <div class="settings-container">
                    <h2>System Settings</h2>
                    <form id="settings-form">
                        <div class="form-group">
                            <label>Minimum Withdrawal ($):</label>
                            <input type="number" id="min-withdrawal" 
                                   value="${settings.min_withdrawal}" 
                                   min="1" step="0.01" required>
                        </div>

                        <div class="form-group">
                            <label>Max Daily Taps:</label>
                            <input type="number" id="max-taps" 
                                   value="${settings.max_daily_taps}" 
                                   min="100" required>
                        </div>

                        <div class="form-group">
                            <label>Ad Refresh Rate (minutes):</label>
                            <input type="number" id="ad-refresh" 
                                   value="${settings.ad_refresh_rate}" 
                                   min="5" max="120" required>
                        </div>

                        <div class="form-group">
                            <label>Maintenance Mode:</label>
                            <select id="maintenance-mode" class="modern-select">
                                <option value="false" ${!settings.maintenance_mode ? 'selected' : ''}>Disabled</option>
                                <option value="true" ${settings.maintenance_mode ? 'selected' : ''}>Enabled</option>
                            </select>
                        </div>

                        <button type="submit" class="save-button">
                            💾 Save Settings
                        </button>
                    </form>
                </div>
            `;
            
            settingsContent.innerHTML = html;
            setupFormListeners();
        });
    }

    function setupFormListeners() {
        const form = document.getElementById('settings-form');
        if (!form) return;

        form.onsubmit = (e) => {
            e.preventDefault();
            saveSettings();
        };
    }

    function saveSettings() {
        const settings = {
            min_withdrawal: parseFloat(document.getElementById('min-withdrawal').value),
            max_daily_taps: parseInt(document.getElementById('max-taps').value),
            ad_refresh_rate: parseInt(document.getElementById('ad-refresh').value),
            maintenance_mode: document.getElementById('maintenance-mode').value === 'true'
        };

        db.ref('settings').update(settings)
            .then(() => showToast('Settings saved successfully!', 'success'))
            .catch(error => showToast(`Error: ${error.message}`, 'error'));
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // Initialize settings when button clicked
    document.getElementById('settings').addEventListener('click', loadSettings);
});
