// Firebase Configuration (Your Details)
const firebaseConfig = {
    apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
    authDomain: "taprace-63f8e.firebaseapp.com",
    projectId: "taprace-63f8e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Admin Login
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("login-page").style.display = "none";
            document.getElementById("admin-dashboard").style.display = "block";
        })
        .catch((error) => {
            document.getElementById("login-error").innerText = error.message;
        });
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    auth.signOut().then(() => {
        document.getElementById("admin-dashboard").style.display = "none";
        document.getElementById("login-page").style.display = "block";
    });
});
