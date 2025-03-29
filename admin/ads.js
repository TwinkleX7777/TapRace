// ads.js
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

// Simple Ads Loader
document.getElementById('manage-ads').addEventListener('click', () => {
    // Show ads section
    document.getElementById('ads-management').style.display = 'block';
    
    // Basic loading message
    document.getElementById('ad-settings').innerHTML = 
        '<tr><td colspan="3">Loading ads settings...</td></tr>';

    // Load data
    db.ref("ads").once('value', (snapshot) => {
        let html = '';
        snapshot.forEach((network) => {
            const networkName = network.key;
            Object.entries(network.val()).forEach(([adType, status]) => {
                html += `
                    <tr>
                        <td>${networkName}</td>
                        <td>${adType}</td>
                        <td>${status ? '✅ Active' : '❌ Disabled'}</td>
                    </tr>
                `;
            });
        });
        document.getElementById('ad-settings').innerHTML = html;
    });
});
