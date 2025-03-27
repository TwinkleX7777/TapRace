// Firebase Configuration (Your Config)
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Check Ad Settings from Firebase
db.ref("ads").on("value", (snapshot) => {
    const adsConfig = snapshot.val();

    // Banner Ads
    if (adsConfig.show_banner_ads) {
        document.getElementById("banner-ad").innerHTML = `
            <script type="text/javascript">
                atOptions = {
                    'key': '7e95d01c7a053ed718103921ff160cfa',
                    'format': 'iframe',
                    'height': 250,
                    'width': 300,
                    'params': {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/7e95d01c7a053ed718103921ff160cfa/invoke.js"></script>
        `;
    }

    // Interstitial Ads
    if (adsConfig.show_interstitial_ads) {
        document.getElementById("show-ad-btn").style.display = "block";
        document.getElementById("show-ad-btn").addEventListener("click", () => {
            (function(d, z, s) {
                s.src = 'https://' + d + '/401/' + z;
                try { (document.body || document.documentElement).appendChild(s); } catch (e) {}
            })('groleegni.net', 9139187, document.createElement('script'));
        });
    } else {
        document.getElementById("show-ad-btn").style.display = "none";
    }

    // Popunder Ads
    if (adsConfig.show_pop_ads) {
        (function(d, z, s) {
            s.src = 'https://' + d + '/401/' + z;
            try { (document.body || document.documentElement).appendChild(s); } catch (e) {}
        })('groleegni.net', 9139187, document.createElement('script'));
    }
});

// Game Logic (Unchanged)
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
                const playerRef = firebase.database().ref("players").push();
                playerRef.set({ name: playerName, score: score });
            }

            alert("Time's up! You tapped " + score + " times.");
            updateLeaderboard();
        }
    }, 1000);
}

function updateLeaderboard() {
    firebase.database().ref("players").orderByChild("score").limitToLast(5).once("value", (snapshot) => {
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
