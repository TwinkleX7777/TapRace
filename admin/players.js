// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
    authDomain: "taprace-63f8e.firebaseapp.com",
    databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
    projectId: "taprace-63f8e",
    storageBucket: "taprace-63f8e.appspot.com",
    messagingSenderId: "93332718324",
    appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// ✅ Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ✅ Load Players from Firebase
function loadPlayers() {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "<tr><td colspan='9'>Loading players...</td></tr>";

    db.ref("players").on("value", (snapshot) => {
        playerList.innerHTML = "";

        if (!snapshot.exists()) {
            playerList.innerHTML = "<tr><td colspan='9'>No players found</td></tr>";
            return;
        }

        snapshot.forEach((child) => {
            const player = child.val();
            const row = `
                <tr>
                    <td>${child.key}</td>
                    <td>${player.name || "Unknown"}</td>
                    <td>${player.email || "N/A"}</td>
                    <td>${player.totalClicks || 0}</td>
                    <td>${player.rank || "N/A"}</td>
                    <td>${player.walletBalance ? player.walletBalance.toFixed(3) + " ETH" : "0.000 ETH"}</td>
                    <td>${player.registrationDate || "Unknown"}</td>
                    <td>${player.banned ? '❌ Banned' : '✅ Active'}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" onclick="editPlayer('${child.key}')">Edit</button>
                        <button class="ban-btn" onclick="toggleBan('${child.key}', ${player.banned})">
                            ${player.banned ? 'Unban' : 'Ban'}
                        </button>
                    </td>
                </tr>
            `;
            playerList.innerHTML += row;
        });
    }, (error) => {
        console.error("Firebase error:", error);
        playerList.innerHTML = `<tr><td colspan='9'>⚠️ Error loading players</td></tr>`;
    });
}

// ✅ Toggle Player Ban/Unban
function toggleBan(playerId, isBanned) {
    const newStatus = !isBanned;
    db.ref(`players/${playerId}`).update({ banned: newStatus })
        .then(() => alert(`Player ${newStatus ? 'banned' : 'unbanned'} successfully!`))
        .catch(error => alert("Error: " + error.message));
}

// ✅ Ensure Firebase Authentication Before Loading Players
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("✅ User authenticated, loading players...");
        loadPlayers();
    } else {
        console.log("❌ User not logged in");
    }
});
