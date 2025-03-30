// withdrawals.js
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.database();
    const withdrawalsContent = document.getElementById('withdrawals-management');

    function loadWithdrawals() {
        withdrawalsContent.innerHTML = '<p>Loading withdrawal requests...</p>';
        
        db.ref('withdraw_requests').orderByChild('timestamp').once('value', snapshot => {
            let html = `
                <h2>Withdrawal Requests</h2>
                <table class="data-table">
                    <tr>
                        <th>Player</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
            `;

            if (snapshot.exists()) {
                snapshot.forEach(child => {
                    const request = child.val();
                    html += `
                        <tr>
                            <td>${request.playerName || 'Unknown'}</td>
                            <td>$${(request.amount || 0).toFixed(2)}</td>
                            <td>${request.paymentMethod || request.wallet || 'N/A'}</td>
                            <td class="status-${request.status}">${request.status || 'pending'}</td>
                            <td>
                                <button onclick="approveRequest('${child.key}')" class="approve-btn">Approve</button>
                                <button onclick="rejectRequest('${child.key}')" class="reject-btn">Reject</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                html += `<tr><td colspan="5">No withdrawal requests</td></tr>`;
            }

            html += '</table>';
            withdrawalsContent.innerHTML = html;
        });
    }

    window.approveRequest = (requestId) => {
        if (confirm('Approve this withdrawal request?')) {
            db.ref(`withdraw_requests/${requestId}`).update({
                status: 'approved',
                processedAt: Date.now()
            }).then(() => loadWithdrawals());
        }
    };

    window.rejectRequest = (requestId) => {
        if (confirm('Reject this withdrawal request?')) {
            db.ref(`withdraw_requests/${requestId}`).update({
                status: 'rejected',
                processedAt: Date.now()
            }).then(() => loadWithdrawals());
        }
    };

    document.getElementById('manage-withdrawals').addEventListener('click', loadWithdrawals);
});
