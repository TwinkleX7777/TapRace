// Game state
let currentLevel = 1;
let bestLevel = localStorage.getItem('bestLevel') || 1;
let timer;
let timeLeft = 3;
let safeButtonIndex;
let gameActive = true;
let challengeSeed = null;
let isChallengeMode = false;
let challengerName = null;
let challengerScore = null;

// DOM elements
const buttonsGrid = document.getElementById('buttons-grid');
const levelDisplay = document.getElementById('level-display');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over-screen');
const finalLevelDisplay = document.getElementById('final-level');
const bestLevelDisplay = document.getElementById('best-level');
const funnyTip = document.getElementById('funny-tip');
const restartBtn = document.getElementById('restart-btn');
const challengeBtn = document.getElementById('challenge-btn');
const challengeScreen = document.getElementById('challenge-screen');
const challengeAcceptScreen = document.getElementById('challenge-accept-screen');
const playerNameInput = document.getElementById('player-name');
const generateLinkBtn = document.getElementById('generate-link-btn');
const shareSection = document.getElementById('share-section');
const shareLinkInput = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link-btn');
const backBtn = document.getElementById('back-btn');
const challengeMessage = document.getElementById('challenge-message');
const acceptChallengeBtn = document.getElementById('accept-challenge-btn');
const declineChallengeBtn = document.getElementById('decline-challenge-btn');

// Check for challenge URL parameters
function checkForChallenge() {
    const urlParams = new URLSearchParams(window.location.search);
    const scoreParam = urlParams.get('score');
    const playerParam = urlParams.get('player');
    const seedParam = urlParams.get('seed');
    
    if (scoreParam && seedParam) {
        challengerScore = parseInt(scoreParam, 10);
        challengerName = playerParam || 'Someone';
        challengeSeed = seedParam;
        
        // Show challenge accept screen
        challengeMessage.textContent = `${challengerName} has challenged you with a score of ${challengerScore}!`;
        challengeAcceptScreen.classList.remove('hidden');
    } else {
        startGame();
    }
}

// Start the game (normal or challenge mode)
function startGame() {
    if (isChallengeMode) {
        // Use the challenge seed for consistent random behavior
        Math.seedrandom(challengeSeed);
    }
    startLevel();
}

// Button count per level
function getButtonCount(level) {
    return Math.min(4 + Math.floor(level * 2), 25); // Cap at 25 buttons
}

