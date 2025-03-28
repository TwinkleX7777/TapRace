// Initialize Firebase Database
const db = firebase.database();

// Load Withdrawal Requests
function loadWithdrawals() {
    const withdrawalList = document.getElementById("withdrawal-list");
    withdrawalList.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    db.ref("withdrawals").once("value", (snapshot) => {
        withdrawalList.innerHTML = "";
        
        snapshot.forEach((childSnapshot) => {
            const withdrawal = childSnapshot.val();
            const requestId = childSnapshot.key;

            let row = `
                <tr>
                    <td>${withdrawal.playerName}</td>
                    <td>${withdrawal.amount}</td>
                    <td>${withdrawal.paymentMethod}</td>
                    <td>${withdrawal.status}</td>
                    <td>
                        <button onclick="approveWithdrawal('${requestId}')">✅ Approve</button>
                        <button onclick="rejectWithdrawal('${requestId}')">❌ Reject</button>
                    </td>
                </tr>
            `;
            withdrawalList.innerHTML += row;
        });
    });
}

// Approve Withdrawal
function approveWithdrawal(requestId) {
    db.ref(`withdrawals/${requestId}`).update({ status: "approved" })
        .then(() => {
            alert("✅ Withdrawal Approved!");
            loadWithdrawals(); // Reload list
        })
        .catch((error) => alert("❌ Error: " + error.message));
}

// Reject Withdrawal
function rejectWithdrawal(requestId) {
    db.ref(`withdrawals/${requestId}`).update({ status: "rejected" })
        .then(() => {
            alert("❌ Withdrawal Rejected!");
            loadWithdrawals(); // Reload list
        })
        .catch((error) => alert("❌ Error: " + error.message));
}

// Load withdrawals when page loads
document.addEventListener("DOMContentLoaded", loadWithdrawals);
