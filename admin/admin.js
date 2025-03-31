console.log("✅ Admin Panel Loaded");

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
const auth = firebase.auth();
const db = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const loginPage = document.getElementById("login-page");
    const dashboard = document.getElementById("admin-dashboard");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const loginError = document.getElementById("login-error");

    // Login Handler
    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            loginError.innerText = "⚠️ Please enter email and password!";
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                loginPage.style.display = "none";
                dashboard.style.display = "flex";
            })
            .catch((error) => {
                loginError.innerText = "❌ " + error.message;
            });
    });

    // Logout Handler
    logoutBtn.addEventListener("click", () => {
        auth.signOut().then(() => {
            dashboard.style.display = "none";
            loginPage.style.display = "flex";
        });
    });

    // Dynamic Content Loader
    function loadPage(page, buttonId) {
        const content = document.getElementById("content");
        content.innerHTML = `<div class="text-center text-gray-500 text-lg p-6">Loading ${page}...</div>`;

        fetch(page)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                // Execute scripts in loaded content
                const scripts = content.getElementsByTagName('script');
                for (let script of scripts) {
                    const newScript = document.createElement('script');
                    newScript.text = script.text;
                    document.body.appendChild(newScript);
                }
            })
            .catch(error => {
                content.innerHTML = `<div class="text-red-500 p-6">Error loading ${page}</div>`;
            });

        document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("bg-blue-500", "text-white"));
        document.getElementById(buttonId).classList.add("bg-blue-500", "text-white");
    }

    // Navigation Handlers
    document.getElementById("manage-players").addEventListener("click", () => loadPage("players.html", "manage-players"));
    document.getElementById("manage-leaderboard").addEventListener("click", () => loadPage("leaderboard.html", "manage-leaderboard"));
    document.getElementById("manage-withdrawals").addEventListener("click", () => loadPage("withdrawals.html", "manage-withdrawals"));
    document.getElementById("manage-ads").addEventListener("click", () => loadPage("ads.html", "manage-ads"));
    document.getElementById("settings").addEventListener("click", () => loadPage("settings.html", "settings"));

    // Auth State Listener
    auth.onAuthStateChanged(user => {
        if (user) {
            loadPage("players.html", "manage-players");
        }
    });
});
