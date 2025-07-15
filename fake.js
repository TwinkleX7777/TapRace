// Enhanced Sound Effects with better timing
const sounds = {
    click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'], volume: 0.7 }),
    explosion: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-8-bit-game-explosion-1691.mp3'], volume: 0.5 }),
    timer: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-clock-ticking-1064.mp3'], volume: 0.3, loop: true }),
    win: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'], volume: 0.6 }),
    lose: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'], volume: 0.6 }),
    ui: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'], volume: 0.4 }),
    levelup: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'], volume: 0.6 }),
    combo: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'], volume: 0.7 })
};

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
let comboCount = 0;
let lastTapTime = 0;
const COMBO_BONUS = [0, 0, 5, 10, 15, 20];

// DOM elements
const elements = {
    buttonsGrid: document.getElementById('buttons-grid'),
    levelDisplay: document.getElementById('level-display'),
    timerDisplay: document.getElementById('timer'),
    gameOverScreen: document.getElementById('game-over-screen'),
    finalLevelDisplay: document.getElementById('final-level'),
    bestLevelDisplay: document.getElementById('best-level'),
    funnyTip: document.getElementById('funny-tip'),
    restartBtn: document.getElementById('restart-btn'),
    challengeBtn: document.getElementById('challenge-btn'),
    challengeScreen: document.getElementById('challenge-screen'),
    challengeAcceptScreen: document.getElementById('challenge-accept-screen'),
    playerNameInput: document.getElementById('player-name'),
    generateLinkBtn: document.getElementById('generate-link-btn'),
    shareSection: document.getElementById('share-section'),
    shareLinkInput: document.getElementById('share-link'),
    copyLinkBtn: document.getElementById('copy-link-btn'),
    backBtn: document.getElementById('back-btn'),
    challengeMessage: document.getElementById('challenge-message'),
    acceptChallengeBtn: document.getElementById('accept-challenge-btn'),
    declineChallengeBtn: document.getElementById('decline-challenge-btn')
};

// Initialize game
function init() {
    // Preload all sounds
    Object.values(sounds).forEach(sound => {
        sound.load();
    });

    setupEventListeners();
    checkForChallenge();
    
    // Show loading until sounds are ready
    setTimeout(() => {
        if (!isChallengeMode) startGame();
    }, 500);
}

function setupEventListeners() {
    // UI sounds for all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => sounds.ui.play());
    });

    elements.restartBtn.addEventListener('click', restartGame);
    elements.challengeBtn.addEventListener('click', showChallengeScreen);
    elements.generateLinkBtn.addEventListener('click', generateChallengeLink);
    elements.copyLinkBtn.addEventListener('click', copyToClipboard);
    elements.backBtn.addEventListener('click', hideChallengeScreen);
    elements.acceptChallengeBtn.addEventListener('click', acceptChallenge);
    elements.declineChallengeBtn.addEventListener('click', declineChallenge);
}

function checkForChallenge() {
    const urlParams = new URLSearchParams(window.location.search);
    const scoreParam = urlParams.get('score');
    const playerParam = urlParams.get('player');
    const seedParam = urlParams.get('seed');

    if (scoreParam && seedParam) {
        challengerScore = parseInt(scoreParam, 10);
        challengerName = playerParam || 'Someone';
        challengeSeed = seedParam;
        isChallengeMode = true;
        showChallengeAcceptScreen();
    }
}

function startGame() {
    if (isChallengeMode) {
        Math.seedrandom(challengeSeed);
    }
    startLevel();
}

function startLevel() {
    gameActive = true;
    timeLeft = Math.max(3 - Math.floor(currentLevel / 8), 1);
    elements.levelDisplay.textContent = `LEVEL ${currentLevel}`;
    elements.buttonsGrid.innerHTML = '';
    
    // Update theme based on level
    updateTheme();
    
    const buttonCount = getButtonCount(currentLevel);
    safeButtonIndex = Math.floor(Math.random() * buttonCount);
    
    createButtons(buttonCount);
    startTimer();
    
    // Flash effect on level up
    if (currentLevel > 1) {
        document.body.classList.add('level-up');
        sounds.levelup.play();
        setTimeout(() => document.body.classList.remove('level-up'), 500);
    }
}

function updateTheme() {
    const themeClass = `theme-${Math.min(Math.floor(currentLevel / 5) + 1, 10)}`;
    document.body.className = themeClass;
}

function getButtonCount(level) {
    return Math.min(4 + Math.floor(level * 2), 25);
}

function createButtons(count) {
    elements.buttonsGrid.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const button = document.createElement('button');
        button.className = 'game-button';
        
        if (i === safeButtonIndex) {
            button.textContent = 'SAFE';
            button.classList.add('safe');
        } else {
            const fakeText = getFakeButtonText();
            button.textContent = fakeText;
            button.classList.add('fake');
            
            // Add deception classes based on text
            if (fakeText === "TRUST ME") button.classList.add('trust-me');
            if (fakeText === "REAL ONE") button.classList.add('real-one');
            if (fakeText === "WINNER") button.classList.add('winner');
            
            addFakeBehavior(button);
        }
        
        button.addEventListener('click', () => handleButtonClick(i));
        elements.buttonsGrid.appendChild(button);
    }
}

