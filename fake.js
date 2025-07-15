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
    document.body.classList.add('level-1'); // Set initial background
}

function setupEventListeners() {
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

function startLevel() {
    gameActive = true;
    timeLeft = Math.max(3 - Math.floor(currentLevel / 8), 1);
    elements.levelDisplay.textContent = `LEVEL ${currentLevel}`;
    elements.buttonsGrid.innerHTML = '';
    
    updateBackgroundTheme();
    
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

function updateBackgroundTheme() {
    document.body.className = '';
    if (currentLevel >= 20) document.body.classList.add('level-20');
    else if (currentLevel >= 15) document.body.classList.add('level-15');
    else if (currentLevel >= 10) document.body.classList.add('level-10');
    else if (currentLevel >= 5) document.body.classList.add('level-5');
    else document.body.classList.add('level-1');
}

// [Keep all other existing functions from previous fake.js]

// Initialize the game
init();
