// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Load Withdrawal Requests
function loadWithdrawals() {
    const withdrawalList = document.getElementById("withdrawal-list");
    withdrawalList.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    // Changed from "withdrawals" to "withdraw_requests"
    db.ref("withdraw_requests").once("value", (snapshot) => {
        withdrawalList.innerHTML = "";
        
        if (!snapshot.exists()) {
            withdrawalList.innerHTML = "<tr><td colspan='5'>No withdrawal requests found</td></tr>";
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const withdrawal = childSnapshot.val();
            const requestId = childSnapshot.key;

            // Added fallbacks for missing data
            let row = `
                <tr>
                    <td>${withdrawal.playerName || 'Unknown Player'}</td>
                    <td>$${withdrawal.amount || '0'}</td>
                    <td>${withdrawal.paymentMethod || withdrawal.wallet || 'N/A'}</td>
                    <td>${withdrawal.status || 'pending'}</td>
                    <td>
                        <button onclick="approveWithdrawal('${requestId}')">✅ Approve</button>
                        <button onclick="rejectWithdrawal('${requestId}')">❌ Reject</button>
                    </td>
                </tr>
            `;
            withdrawalList.innerHTML += row;
        });
    }).catch((error) => {
        withdrawalList.innerHTML = `<tr><td colspan='5'>Error loading data: ${error.message}</td></tr>`;
    });
}

// Approve Withdrawal
function approveWithdrawal(requestId) {
    if (confirm("Are you sure you want to approve this withdrawal?")) {
        db.ref(`withdraw_requests/${requestId}`).update({ 
            status: "approved",
            approvedAt: Date.now() 
        })
        .then(() => {
            alert("✅ Withdrawal Approved!");
            loadWithdrawals();
        })
        .catch((error) => alert("❌ Error: " + error.message));
    }
}

// Reject Withdrawal
function rejectWithdrawal(requestId) {
    if (confirm("Are you sure you want to reject this withdrawal?")) {
        db.ref(`withdraw_requests/${requestId}`).update({ 
            status: "rejected",
            rejectedAt: Date.now() 
        })
        .then(() => {
            alert("❌ Withdrawal Rejected!");
            loadWithdrawals();
        })
        .catch((error) => alert("❌ Error: " + error.message));
    }
}

// Load withdrawals when page loads
document.addEventListener("DOMContentLoaded", loadWithdrawals);
