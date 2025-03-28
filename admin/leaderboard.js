// Initialize Firebase Database
const db = firebase.database();

// Load Leaderboard Data (Fixed)
function loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    db.ref("players").orderByChild("scores").once("value", (snapshot) => {
        leaderboardList.innerHTML = ""; // Clear old data
        let rank = 1;

        if (!snapshot.exists()) {
            leaderboardList.innerHTML = "<tr><td colspan='4'>No players found.</td></tr>";
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const playerData = childSnapshot.val();
            const playerId = childSnapshot.key;

            if (playerData.name && playerData.scores !== undefined) {
                let row = `
                    <tr>
                        <td>#${rank++}</td>
                        <td>${playerData.name}</td>
                        <td><input type="number" value="${playerData.scores}" id="score-${playerId}"></td>
                        <td>
                            <button onclick="updateScore('${playerId}')">✅ Update</button>
                            <button onclick="removePlayer('${playerId}')">❌ Remove</button>
                        </td>
                    </tr>
                `;
                leaderboardList.innerHTML += row;
            }
        });
    });
}

// Update Score (Fixed)
function updateScore(playerId) {
    const newScore = document.getElementById(`score-${playerId}`).value;
    db.ref(`players/${playerId}`).update({ scores: parseInt(newScore) })
        .then(() => alert("✅ Score Updated!"))
        .catch((error) => alert("❌ Error: " + error.message));
}

// Remove Player (Fixed)
function removePlayer(playerId) {
    if (confirm("Are you sure you want to remove this player?")) {
        db.ref(`players/${playerId}`).remove()
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
        db.ref("players").remove()
            .then(() => alert("✅ Leaderboard Reset!"))
            .catch((error) => alert("❌ Error: " + error.message));
    }
}

// Load leaderboard when page loads
document.addEventListener("DOMContentLoaded", loadLeaderboard);
