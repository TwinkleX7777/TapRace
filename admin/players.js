// players.js
function loadPlayers() {
    const content = document.getElementById('players-management');
    content.innerHTML = '<p>Loading players...</p>';

    firebase.database().ref('players').once('value').then(snapshot => {
        let html = '<h2>Players List</h2><table border="1" style="width:100%">';
        html += '<tr><th>ID</th><th>Name</th><th>Score</th></tr>';

        snapshot.forEach(player => {
            const data = player.val();
            html += `
                <tr>
                    <td>${player.key}</td>
                    <td>${data.name || 'Anonymous'}</td>
                    <td>${data.score || 0}</td>
                </tr>
            `;
        });

        content.innerHTML = html + '</table>';
    });
}

document.getElementById('manage-players').addEventListener('click', loadPlayers);
