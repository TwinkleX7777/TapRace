// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadAdsSettings() {
    const adSettingsTable = document.getElementById("ad-settings");
    adSettingsTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    db.ref("ads").once("value", (snapshot) => {
        adSettingsTable.innerHTML = "";
        
        if (!snapshot.exists()) {
            adSettingsTable.innerHTML = "<tr><td colspan='3'>No ads configured</td></tr>";
            return;
        }

        let html = '';
        snapshot.forEach((networkSnapshot) => {
            const networkName = networkSnapshot.key;
            const networkData = networkSnapshot.val();

            // ✅ Process object data correctly
            Object.entries(networkData).forEach(([adType, isEnabled]) => {
                html += `
                    <tr>
                        <td>${networkName}</td>
                        <td>${adType.replace(/_/g, ' ')}</td>
                        <td>${isEnabled ? "✅ Enabled" : "❌ Disabled"}</td>
                    </tr>
                `;
            });
        });

        adSettingsTable.innerHTML = html || "<tr><td colspan='3'>No ads found</td></tr>";
    }).catch(error => {
        adSettingsTable.innerHTML = `<tr><td colspan='3'>Error: ${error.message}</td></tr>`;
        console.error("Firebase error:", error);
    });
}

// ✅ Show ads panel when clicking "Ads Management" button
document.getElementById("manage-ads").addEventListener("click", () => {
    document.getElementById("ads-management").style.display = "block";
    loadAdsSettings();
});

// Initial load (optional)
document.addEventListener("DOMContentLoaded", () => {
    // Only load if ads panel is visible by default
    if (document.getElementById("ads-management").style.display === "block") {
        loadAdsSettings();
    }
});
