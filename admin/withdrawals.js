// Firebase config (DO NOT CHANGE)
const firebaseConfig = {
  apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
  authDomain: "taprace-63f8e.firebaseapp.com",
  databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
  projectId: "taprace-63f8e",
  storageBucket: "taprace-63f8e.appspot.com",
  messagingSenderId: "93332718324",
  appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Load Withdrawals
function loadWithdrawals() {
  const list = document.getElementById("withdrawal-list");
  list.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  db.ref("withdraw_requests").once("value", (snapshot) => {
    list.innerHTML = "";
    
    if (!snapshot.exists()) {
      list.innerHTML = "<tr><td colspan='5'>No pending requests</td></tr>";
      return;
    }

    let html = '';
    snapshot.forEach(child => {
      const data = child.val();
      html += `
        <tr>
          <td>${data.playerName || "Unknown"}</td>
          <td>$${data.amount}</td>
          <td>${data.paymentMethod}</td>
          <td>${data.status}</td>
          <td>
            <button onclick="approve('${child.key}')">✅ Approve</button>
            <button onclick="reject('${child.key}')">❌ Reject</button>
          </td>
        </tr>
      `;
    });
    list.innerHTML = html;
  });
}

// Approve
function approve(id) {
  if (confirm("Approve this request?")) {
    db.ref(`withdraw_requests/${id}`).update({ status: "approved" });
    loadWithdrawals();
  }
}

// Reject
function reject(id) {
  if (confirm("Reject this request?")) {
    db.ref(`withdraw_requests/${id}`).update({ status: "rejected" });
    loadWithdrawals();
  }
}

// Start
window.addEventListener("DOMContentLoaded", loadWithdrawals);
