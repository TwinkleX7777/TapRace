// admin.js
document.addEventListener("DOMContentLoaded", function() {
    const auth = firebase.auth();
    const db = firebase.database();

    // Auth State Listener
    auth.onAuthStateChanged(user => {
        if (user) {
            showDashboard();
            loadInitialData();
        } else {
            showLogin();
        }
    });

    // Login Handler
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorElement = document.getElementById("login-error");

        if (!email || !password) {
            errorElement.textContent = "Please fill all fields";
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                errorElement.textContent = error.message;
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
        });
    });

    function showDashboard() {
        document.getElementById("login-page").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
    }

    function showLogin() {
        document.getElementById("admin-dashboard").style.display = "none";
        document.getElementById("login-page").style.display = "block";
    }

    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('#content > div').forEach(div => {
            div.style.display = 'none';
        });
        
        // Show selected section
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'block';
        
        // Load section data
        switch(sectionId) {
            case 'players':
                loadPlayers();
                break;
            case 'ads':
                loadAds();
                break;
        }
    }

    async function loadInitialData() {
        loadPlayers();
        loadAds();
    }

    // Players Management
    async function loadPlayers() {
        const snapshot = await db.ref('players').get();
        const players = snapshot.val();
        const tbody = document.getElementById("players-list");
        tbody.innerHTML = '';
        
        for(const [playerId, playerData] of Object.entries(players)) {
            tbody.innerHTML += `
                <tr>
                    <td>${playerId}</td>
                    <td>${playerData.username || 'N/A'}</td>
                    <td>${playerData.score || 0}</td>
                    <td>
                        <button class="action-btn delete-btn" 
                                onclick="deletePlayer('${playerId}')">Delete</button>
                    </td>
                </tr>
            `;
        }
    }

    // Ads Management
    async function loadAds() {
        const snapshot = await db.ref('ads').get();
        const ads = snapshot.val();
        const tbody = document.getElementById("ad-settings");
        tbody.innerHTML = '';
        
        for(const [adId, adData] of Object.entries(ads)) {
            tbody.innerHTML += `
                <tr>
                    <td>${adId}</td>
                    <td>${adData.type || 'N/A'}</td>
                    <td>${adData.enabled ? 'Active' : 'Disabled'}</td>
                    <td>
                        <button class="action-btn" 
                                onclick="toggleAd('${adId}', ${!adData.enabled})">
                            ${adData.enabled ? 'Disable' : 'Enable'}
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    // Delete Player
    window.deletePlayer = async function(playerId) {
        if(confirm('Delete this player?')) {
            await db.ref(`players/${playerId}`).remove();
            loadPlayers();
        }
    }

    // Toggle Ad Status
    window.toggleAd = async function(adId, status) {
        await db.ref(`ads/${adId}/enabled`).set(status);
        loadAds();
    }
});
