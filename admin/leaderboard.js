// Initialize Firebase Database
const db = firebase.database();

// Load Leaderboard Data
function loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "Loading...";

    db.ref("leaderboard").orderByChild("score").once("value", (snapshot) => {
        leaderboardList.innerHTML = "";
        let rank = 1;

        snapshot.forEach((childSnapshot) => {
            const player = childSnapshot.val();
            const playerId = childSnapshot.key;

            let row = `
                <tr>
                    <td>#${rank++}</td>
                    <td>${player.name}</td>
                    <td><input type="number" value="${player.score}" id="score-${playerId}"></td>
                    <td>
                        <button onclick="updateScore('${playerId}')">✅ Update</button>
                        <button onclick="removePlayer('${playerId}')">❌ Remove</button>
                    </td>
                </tr>
            `;
            leaderboardList.innerHTML += row;
        });
    });
}

// Update Score
function updateScore(playerId) {
    const newScore = document.getElementById(`score-${playerId}`).value;
    db.ref(`leaderboard/${playerId}`).update({ score: parseInt(newScore) })
        .then(() => alert("✅ Score Updated!"))
        .catch((error) => alert("❌ Error: " + error.message));
}

// Remove Player
function removePlayer(playerId) {
    if (confirm("Are you sure you want to remove this player?")) {
        db.ref(`leaderboard/${playerId}`).remove()
            .then(() => {
                alert("✅ Player Removed!");
                loadLeaderboard(); // Reload list
            })
            .catch((error) => alert("❌ Error: " + error.message));
    }
}

// Reset Leaderboard
function resetLeaderboard() {
    if (confirm("⚠ Are you sure you want to reset the leaderboard?")) {
        db.ref("leaderboard").remove()
            .then(() => alert("✅ Leaderboard Reset!"))
            .catch((error) => alert("❌ Error: " + error.message));
    }
}

// Load leaderboard when page loads
document.addEventListener("DOMContentLoaded", loadLeaderboard);
