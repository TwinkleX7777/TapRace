// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
  authDomain: "taprace-63f8e.firebaseapp.com",
  databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
  projectId: "taprace-63f8e",
  storageBucket: "taprace-63f8e.firebasestorage.app",
  messagingSenderId: "93332718324",
  appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let score = 0;
let timeLeft = 10;
let timer;

document.getElementById("tap-button").addEventListener("click", () => {
    score++;
    document.getElementById("score").innerText = "Taps: " + score;
});

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "Time: " + timeLeft + "s";
        if (timeLeft === 0) {
            clearInterval(timer);
            document.getElementById("tap-button").disabled = true;
            
            const playerName = prompt("Enter your name:");
            if (playerName) {
                const playerRef = database.ref("players").push();
                playerRef.set({
                    name: playerName,
                    score: score
                });
            }

            alert("Time's up! You tapped " + score + " times.");
            updateLeaderboard(); // Update leaderboard after game ends
        }
    }, 1000);
}

startTimer();

// Function to update leaderboard
function updateLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear old scores

    database.ref("players").orderByChild("score").limitToLast(5).on("value", (snapshot) => {
        let scores = [];
        snapshot.forEach((child) => {
            scores.push(child.val());
        });

        scores.reverse(); // Show highest scores first
        scores.forEach((player) => {
            const listItem = document.createElement("li");
            listItem.innerText = `${player.name}: ${player.score} taps`;
            leaderboardList.appendChild(listItem);
        });
    });
}

// Load leaderboard on page load
updateLeaderboard();