// Start a new level
function startLevel() {
    gameActive = true;
    timeLeft = Math.max(3 - Math.floor(currentLevel / 8), 1); // Reduce timer every 8 levels
    levelDisplay.textContent = `Level ${currentLevel}`;
    buttonsGrid.innerHTML = '';
    
    // Update background based on level
    document.body.className = '';
    if (currentLevel >= 20) {
        document.body.classList.add('level-20');
    } else if (currentLevel >= 15) {
        document.body.classList.add('level-15');
    } else if (currentLevel >= 10) {
        document.body.classList.add('level-10');
    } else if (currentLevel >= 5) {
        document.body.classList.add('level-5');
    } else {
        document.body.classList.add('level-1');
    }
    
    const buttonCount = getButtonCount(currentLevel);
    safeButtonIndex = Math.floor(Math.random() * buttonCount);
    
    // Create buttons
    for (let i = 0; i < buttonCount; i++) {
        const button = document.createElement('button');
        button.className = 'game-button';
        if (i === safeButtonIndex) {
            button.textContent = 'Safe';
            button.classList.add('safe');
        } else {
            // Add random fake behavior classes
            button.textContent = getFakeButtonText();
            button.setAttribute('data-text', button.textContent);
            button.classList.add('fake');
            addFakeBehavior(button);
        }
        button.addEventListener('click', () => handleButtonClick(i));
        buttonsGrid.appendChild(button);
    }
    
    // Adjust grid layout based on button count
    buttonsGrid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(buttonCount))}, 1fr)`;
    
    // Start timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 100);
}

// Handle button clicks
function handleButtonClick(index) {
    if (!gameActive) return;
    
    if (index === safeButtonIndex) {
        // Correct button
        playSound('click');
        currentLevel++;
        startLevel();
    } else {
        // Wrong button
        gameOver();
    }
}

// Timer logic
function updateTimer() {
    timeLeft -= 0.1;
    timerDisplay.textContent = timeLeft.toFixed(1);
    
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Game over
function gameOver() {
    gameActive = false;
    clearInterval(timer);
    
    // Update best score
    if (currentLevel > bestLevel) {
        bestLevel = currentLevel;
        localStorage.setItem('bestLevel', bestLevel);
    }
    
    // Show game over screen
    finalLevelDisplay.textContent = `Reached Level ${currentLevel}`;
    bestLevelDisplay.textContent = `Best Level: ${bestLevel}`;
    funnyTip.textContent = getRandomFunnyTip();
    gameOverScreen.classList.remove('hidden');
    
    // Play explosion sound
    playSound('explosion');
    
    // Add explosion effect
    document.body.classList.add('explode-effect');
    setTimeout(() => {
        document.body.classList.remove('explode-effect');
    }, 1000);
    
    // Special message if in challenge mode
    if (isChallengeMode) {
        if (currentLevel > challengerScore) {
            funnyTip.textContent = `🔥 You roasted ${challengerName}!`;
        } else if (currentLevel === challengerScore) {
            funnyTip.textContent = `😅 You tied with ${challengerName}!`;
        } else {
            funnyTip.textContent = `💀 ${challengerName} remains undefeated!`;
        }
    }
}

// Fake button behaviors
function addFakeBehavior(button) {
    const behaviors = ['shake', 'pulse', 'glitch', 'jitter', 'flip'];
    const selectedBehaviors = [];
    
    // Add behaviors based on level difficulty
    if (currentLevel >= 3) {
        selectedBehaviors.push(behaviors[Math.floor(Math.random() * behaviors.length)]);
    }
    if (currentLevel >= 5) {
        selectedBehaviors.push(behaviors[Math.floor(Math.random() * behaviors.length)]);
    }
    if (currentLevel >= 8) {
        selectedBehaviors.push(behaviors[Math.floor(Math.random() * behaviors.length)]);
    }
    
    selectedBehaviors.forEach(behavior => {
        button.classList.add(behavior);
    });
    
    // For moving buttons (higher levels)
    if (currentLevel >= 7) {
        setTimeout(() => {
            if (gameActive && button.parentNode) {
                // Move button to random position in grid
                const newIndex = Math.floor(Math.random() * buttonsGrid.children.length);
                buttonsGrid.insertBefore(button, buttonsGrid.children[newIndex]);
            }
        }, Math.random() * 2000);
    }
}

// Helper functions
function getFakeButtonText() {
    const texts = [
        "Trust me", "I'm real", "Click me", "Safe here", "No fake", 
        "100% safe", "Real one", "Pick me", "This one", "Winner"
    ];
    return texts[Math.floor(Math.random() * texts.length)];
}

function getRandomFunnyTip() {
    const tips = [
        "Don't trust buttons that talk, bro.",
        "The one that winked at you? Nah.",
        "They're all liars except one.",
        "Maybe try closing your eyes next time?",
        "Pro tip: The safe one doesn't move... usually.",
        "Button selection is 99% luck, 1% skill.",
        "They get smarter every level. Good luck."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function playSound(type) {
    // Implementation would use Howler.js or similar
    // For simplicity, we'll just mock this
    console.log(`Play ${type} sound`);
}

// Challenge mode functions
function generateChallengeLink() {
    const playerName = playerNameInput.value.trim();
    const score = currentLevel;
    const seed = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    const baseUrl = window.location.href.split('?')[0];
    let challengeUrl = `${baseUrl}?score=${score}&seed=${seed}`;
    
    if (playerName) {
        challengeUrl += `&player=${encodeURIComponent(playerName)}`;
    }
    
    shareLinkInput.value = challengeUrl;
    shareSection.classList.remove('hidden');
    
    // Create share message
    const shareMessage = playerName 
        ? `${playerName} just scored ${score} in "Don't Touch the Fake Button"! Can you beat them? 😤\n${challengeUrl}`
        : `I just scored ${score} in "Don't Touch the Fake Button"! Can you beat me? 😤\n${challengeUrl}`;
    
    // Setup share buttons
    document.querySelector('.whatsapp-share').onclick = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
    };
    
    document.querySelector('.telegram-share').onclick = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(challengeUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
    };
}

function copyToClipboard() {
    shareLinkInput.select();
    document.execCommand('copy');
    alert('Challenge link copied to clipboard!');
}

// Event listeners
restartBtn.addEventListener('click', () => {
    currentLevel = 1;
    isChallengeMode = false;
    gameOverScreen.classList.add('hidden');
    startLevel();
});

challengeBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    challengeScreen.classList.remove('hidden');
});

generateLinkBtn.addEventListener('click', generateChallengeLink);
copyLinkBtn.addEventListener('click', copyToClipboard);

backBtn.addEventListener('click', () => {
    challengeScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
});

acceptChallengeBtn.addEventListener('click', () => {
    isChallengeMode = true;
    currentLevel = 1;
    challengeAcceptScreen.classList.add('hidden');
    startGame();
});

declineChallengeBtn.addEventListener('click', () => {
    challengeAcceptScreen.classList.add('hidden');
    startGame();
});

// Initialize game
checkForChallenge();