// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Load Withdrawal Requests
function loadWithdrawals() {
  const withdrawalList = document.getElementById("withdrawal-list");
  withdrawalList.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  db.ref("withdraw_requests").orderByChild("timestamp").once("value", (snapshot) => {
    withdrawalList.innerHTML = ""; // Clear loading message

    console.log("✅ Firebase Data Snapshot:", snapshot.val()); // ✅ Check if data is received

    if (!snapshot.exists()) {
      withdrawalList.innerHTML = "<tr><td colspan='5'>No requests found</td></tr>";
      return;
    }

    let requests = [];
    snapshot.forEach(child => {
      console.log("📌 Child Data:", child.val()); // ✅ Check each request
      requests.push({
        id: child.key,
        ...child.val() // Spread all data (playerName, amount, etc.)
      });
    });

    // Sort by newest first
    requests.sort((a, b) => b.timestamp - a.timestamp);

    console.log("📊 Sorted Requests:", requests); // ✅ Check sorted data

    // Render rows
    requests.forEach(request => {
      const row = `
        <tr>
          <td>${request.playerName || "Unknown"}</td>
          <td>$${request.amount || 0}</td>
          <td>${request.wallet || "N/A"}</td>
          <td>${request.status || "pending"}</td>
          <td>
            <button onclick="approveWithdrawal('${request.id}')">✅ Approve</button>
            <button onclick="rejectWithdrawal('${request.id}')">❌ Reject</button>
          </td>
        </tr>
      `;
      withdrawalList.innerHTML += row;
    });
  }).catch(error => {
    withdrawalList.innerHTML = `<tr><td colspan='5'>Error: ${error.message}</td></tr>`;
    console.error("❌ Firebase error:", error);
  });
}

// Approve/Reject functions remain the same
document.addEventListener("DOMContentLoaded", loadWithdrawals);
