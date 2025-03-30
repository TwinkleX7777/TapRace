// leaderboard.js
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.database();
    const leaderboardContent = document.getElementById('leaderboard-management');

    function loadLeaderboard() {
        leaderboardContent.innerHTML = '<p>Loading leaderboard...</p>';
        
        db.ref('players').orderByChild('score').limitToLast(10).once('value', snapshot => {
            let players = [];
            snapshot.forEach(child => {
                players.push({
                    id: child.key,
                    ...child.val()
                });
            });

            // Sort descending by score
            players.sort((a, b) => (b.score || 0) - (a.score || 0));

            let html = `
                <h2>Leaderboard Control</h2>
                <table class="data-table">
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Actions</th>
                    </tr>
            `;

            players.forEach((player, index) => {
                html += `
                    <tr>
                        <td>#${index + 1}</td>
                        <td>${player.name || 'Anonymous'}</td>
                        <td>${player.score || 0}</td>
                        <td>
                            <input type="number" id="score-${player.id}" value="${player.score || 0}">
                            <button onclick="updateScore('${player.id}')" class="update-btn">Update</button>
                        </td>
                    </tr>
                `;
            });

            html += '</table>';
            leaderboardContent.innerHTML = html;
        });
    }

    window.updateScore = (playerId) => {
        const newScore = document.getElementById(`score-${playerId}`).value;
        if (confirm(`Update score for player ${playerId} to ${newScore}?`)) {
            db.ref(`players/${playerId}/score`).set(Number(newScore))
                .then(() => loadLeaderboard())
                .catch(error => alert('Update failed: ' + error.message));
        }
    };

    document.getElementById('manage-leaderboard').addEventListener('click', loadLeaderboard);
});
