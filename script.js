let score = 0;
let timeLeft = 10;
let timer;

// Wait for Firebase to load
document.addEventListener("DOMContentLoaded", function () {
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
                if (playerName && window.database) {
                    const db = window.database;
                    const playerRef = push(ref(db, "players"));
                    set(playerRef, { name: playerName, score: score });
                }

                alert("Time's up! You tapped " + score + " times.");
                updateLeaderboard();
            }
        }, 1000);
    }

    startTimer();

    // Function to update leaderboard
    function updateLeaderboard() {
        const leaderboardList = document.getElementById("leaderboard-list");
        leaderboardList.innerHTML = "";

        if (!window.database) return;

        const db = window.database;
        onValue(orderByChild(ref(db, "players"), "score"), (snapshot) => {
            let scores = [];
            snapshot.forEach((child) => {
                scores.push(child.val());
            });

            scores.reverse(); // Show highest scores first
            scores.slice(0, 5).forEach((player) => {
                const listItem = document.createElement("li");
                listItem.innerText = `${player.name}: ${player.score} taps`;
                leaderboardList.appendChild(listItem);
            });
        });
    }

    updateLeaderboard();
});
