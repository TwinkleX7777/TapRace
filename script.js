const firebaseConfig = {
  apiKey: "AIzaSyBP1Cx8cmvjf24oY1gNiD_-qxis6v6pwNI",
  authDomain: "taprace-63f8e.firebaseapp.com",
  databaseURL: "https://taprace-63f8e-default-rtdb.firebaseio.com",
  projectId: "taprace-63f8e",
  storageBucket: "taprace-63f8e.firebasestorage.app",
  messagingSenderId: "93332718324",
  appId: "1:93332718324:web:4b48350c0b64061eb794a1"
};
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
            alert("Time's up! You tapped " + score + " times.");
        }
    }, 1000);
}

startTimer();
