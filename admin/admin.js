// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
    authDomain: "taprace-63f8e.firebaseapp.com",
    databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
    projectId: "taprace-63f8e",
    storageBucket: "taprace-63f8e.appspot.com",
    messagingSenderId: "93332718324",
    appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ✅ Admin Login
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            document.getElementById("login-error").innerText = "⚠️ Please enter email and password!";
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("✅ Login successful!");
                document.getElementById("login-page").style.display = "none";
                document.getElementById("admin-dashboard").style.display = "block";
            })
            .catch((error) => {
                console.error("Login Error:", error.message);
                document.getElementById("login-error").innerText = "❌ Invalid email or password!";
            });
    });

    // ✅ Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        auth.signOut().then(() => {
            document.getElementById("admin-dashboard").style.display = "none";
            document.getElementById("login-page").style.display = "block";
        });
    });

    // ✅ Load Pages on Click
    function loadPage(page) {
        document.getElementById("content").innerHTML = `<iframe src="./admin/${page}" width="100%" height="600px" style="border:none;"></iframe>`;
    }

    document.getElementById("manage-players").addEventListener("click", function () {
        loadPage("players.html");
    });

    document.getElementById("manage-leaderboard").addEventListener("click", function () {
        loadPage("leaderboard.html");
    });

    document.getElementById("manage-withdrawals").addEventListener("click", function () {
        loadPage("withdrawals.html");
    });

    document.getElementById("manage-ads").addEventListener("click", function () {
        loadPage("ads.html");
    });

    document.getElementById("settings").addEventListener("click", function () {
        loadPage("settings.html");
    });
});
