// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
    authDomain: "taprace-63f8e.firebaseapp.com",
    databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
    projectId: "taprace-63f8e",
    storageBucket: "taprace-63f8e.appspot.com",
    messagingSenderId: "93332718324",
    appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadPlayers() {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    db.ref("players").once("value", (snapshot) => {
        playerList.innerHTML = "";

        if (!snapshot.exists()) {
            playerList.innerHTML = "<tr><td colspan='3'>No players found</td></tr>";
            return;
        }

        snapshot.forEach((child) => {
            const player = child.val();
            const row = `
                <tr>
                    <td>${player.name || "Unknown"}</td>
                    <td>${player.clicks || 0}</td>
                    <td>
                        <button onclick="resetClicks('${child.key}')">Reset Clicks</button>
                    </td>
                </tr>
            `;
            playerList.innerHTML += row;
        });
    }).catch(error => {
        playerList.innerHTML = `<tr><td colspan='3'>Error: ${error.message}</td></tr>`;
        console.error("Firebase error:", error);
    });
}

function resetClicks(playerId) {
    db.ref(`players/${playerId}/clicks`).set(0)
        .then(() => alert("Clicks reset successfully!"))
        .catch(error => alert("Error: " + error.message));
}

document.addEventListener("DOMContentLoaded", loadPlayers);
