// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Load Ad Settings
function loadAdSettings() {
    const adSettingsTable = document.getElementById("ad-settings");
    adSettingsTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    db.ref("ads").once("value", (snapshot) => {
        adSettingsTable.innerHTML = ""; // Clear loading message
        if (!snapshot.exists()) {
            adSettingsTable.innerHTML = "<tr><td colspan='3'>No ad settings found</td></tr>";
            return;
        }

        let adsData = snapshot.val();
        Object.keys(adsData).forEach(network => {
            Object.keys(adsData[network]).forEach(adType => {
                const enabled = adsData[network][adType];
                const row = `
                    <tr>
                        <td>${network}</td>
                        <td>${adType}</td>
                        <td>
                            <button onclick="toggleAd('${network}', '${adType}', ${enabled})">
                                ${enabled ? "✅ Enabled" : "❌ Disabled"}
                            </button>
                        </td>
                    </tr>
                `;
                adSettingsTable.innerHTML += row;
            });
        });
    });
}

// Toggle Ad Status
function toggleAd(network, adType, currentStatus) {
    const newStatus = !currentStatus;
    db.ref(`ads/${network}/${adType}`).set(newStatus)
        .then(() => {
            alert(`Updated ${adType} (${network}): ${newStatus ? "Enabled" : "Disabled"}`);
            loadAdSettings(); // Refresh table
        })
        .catch(error => {
            console.error("Update failed:", error);
        });
}

// Load Ad Settings on Page Load
document.addEventListener("DOMContentLoaded", loadAdSettings);
