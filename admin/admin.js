document.addEventListener("DOMContentLoaded", function() {
    const auth = firebase.auth();
    const db = firebase.database();

    // Firebase Configuration (REPLACE WITH YOURS)
    const firebaseConfig = {
        apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
        authDomain: "taprace-63f8e.firebaseapp.com",
        databaseURL: "https://taprace-taffe-default-rtdb.firebaseio.com",
        projectId: "taprace-63f8e",
        storageBucket: "taprace-63f8e.appspot.com",
        messagingSenderId: "93332718324",
        appId: "1:93332718324:web:4b48350c0b64061eb794a1"
    };
    
    firebase.initializeApp(firebaseConfig);

    // Auth State Listener
    auth.onAuthStateChanged(user => {
        if (user) {
            showDashboard();
            showSection('players');
            loadPlayers();
        } else {
            showLogin();
        }
    });

    // Login Handler
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorElement = document.getElementById("login-error");
        const loginBtn = document.getElementById("login-btn");

        errorElement.textContent = "";
        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                errorElement.textContent = error.message;
            })
            .finally(() => {
                loginBtn.disabled = false;
                loginBtn.textContent = "Login";
            });
    });

    // Logout Handler
    document.getElementById("logout-btn").addEventListener("click", () => {
        auth.signOut();
    });

    // Navigation Handler
    document.querySelectorAll('nav button').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            showSection(sectionId);
            loadSectionData(sectionId);
        });
    });

    // Section Management
    function showSection(sectionId) {
        document.querySelectorAll('#content > div').forEach(div => {
            div.style.display = 'none';
        });
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'block';
    }

    function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'players':
                loadPlayers();
                break;
            case 'leaderboard':
                loadLeaderboard();
                break;
            case 'withdrawals':
                loadWithdrawals();
                break;
            case 'ads':
                loadAds();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }

    // Data Loaders
    async function loadPlayers() {
        const snapshot = await db.ref('players').get();
        const players = snapshot.val();
        const tbody = document.getElementById("players-list");
        tbody.innerHTML = '';
        
        for(const [id, player] of Object.entries(players)) {
            tbody.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${player.username || 'N/A'}</td>
                    <td>${player.score || 0}</td>
                    <td>
                        <button class="delete-btn" 
                                onclick="deletePlayer('${id}')">Delete</button>
                    </td>
                </tr>
            `;
        }
    }

    async function loadLeaderboard() {
        const snapshot = await db.ref('leaderboard').get();
        const leaderboard = snapshot.val();
        const tbody = document.getElementById("leaderboard-list");
        tbody.innerHTML = '';
        
        let rank = 1;
        for(const [playerId, playerData] of Object.entries(leaderboard)) {
            tbody.innerHTML += `
                <tr>
                    <td>#${rank++}</td>
                    <td>${playerData.username}</td>
                    <td>${playerData.score}</td>
                </tr>
            `;
        }
    }

    async function loadWithdrawals() {
        const snapshot = await db.ref('withdraw_requests').get();
        const requests = snapshot.val();
        const tbody = document.getElementById("withdrawals-list");
        tbody.innerHTML = '';
        
        for(const [requestId, request] of Object.entries(requests)) {
            tbody.innerHTML += `
                <tr>
                    <td>${request.playerName}</td>
                    <td>${request.amount}</td>
                    <td>${request.status}</td>
                    <td>
                        <button class="approve-btn" 
                                onclick="approveWithdrawal('${requestId}')">Approve</button>
                        <button class="delete-btn" 
                                onclick="rejectWithdrawal('${requestId}')">Reject</button>
                    </td>
                </tr>
            `;
        }
    }

    async function loadAds() {
        const snapshot = await db.ref('ads').get();
        const ads = snapshot.val();
        const tbody = document.getElementById("ad-settings");
        tbody.innerHTML = '';
        
        for(const [adId, adData] of Object.entries(ads)) {
            tbody.innerHTML += `
                <tr>
                    <td>${adId}</td>
                    <td>${adData.type}</td>
                    <td>${adData.enabled ? 'Active' : 'Disabled'}</td>
                    <td>
                        <button onclick="toggleAd('${adId}', ${!adData.enabled})">
                            ${adData.enabled ? 'Disable' : 'Enable'}
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    async function loadSettings() {
        const snapshot = await db.ref('settings').get();
        const settings = snapshot.val();
        document.getElementById('max-taps').value = settings.max_daily_taps;
        document.getElementById('min-withdrawal').value = settings.min_withdrawal;
    }

    // Global Functions
    window.deletePlayer = async function(playerId) {
        if(confirm('Delete this player?')) {
            await db.ref(`players/${playerId}`).remove();
            loadPlayers();
        }
    }

    window.approveWithdrawal = async function(requestId) {
        await db.ref(`withdraw_requests/${requestId}/status`).set('approved');
        loadWithdrawals();
    }

    window.rejectWithdrawal = async function(requestId) {
        await db.ref(`withdraw_requests/${requestId}/status`).set('rejected');
        loadWithdrawals();
    }

    window.toggleAd = async function(adId, status) {
        await db.ref(`ads/${adId}/enabled`).set(status);
        loadAds();
    }

    window.saveSettings = async function() {
        await db.ref('settings').update({
            max_daily_taps: document.getElementById('max-taps').value,
            min_withdrawal: document.getElementById('min-withdrawal').value
        });
        alert('Settings saved successfully!');
    }

    // UI Control
    function showDashboard() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    }

    function showLogin() {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    }
});
