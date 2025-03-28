console.log("Admin script loading...");

// Firebase Configuration
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
try {
    const app = firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully", app);
    
    const auth = firebase.auth();
    const db = firebase.database();
    
    // Check auth state
    auth.onAuthStateChanged(user => {
        console.log("Auth state changed");
        if (user) {
            console.log("User logged in:", user.email);
            showAdminDashboard();
        } else {
            console.log("No user logged in");
            showLoginPage();
        }
    });

    // Wait for DOM to load
    document.addEventListener("DOMContentLoaded", function() {
        console.log("DOM fully loaded");
        
        // Login functionality
        document.getElementById("login-btn").addEventListener("click", handleLogin);
        
        // Logout functionality
        document.getElementById("logout-btn").addEventListener("click", handleLogout);
        
        // Navigation buttons
        setupNavigation();
    });

    function handleLogin() {
        console.log("Login button clicked");
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorElement = document.getElementById("login-error");

        if (!email || !password) {
            errorElement.textContent = "⚠️ Please enter email and password!";
            return;
        }

        console.log("Attempting login with:", email);
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Login success:", userCredential.user);
                showAdminDashboard();
            })
            .catch((error) => {
                console.error("Login error:", error);
                errorElement.textContent = "❌ " + error.message;
            });
    }

    function handleLogout() {
        console.log("Logout initiated");
        auth.signOut()
            .then(() => {
                console.log("Logout successful");
                showLoginPage();
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    }

    function showAdminDashboard() {
        document.getElementById("login-page").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        console.log("Admin dashboard shown");
    }

    function showLoginPage() {
        document.getElementById("login-page").style.display = "block";
        document.getElementById("admin-dashboard").style.display = "none";
        document.getElementById("login-error").textContent = "";
        console.log("Login page shown");
    }

    function setupNavigation() {
        function loadPage(page) {
            console.log("Loading page:", page);
            document.getElementById("content").innerHTML = 
                `<iframe src="${page}" width="100%" height="600px" style="border:none;"></iframe>`;
        }

        document.getElementById("manage-players").addEventListener("click", () => loadPage("players.html"));
        document.getElementById("manage-leaderboard").addEventListener("click", () => loadPage("leaderboard.html"));
        document.getElementById("manage-withdrawals").addEventListener("click", () => loadPage("withdrawals.html"));
        document.getElementById("manage-ads").addEventListener("click", () => loadPage("ads.html"));
        document.getElementById("settings").addEventListener("click", () => loadPage("settings.html"));
        document.getElementById("manage-withdrawals").addEventListener("click", () => loadPage("withdrawals.html"));
    }

} catch (error) {
    console.error("Firebase initialization error:", error);
    document.getElementById("login-error").textContent = "❌ Failed to initialize Firebase. Check console for details.";
}
