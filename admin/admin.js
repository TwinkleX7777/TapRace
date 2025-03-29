// admin.js
document.addEventListener("DOMContentLoaded", function() {
    // Login handler
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorElement = document.getElementById("login-error");

        if (!email || !password) {
            errorElement.textContent = "Please fill all fields";
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success
                document.getElementById("login-page").style.display = "none";
                document.getElementById("admin-dashboard").style.display = "block";
            })
            .catch((error) => {
                errorElement.textContent = error.message;
            });
    });

    // Logout handler
    document.getElementById("logout-btn").addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            document.getElementById("admin-dashboard").style.display = "none";
            document.getElementById("login-page").style.display = "block";
        });
    });
});
