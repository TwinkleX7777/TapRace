// Firebase configuration (must match your admin.js)
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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// DOM elements
const leaderboardList = document.getElementById("leaderboard-list");
const resetBtn = document.getElementById("reset-btn");

// Load Leaderboard (Top 10 High Scores)
function loadLeaderboard() {
    leaderboardList.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    db.ref("players").orderByChild("scores").limitToLast(10).once("value", (snapshot) => {
        let players = [];
        snapshot.forEach(child => {
            players.push({
                id: child.key,
                name: child.val().name || "Anonymous",
                score: child.val().scores || 0
            });
        });

        // Sort high-to-low
        players.sort((a, b) => b.score - a.score);

        // Render table
        let html = '';
        players.forEach((player, index) => {
            html += `
                <tr>
                    <td>#${index + 1}</td>
                    <td>${player.name}</td>
                    <td><input type="number" value="${player.score}" id="score-${player.id}"></td>
                    <td>
                        <button onclick="updateScore('${player.id}')">✅ Update</button>
                        <button onclick="removePlayer('${player.id}')">❌ Remove</button>
                    </td>
                </tr>
            `;
        });

        leaderboardList.innerHTML = html || "<tr><td colspan='4'>No players found!</td></tr>";
    });
}

// Update Player Score
function updateScore(playerId) {
    const scoreInput = document.getElementById(`score-${playerId}`);
    const newScore = parseInt(scoreInput.value);

    if (isNaN(newScore) || newScore < 0) {
        alert("Please enter a valid positive number!");
        scoreInput.focus();
        return;
    }

    db.ref(`players/${playerId}`).update({ scores: newScore })
        .then(() => {
            loadLeaderboard(); // Refresh after update
        })
        .catch(error => alert("Update failed: " + error.message));
}

// Remove Player
function removePlayer(playerId) {
    if (confirm("Permanently remove this player?")) {
        db.ref(`players/${playerId}`).remove()
            .then(() => loadLeaderboard())
            .catch(error => alert("Delete failed: " + error.message));
    }
}

// Reset Entire Leaderboard
resetBtn.addEventListener("click", () => {
    if (confirm("⚠ WARNING: This will delete ALL player data!")) {
        db.ref("players").remove()
            .then(() => {
                alert("Leaderboard reset!");
                loadLeaderboard();
            })
            .catch(error => alert("Reset failed: " + error.message));
    }
});

// Initial load
window.addEventListener("DOMContentLoaded", loadLeaderboard);
