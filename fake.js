// Sound effects configuration
const sounds = {
    click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'] }),
    explosion: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-8-bit-game-explosion-1691.mp3'] }),
    timer: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-clock-ticking-1064.mp3'], loop: true }),
    win: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'] }),
    lose: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'] }),
    ui: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'] })
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

// Add UI click sounds to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => sounds.ui.play());
});

// Initialize the game
function init() {
    setupEventListeners();
    checkForChallenge();
}

// Set up event listeners
function setupEventListeners() {
    elements.restartBtn.addEventListener('click', restartGame);
    elements.challengeBtn.addEventListener('click', showChallengeScreen);
    elements.generateLinkBtn.addEventListener('click', generateChallengeLink);
    elements.copyLinkBtn.addEventListener('click', copyToClipboard);
    elements.backBtn.addEventListener('click', hideChallengeScreen);
    elements.acceptChallengeBtn.addEventListener('click', acceptChallenge);
    elements.declineChallengeBtn.addEventListener('click', declineChallenge);
}

// Check for challenge in URL
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

// Start the game
function startGame() {
    if (isChallengeMode) {
        Math.seedrandom(challengeSeed);
    }
    startLevel();
}

// Start a new level
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
}

// Update background based on level
function updateBackgroundTheme() {
    document.body.className = '';
    if (currentLevel >= 20) document.body.classList.add('level-20');
    else if (currentLevel >= 15) document.body.classList.add('level-15');
    else if (currentLevel >= 10) document.body.classList.add('level-10');
    else if (currentLevel >= 5) document.body.classList.add('level-5');
    else document.body.classList.add('level-1');
}

// Get number of buttons for level
function getButtonCount(level) {
    return Math.min(4 + Math.floor(level * 2), 25);
}

// Create game buttons
function createButtons(count) {
    for (let i = 0; i < count; i++) {
        const button = document.createElement('button');
        button.className = 'game-button';
        
        if (i === safeButtonIndex) {
            button.textContent = 'SAFE';
            button.classList.add('safe');
        } else {
            button.textContent = getFakeButtonText();
            button.setAttribute('data-text', button.textContent);
            button.classList.add('fake');
            addFakeBehavior(button);
        }
        
        button.addEventListener('click', () => handleButtonClick(i));
        elements.buttonsGrid.appendChild(button);
    }
    
    elements.buttonsGrid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(count))}, 1fr)`;
}

// Add behaviors to fake buttons
function addFakeBehavior(button) {
    const behaviors = ['shake', 'pulse', 'glitch', 'jitter', 'flip'];
    const selectedBehaviors = [];
    
    if (currentLevel >= 3) selectedBehaviors.push(randomItem(behaviors));
    if (currentLevel >= 5) selectedBehaviors.push(randomItem(behaviors));
    if (currentLevel >= 8) selectedBehaviors.push(randomItem(behaviors));
    
    selectedBehaviors.forEach(behavior => button.classList.add(behavior));
    
    if (currentLevel >= 7) {
        setTimeout(() => {
            if (gameActive && button.parentNode) {
                const newIndex = Math.floor(Math.random() * elements.buttonsGrid.children.length);
                elements.buttonsGrid.insertBefore(button, elements.buttonsGrid.children[newIndex]);
            }
        }, Math.random() * 2000);
    }
}

// Start the timer
function startTimer() {
    clearInterval(timer);
    sounds.timer.play();
    timer = setInterval(updateTimer, 100);
}

// Update timer display
function updateTimer() {
    timeLeft -= 0.1;
    elements.timerDisplay.textContent = timeLeft.toFixed(1);
    
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Handle button clicks
function handleButtonClick(index) {
    if (!gameActive) return;
    
    if (index === safeButtonIndex) {
        sounds.click.play();
        currentLevel++;
        startLevel();
    } else {
        gameOver();
    }
}

// Game over handler
function gameOver() {
    gameActive = false;
    clearInterval(timer);
    sounds.timer.stop();
    
    updateBestScore();
    showGameOverScreen();
    playGameOverEffects();
    showChallengeResult();
}

function updateBestScore() {
    if (currentLevel > bestLevel) {
        bestLevel = currentLevel;
        localStorage.setItem('bestLevel', bestLevel);
    }
}

function showGameOverScreen() {
    elements.finalLevelDisplay.textContent = `REACHED LEVEL ${currentLevel}`;
    elements.bestLevelDisplay.textContent = `BEST LEVEL: ${bestLevel}`;
    elements.funnyTip.textContent = getRandomFunnyTip();
    elements.gameOverScreen.classList.remove('hidden');
}

function playGameOverEffects() {
    sounds.explosion.play();
    document.body.classList.add('explode-effect');
    setTimeout(() => document.body.classList.remove('explode-effect'), 1000);
}

function showChallengeResult() {
    if (!isChallengeMode) return;
    
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

// Challenge mode functions
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
    const score = currentLevel;
    const seed = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    const baseUrl = window.location.href.split('?')[0];
    let challengeUrl = `${baseUrl}?score=${score}&seed=${seed}`;
    
    if (playerName) {
        challengeUrl += `&player=${encodeURIComponent(playerName)}`;
    }
    
    elements.shareLinkInput.value = challengeUrl;
    elements.shareSection.classList.remove('hidden');
    
    setupShareButtons(playerName, score, challengeUrl);
}

function setupShareButtons(playerName, score, url) {
    const shareMessage = playerName 
        ? `${playerName} scored ${score} in DON'T TOUCH THE FAKE BUTTON! Can you beat them? 😤\n${url}`
        : `I scored ${score} in DON'T TOUCH THE FAKE BUTTON! Can you beat me? 😤\n${url}`;
    
    document.querySelector('.whatsapp-share').onclick = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
    };
    
    document.querySelector('.telegram-share').onclick = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
    };
}

function copyToClipboard() {
    elements.shareLinkInput.select();
    document.execCommand('copy');
    alert('Challenge link copied!');
}

function showChallengeAcceptScreen() {
    elements.challengeMessage.textContent = `${challengerName} CHALLENGED YOU WITH SCORE ${challengerScore}!`;
    elements.challengeAcceptScreen.classList.remove('hidden');
}

function acceptChallenge() {
    isChallengeMode = true;
    currentLevel = 1;
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
}

function declineChallenge() {
    elements.challengeAcceptScreen.classList.add('hidden');
    startGame();
}

function restartGame() {
    currentLevel = 1;
    isChallengeMode = false;
    elements.gameOverScreen.classList.add('hidden');
    startLevel();
}

// Helper functions
function getFakeButtonText() {
    const texts = [
        "TRUST ME", "I'M REAL", "CLICK ME", "SAFE HERE", "NO FAKE", 
        "100% SAFE", "REAL ONE", "PICK ME", "THIS ONE", "WINNER"
    ];
    return randomItem(texts);
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
    return randomItem(tips);
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Initialize the game
init();
