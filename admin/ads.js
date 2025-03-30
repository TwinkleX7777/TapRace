// ads.js
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.database();
    const adsContent = document.getElementById('ads-management');

    function loadAds() {
        adsContent.innerHTML = '<p>Loading ad settings...</p>';
        
        db.ref('ads').once('value', snapshot => {
            let html = `
                <h2>Ads Management</h2>
                <table class="data-table">
                    <tr>
                        <th>Network</th>
                        <th>Ad Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
            `;

            if (snapshot.exists()) {
                snapshot.forEach(network => {
                    const networkName = network.key;
                    network.forEach(adType => {
                        html += `
                            <tr>
                                <td>${networkName}</td>
                                <td>${adType.key.replace(/_/g, ' ')}</td>
                                <td class="status-${adType.val() ? 'active' : 'inactive'}">
                                    ${adType.val() ? '✅ Active' : '❌ Disabled'}
                                </td>
                                <td>
                                    <button onclick="toggleAd('${networkName}', '${adType.key}')" class="toggle-btn">
                                        ${adType.val() ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                });
            } else {
                html += `<tr><td colspan="4">No ad configurations found</td></tr>`;
            }

            html += '</table>';
            adsContent.innerHTML = html;
        });
    }

    window.toggleAd = (network, adType) => {
        const ref = db.ref(`ads/${network}/${adType}`);
        ref.transaction(current => {
            return !current;
        });
    };

    document.getElementById('manage-ads').addEventListener('click', loadAds);
});
