// withdrawals.js - Improved Version

// Firebase Initialization (Ensure no duplicates)
if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
        authDomain: "taprace-63f8e.firebaseapp.com",
        databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
        projectId: "taprace-63f8e",
        storageBucket: "taprace-63f8e.appspot.com",
        messagingSenderId: "93332718324",
        appId: "1:93332718324:web:4b48350c0b64061eb794a1"
    };
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// DOM Elements
const withdrawalList = document.getElementById("withdrawal-list");

// Format Currency
function formatCurrency(amount) {
    return `$${Number(amount).toFixed(2)}`;
}

// Load Withdrawals with realtime updates
function loadWithdrawals() {
    withdrawalList.innerHTML = "<tr><td colspan='5'>Loading requests...</td></tr>";
    
    db.ref("withdraw_requests").on("value", handleSnapshot, handleError);
}

function handleSnapshot(snapshot) {
    withdrawalList.innerHTML = "";

    if (!snapshot.exists()) {
        withdrawalList.innerHTML = "<tr><td colspan='5'>No withdrawal requests found</td></tr>";
        return;
    }

    let html = '';
    snapshot.forEach(child => {
        const data = child.val();
        html += `
            <tr data-id="${child.key}">
                <td>${data.playerName || "Unknown Player"}</td>
                <td>${formatCurrency(data.amount || 0)}</td>
                <td>${data.paymentMethod || data.wallet || "N/A"}</td>
                <td class="status-${data.status}">${data.status || "pending"}</td>
                <td>
                    <button class="approve-btn" onclick="approveWithdrawal('${child.key}')">✅</button>
                    <button class="reject-btn" onclick="rejectWithdrawal('${child.key}')">❌</button>
                </td>
            </tr>
        `;
    });
    
    withdrawalList.innerHTML = html;
}

function handleError(error) {
    console.error("Withdrawal error:", error);
    withdrawalList.innerHTML = `<tr><td colspan='5'>Error loading data: ${error.message}</td></tr>`;
}

// Approval Logic
function approveWithdrawal(id) {
    if (confirm("Are you sure you want to approve this withdrawal?")) {
        db.ref(`withdraw_requests/${id}`)
            .update({ 
                status: "approved",
                approvedAt: Date.now() 
            })
            .catch(error => alert(`Approval failed: ${error.message}`));
    }
}

// Rejection Logic
function rejectWithdrawal(id) {
    if (confirm("Are you sure you want to reject this withdrawal?")) {
        db.ref(`withdraw_requests/${id}`)
            .update({ 
                status: "rejected",
                rejectedAt: Date.now() 
            })
            .catch(error => alert(`Rejection failed: ${error.message}`));
    }
}

// Initialize when admin dashboard loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("withdrawal-list")) {
        loadWithdrawals();
    }
});
