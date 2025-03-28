// ✅ Initialize Firebase if not already initialized
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Function to load ads settings from Firebase
function loadAdsSettings() {
    const adSettingsTable = document.getElementById("ad-settings");
    adSettingsTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    db.ref("ads").once("value", (snapshot) => {
        adSettingsTable.innerHTML = ""; // Clear loading message

        if (!snapshot.exists()) {
            adSettingsTable.innerHTML = "<tr><td colspan='3'>No ads configured</td></tr>";
            return;
        }

        snapshot.forEach((network) => {
            const networkName = network.key; // Example: adsterra, propeller

            network.forEach((ad) => {
                const adType = ad.key;
                const status = ad.val() ? "✅ Enabled" : "❌ Disabled";

                // Add row to table
                const row = `
                    <tr>
                        <td>${networkName}</td>
                        <td>${adType}</td>
                        <td>${status}</td>
                    </tr>
                `;
                adSettingsTable.innerHTML += row;
            });
        });
    }).catch(error => {
        adSettingsTable.innerHTML = `<tr><td colspan='3'>Error: ${error.message}</td></tr>`;
        console.error("Firebase error:", error);
    });
}

// ✅ Ensure script runs when admin clicks "Ads Management"
document.getElementById("manage-ads").addEventListener("click", () => {
    document.getElementById("ads-management").style.display = "block";
    loadAdsSettings();
});

// ✅ Ensure script loads on page load
document.addEventListener("DOMContentLoaded", loadAdsSettings);
