// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadWithdrawals() {
  const withdrawalList = document.getElementById("withdrawal-list");
  withdrawalList.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  // ✅ 1. CHANGE THIS PATH IF NEEDED (verify in Firebase Console)
  db.ref("withdraw_requests").once("value", (snapshot) => {
    console.log("Firebase Data:", snapshot.val()); // Debug
    
    withdrawalList.innerHTML = "";
    
    if (!snapshot.exists()) {
      withdrawalList.innerHTML = "<tr><td colspan='5'>No requests found. Add test data?</td></tr>";
      return;
    }

    // ✅ 2. HANDLE FIELD NAME VARIATIONS
    snapshot.forEach(child => {
      const data = child.val();
      const row = `
        <tr>
          <td>${data.playerName || data.username || "Unknown"}</td>
          <td>$${data.amount || 0}</td>
          <td>${data.wallet || data.paymentMethod || "N/A"}</td>
          <td>${data.status || "pending"}</td>
          <td>
            <button onclick="approveWithdrawal('${child.key}')">✅ Approve</button>
            <button onclick="rejectWithdrawal('${child.key}')">❌ Reject</button>
          </td>
        </tr>
      `;
      withdrawalList.innerHTML += row;
    });
  }).catch(error => {
    console.error("Firebase Error:", error);
    withdrawalList.innerHTML = `<tr><td colspan='5'>Error loading data</td></tr>`;
  });
}

// Load on startup
window.addEventListener("DOMContentLoaded", loadWithdrawals);
