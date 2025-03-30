// players.js
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.database();
    const playersContent = document.getElementById('players-management');

    function loadPlayers() {
        playersContent.innerHTML = '<p>Loading players...</p>';
        
        db.ref('players').orderByChild('score').limitToLast(100).once('value', snapshot => {
            let html = `
                <h2>Players Management</h2>
                <table class="data-table">
                    <tr>
                        <th>Player ID</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                    </tr>
            `;

            if (snapshot.exists()) {
                snapshot.forEach(child => {
                    const player = child.val();
                    html += `
                        <tr>
                            <td>${child.key}</td>
                            <td>${player.name || 'Anonymous'}</td>
                            <td>${player.score || 0}</td>
                            <td>${new Date(player.lastActive).toLocaleString()}</td>
                            <td>
                                <button onclick="deletePlayer('${child.key}')" class="delete-btn">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                html += `<tr><td colspan="5">No players found</td></tr>`;
            }

            html += '</table>';
            playersContent.innerHTML = html;
        });
    }

    window.deletePlayer = (playerId) => {
        if (confirm(`Delete player ${playerId} permanently?`)) {
            db.ref(`players/${playerId}`).remove()
                .then(() => loadPlayers())
                .catch(error => alert('Delete failed: ' + error.message));
        }
    };

    document.getElementById('manage-players').addEventListener('click', loadPlayers);
});
