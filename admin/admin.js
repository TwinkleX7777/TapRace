// Firebase Configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
    authDomain: "taprace-63f8e.firebaseapp.com",
    databaseURL: "https://taprace-taffe-default-rtdb.firebaseio.com",
    projectId: "taprace-63f8e",
    storageBucket: "taprace-63f8e.appspot.com",
    messagingSenderId: "93332718324",
    appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Auth State
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        showSection('players');
    } else {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    }
});

// Login
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    errorElement.textContent = '';
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => errorElement.textContent = error.message);
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());

// Navigation
document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', function() {
        const sectionId = this.dataset.section;
        document.querySelectorAll('#content > div').forEach(div => div.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        
        switch(sectionId) {
            case 'players': loadPlayers(); break;
            case 'withdrawals': loadWithdrawals(); break;
            case 'ads': loadAds(); break;
            case 'settings': loadSettings(); break;
        }
    });
});

// Data Loaders
async function loadPlayers() {
    const snapshot = await db.ref('players').get();
    const players = snapshot.val();
    const tbody = document.getElementById('players-list');
    tbody.innerHTML = '';
    
    for(const [id, player] of Object.entries(players)) {
        tbody.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${player.username || 'N/A'}</td>
                <td>${player.score || 0}</td>
                <td><button onclick="deletePlayer('${id}')">Delete</button></td>
            </tr>
        `;
    }
}

async function loadWithdrawals() {
    const snapshot = await db.ref('withdraw_requests').get();
    const requests = snapshot.val();
    const tbody = document.getElementById('withdrawals-list');
    tbody.innerHTML = '';
    
    for(const [id, request] of Object.entries(requests)) {
        tbody.innerHTML += `
            <tr>
                <td>${request.playerName}</td>
                <td>${request.amount}</td>
                <td>${request.status}</td>
                <td>
                    <button onclick="approveWithdrawal('${id}')">Approve</button>
                    <button onclick="rejectWithdrawal('${id}')">Reject</button>
                </td>
            </tr>
        `;
    }
}

async function loadAds() {
    const snapshot = await db.ref('ads').get();
    const ads = snapshot.val();
    const tbody = document.getElementById('ads-list');
    tbody.innerHTML = '';
    
    for(const [id, ad] of Object.entries(ads)) {
        tbody.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${ad.type}</td>
                <td>${ad.enabled ? 'Active' : 'Disabled'}</td>
                <td><button onclick="toggleAd('${id}', ${!ad.enabled})">
                    ${ad.enabled ? 'Disable' : 'Enable'}
                </button></td>
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

// Actions
window.deletePlayer = async (playerId) => {
    if(confirm('Delete player?')) await db.ref(`players/${playerId}`).remove();
    loadPlayers();
};

window.approveWithdrawal = async (id) => {
    await db.ref(`withdraw_requests/${id}/status`).set('approved');
    loadWithdrawals();
};

window.rejectWithdrawal = async (id) => {
    await db.ref(`withdraw_requests/${id}/status`).set('rejected');
    loadWithdrawals();
};

window.toggleAd = async (id, status) => {
    await db.ref(`ads/${id}/enabled`).set(status);
    loadAds();
};

window.saveSettings = async () => {
    await db.ref('settings').update({
        max_daily_taps: document.getElementById('max-taps').value,
        min_withdrawal: document.getElementById('min-withdrawal').value
    });
    alert('Settings saved!');
};
