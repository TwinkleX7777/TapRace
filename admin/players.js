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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fetch and display players
function loadPlayers() {
    const playersList = document.getElementById("players-list");
    playersList.innerHTML = "<tr><td colspan='5'>Loading players...</td></tr>";

    database.ref("players").once("value", (snapshot) => {
        playersList.innerHTML = ""; // Clear the loading message

        snapshot.forEach((childSnapshot) => {
            const player = childSnapshot.val();
            const playerId = childSnapshot.key;

            const row = `
                <tr>
                    <td>${playerId}</td>
                    <td>${player.username || "N/A"}</td>
                    <td>${player.email || "N/A"}</td>
                    <td>${player.score || 0}</td>
                    <td>
                        <button onclick="deletePlayer('${playerId}')">❌ Delete</button>
                    </td>
                </tr>
            `;
            playersList.innerHTML += row;
        });
    });
}

// Delete Player
function deletePlayer(playerId) {
    if (confirm("Are you sure you want to delete this player?")) {
        database.ref("players/" + playerId).remove()
            .then(() => {
                alert("Player deleted successfully!");
                loadPlayers(); // Refresh the list
            })
            .catch((error) => {
                alert("Error deleting player: " + error.message);
            });
    }
}

// Load players when the page opens
document.addEventListener("DOMContentLoaded", loadPlayers);
