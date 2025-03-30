// ads.js
function loadAdsSettings() {
    const adSettings = document.getElementById('ad-settings');
    adSettings.innerHTML = '<tr><td colspan="3">Loading ads...</td></tr>';

    firebase.database().ref('ads').once('value').then(snapshot => {
        adSettings.innerHTML = '';
        if (!snapshot.exists()) return;

        snapshot.forEach(network => {
            const networkName = network.key;
            Object.entries(network.val()).forEach(([adType, isActive]) => {
                adSettings.innerHTML += `
                    <tr>
                        <td>${networkName}</td>
                        <td>${adType.replace(/_/g, ' ')}</td>
                        <td>${isActive ? '✅ Active' : '❌ Disabled'}</td>
                    </tr>
                `;
            });
        });
    });
}

// Connect to button click
document.getElementById('manage-ads').addEventListener('click', loadAdsSettings);