function addFakeBehavior(button) {
    if (currentLevel >= 3) button.classList.add('glitch');
    if (currentLevel >= 5) button.classList.add('shake');
    if (currentLevel >= 7) {
        setTimeout(() => {
            if (gameActive && button.parentNode) {
                const newIndex = Math.floor(Math.random() * elements.buttonsGrid.children.length);
                elements.buttonsGrid.insertBefore(button, elements.buttonsGrid.children[newIndex]);
            }
        }, Math.random() * 2000);
    }
}

function startTimer() {
    clearInterval(timer);
    sounds.timer.play();
    timer = setInterval(updateTimer, 100);
}

function updateTimer() {
    timeLeft -= 0.1;
    elements.timerDisplay.textContent = timeLeft.toFixed(1);
    
    if (timeLeft <= 0) {
        gameOver();
    }
}

function handleButtonClick(index) {
    if (!gameActive) return;
    
    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Combo system
    const now = Date.now();
    const isCombo = (now - lastTapTime) < 1000;
    lastTapTime = now;
    
    sounds.ui.play();
    
    if (index === safeButtonIndex) {
        comboCount = isCombo ? comboCount + 1 : 1;
        
        // Combo effects
        if (comboCount > 2) {
            showComboEffect(comboCount);
            sounds.combo.play();
            currentLevel += COMBO_BONUS[Math.min(comboCount, 5)];
            createConfetti();
        }
        
        setTimeout(() => sounds.click.play(), 50);
        currentLevel++;
        startLevel();
    } else {
        comboCount = 0;
        setTimeout(() => sounds.explosion.play(), 50);
        gameOver();
    }
}

function showComboEffect(count) {
    const combo = document.createElement('div');
    combo.className = 'combo-effect';
    combo.textContent = `COMBO x${count}!`;
    document.body.appendChild(combo);
    setTimeout(() => combo.remove(), 1000);
}

function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

function gameOver() {
    gameActive = false;
    clearInterval(timer);
    sounds.timer.stop();
    
    if (currentLevel > bestLevel) {
        bestLevel = currentLevel;
        localStorage.setItem('bestLevel', bestLevel);
    }
    
    elements.finalLevelDisplay.textContent = `REACHED LEVEL ${currentLevel}`;
    elements.bestLevelDisplay.textContent = `BEST LEVEL: ${bestLevel}`;
    elements.funnyTip.textContent = getRandomFunnyTip();
    elements.gameOverScreen.classList.remove('hidden');
    
    if (isChallengeMode) {
        if (currentLevel > challengerScore) {
            sounds.win.play();
            elements.funnyTip.textContent = `🔥 YOU CRUSHED ${challengerName}! 🔥`;
        } else if (currentLevel === challengerScore) {
            elements.funnyTip.textContent = `😅 TIED WITH ${challengerName}!`;
        } else {
            sounds.lose.play();
            elements.funnyTip.textContent = `💀 ${challengerName} DESTROYED YOU!`;
        }
    }
    
    document.body.classList.add('vibrate');
    setTimeout(() => document.body.classList.remove('vibrate'), 300);
}

function restartGame() {
    currentLevel = 1;
    elements.gameOverScreen.classList.add('hidden');
    startGame();
}

function showChallengeScreen() {
    elements.gameOverScreen.classList.add('hidden');
    elements.challengeScreen.classList.remove('hidden');
}

function hideChallengeScreen() {
    elements.challengeScreen.classList.add('hidden');
    elements.gameOverScreen.classList.remove('hidden');
}

function generateChallengeLink() {
    const playerName = elements.playerNameInput.value.trim();
    const seed = Math.random().toString(36).substring(2, 15);
    let link = `${window.location.origin}${window.location.pathname}?score=${bestLevel}&seed=${seed}`;
    
    if (playerName) {
        link += `&player=${encodeURIComponent(playerName)}`;
    }
    
    elements.shareLinkInput.value = link;
    elements.shareSection.classList.remove('hidden');
}

function copyToClipboard() {
    elements.shareLinkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function showChallengeAcceptScreen() {
    elements.challengeAcceptScreen.classList.remove('hidden');
    elements.challengeMessage.textContent = `${challengerName} CHALLENGES YOU TO BEAT LEVEL ${challengerScore}!`;
}

function acceptChallenge() {
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
}

function declineChallenge() {
    isChallengeMode = false;
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
}

// Helper functions
function getFakeButtonText() {
    const texts = ["TRUST ME", "I'M REAL", "CLICK ME", "SAFE HERE", "NO FAKE", "100% SAFE", "REAL ONE", "PICK ME", "THIS ONE", "WINNER"];
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
        "They get smarter every level. Good luck.",
        "The safe button is always the last one you try.",
        "If you stare long enough, they all look fake.",
        "Trust your gut... unless it's hungry.",
        "The real button is the friends we made along the way."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Initialize the game
window.onload = init;
