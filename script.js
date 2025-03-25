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
const database = firebase.database();

const backgrounds = [
    'background1.jpg', 
    'background2.jpg', 
    'background3.jpg', 
    'background4.jpg', 
    'background5.jpg'
];

let currentBackground = 0;
document.getElementById("change-theme").addEventListener("click", () => {
    currentBackground = (currentBackground + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[currentBackground]}')`;
});

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
                playerRef.set({ name: playerName, score: score });
            }

            alert("Time's up! You tapped " + score + " times.");
            updateLeaderboard();
        }
    }, 1000);
}

function updateLeaderboard() {
    database.ref("players").orderByChild("score").limitToLast(5).once("value", (snapshot) => {
        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = "";
        
        const scores = [];
        snapshot.forEach((childSnapshot) => {
            scores.push(childSnapshot.val());
        });

        scores.reverse().forEach((player) => {
            const li = document.createElement("li");
            li.innerText = `${player.name}: ${player.score} taps`;
            leaderboard.appendChild(li);
        });
    });
}

updateLeaderboard();
startTimer();
