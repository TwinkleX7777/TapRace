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
