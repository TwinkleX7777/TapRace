// Sound effects with preloading
const sounds = {
    click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'], volume: 0.7, preload: true }),
    explosion: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-8-bit-game-explosion-1691.mp3'], volume: 0.5, preload: true }),
    timer: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-clock-ticking-1064.mp3'], volume: 0.3, loop: true, preload: true }),
    win: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'], volume: 0.6, preload: true }),
    lose: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'], volume: 0.6, preload: true }),
    ui: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'], volume: 0.4, preload: true })
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
    setupEventListeners();
    checkForChallenge();
    
    // Preload all sounds
    Object.values(sounds).forEach(sound => {
        if (sound.state() === 'unloaded') {
            sound.load();
        }
    });
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
        showChallengeAcceptScreen();
    } else {
        startGame();
    }
}

function showChallengeAcceptScreen() {
    elements.challengeAcceptScreen.classList.remove('hidden');
    elements.challengeMessage.textContent = `${challengerName} CHALLENGED YOU TO BEAT LEVEL ${challengerScore}!`;
}

function acceptChallenge() {
    isChallengeMode = true;
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
}

function declineChallenge() {
    isChallengeMode = false;
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
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
    
    const buttonCount = getButtonCount(currentLevel);
    safeButtonIndex = Math.floor(Math.random() * buttonCount);
    
    createButtons(buttonCount);
    startTimer();
    
    // Flash effect on level up
    if (currentLevel > 1) {
        document.body.classList.add('level-up');
        setTimeout(() => document.body.classList.remove('level-up'), 500);
    }
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
            button.textContent = getFakeButtonText();
            button.classList.add('fake');
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
            currentLevel += COMBO_BONUS[Math.min(comboCount, 5)];
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
    const score = currentLevel;
    
    let url = window.location.href.split('?')[0];
    url += `?score=${score}&seed=${seed}`;
    if (playerName) {
        url += `&player=${encodeURIComponent(playerName)}`;
    }
    
    elements.shareLinkInput.value = url;
    elements.shareSection.classList.remove('hidden');
}

function copyToClipboard() {
    elements.shareLinkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
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
        "They get smarter every level. Good luck."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Initialize the game
init();
