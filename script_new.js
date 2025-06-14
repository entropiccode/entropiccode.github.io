// Page Elements
const sidebar = document.getElementById("sidebar");
const gameAreaContainer = document.getElementById("game-area-container");
const wagerContainer = document.getElementById("wager-input-container");
const giantRollContainer = document.getElementById("giant-roll-container");
const playerRollContainer = document.getElementById("player-roll-container");
const roundResultsContainer = document.getElementById("round-results-container");

// Sidebar Content Tabs
const gameHelpButton = document.getElementById("game-help-btn");
const eventLogButton = document.getElementById("event-log-btn");
const playerStatsButton = document.getElementById("player-stats-btn");

// Sidebar Content
const gameHelpContainer = document.getElementById("game-help-container");
const eventLogContainer = document.getElementById("event-log-container");
const playerStatsContainer = document.getElementById("player-stats-container");

// Stat Elements
const lastGameText = document.getElementById("last-game-value");
const overallText = document.getElementById("overall-value");
const gamesPlayedText = document.getElementById("games-played-value");
const kHitText = document.getElementById("knees-hit-value");
const kMissedText = document.getElementById("knees-missed-value");
const kSplitText = document.getElementById("knees-split-value");
const kicksText = document.getElementById("kicks-value");
const snakesText = document.getElementById("snakes-value");
const mawsText = document.getElementById("maws-value");
const legendaryText = document.getElementById("legendary-count-value");
const bestDepthText = document.getElementById("deepest-legendary-run-value");

// Roll Elements
const giantRollText = document.getElementById("giant-roll-result");
const playerRoll1Text = document.getElementById("player-roll-1");
const playerRoll2Text = document.getElementById("player-roll-2");
const playerRollTotal = document.getElementById("player-roll-total");

const goldText = document.getElementById("gold-value-text");

const wagerInput = document.getElementById("wager-input");
const wagerSubmit = document.getElementById("wager-submit");

const roundResultsHeaderText = document.getElementById("round-results-header");
const roundResultsDescText = document.getElementById("round-results-desc");

const playAgainBtn = document.getElementById("play-again-btn");


let pot = 0;
let wager = 0;
let houseRate = 1;
let roundEarnings = 0;
let legendDepth = 0;

// Local Storage Variables
let gold = parseInt(localStorage.getItem('gold')) || 50;
goldText.innerText = gold;
let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
gamesPlayedText.innerText = gamesPlayed;
let allWinnings = parseInt(localStorage.getItem('allWinnings')) || 0;
console.log("allWinnings value loaded:", allWinnings);
overallText.innerText = allWinnings;
let kHit = parseInt(localStorage.getItem('kHit')) || 0;
kHitText.innerText = kHit;
let kMissed = parseInt(localStorage.getItem('kMissed')) || 0;
kMissedText.innerText = kMissed;
let kSplit = parseInt(localStorage.getItem('kSplit')) || 0;
kSplitText.innerText = kSplit;
let kicks = parseInt(localStorage.getItem('kicks')) || 0;
kicksText.innerText = kicks;
let snakes = parseInt(localStorage.getItem('snakes')) || 0;
snakesText.innerText = snakes;
let maws = parseInt(localStorage.getItem('maws')) || 0;
mawsText.innerText = maws;
let legendary = parseInt(localStorage.getItem('legendary')) || 0;
legendaryText.innerText = legendary;
let bestLegendary = parseInt(localStorage.getItem('bestLegendary')) || 0;
bestDepthText.innerText = bestLegendary;

// Roll Variables
var giantroll = 0;
var playerRolls = [];
var playerPairs = [];

// Phase Tracking Variables
var splitCount = 0;
var roundOver = false;

// Visibility Tracking Variables
let wagerShowing = true;
let giantRollShowing = false;
let playerRollShowing = false;
let roundResultsShowing = false;

// Click Status Variables
// Because we're not using React or any other external libraries, these prevent buttons from calling a function multiple times before it has processed.
let tabClicked = false;
let submitClicked = false;
let playAgainClicked = false;

let sidebarShowing = false;

// Player Data Local Storage


// Placeholder function to update text
// Will be updated to handle text animation later
const textUpdate = (targetText, targetVar) => {
    targetText.innerHTML = targetVar;
}

// Sidebar Visibility and Content Switching Functions
const toggleSidebar = () => {
    if (sidebarShowing) {
        sidebar.style.transform = "translateX(100%)";
        gameAreaContainer.style.width = "100%";
    } else {
        sidebar.style.transform = "translateX(0%)";
        gameAreaContainer.style.width = "calc(100% - var(--sidebar-width))";
    }
    sidebarShowing = !sidebarShowing;
}

let activeSidebarContent = ""; // possible options: gameHelp, eventLog, playerStats
let activeTab = "";

const updateActiveTab = (targetTab) => {
    console.log("Active Tab:", activeTab.innerText);
    console.log("Target Tab:", targetTab.innerText);
    if (targetTab === "") {
        activeTab === "" ? undefined : activeTab.classList.remove('currently-showing-tab');
        localStorage.setItem("activeTab", "");
        activeTab = "";
    } else if (targetTab !== activeTab) {
        activeTab === "" ? undefined : activeTab.classList.remove('currently-showing-tab');
        targetTab.classList.add('currently-showing-tab');
        activeTab = targetTab;
        console.log(activeTab);
        localStorage.setItem("activeTab", activeTab.innerText);
    } else {
        targetTab.classList.add('currently-showing-tab');
    }
}



// TODO - Implement some logic to prevent resizing of main area when updating tabs?
const changeSidebarContent = (targetContent) => {
    if (!sidebarShowing) { // Sidebar not showing
        if (targetContent === activeSidebarContent) {
            updateActiveTab(targetContent);
            toggleSidebar();
        } else {
            if (targetContent === gameHelpButton) {
                updateActiveTab(gameHelpButton);
                gameHelpContainer.style.visibility = "visible";
                eventLogContainer.style.visibility = "hidden";
                playerStatsContainer.style.visibility = "hidden";
                activeSidebarContent = gameHelpButton;
            } else if (targetContent === eventLogButton) {
                updateActiveTab(eventLogButton);
                gameHelpContainer.style.visibility = "hidden";
                eventLogContainer.style.visibility = "visible";
                playerStatsContainer.style.visibility = "hidden";
                activeSidebarContent = eventLogButton;
            } else {
                updateActiveTab(playerStatsButton);
                gameHelpContainer.style.visibility = "hidden";
                eventLogContainer.style.visibility = "hidden";
                playerStatsContainer.style.visibility = "visible";
                activeSidebarContent = playerStatsButton;
            }
            toggleSidebar();
        }
    } else { // Sidebar showing
        if (targetContent === activeSidebarContent) {
            updateActiveTab("");
            toggleSidebar();
        } else {
            toggleSidebar();
            setTimeout(() => {
                if (targetContent === gameHelpButton) {
                    updateActiveTab(gameHelpButton);
                    gameHelpContainer.style.visibility = "visible";
                    eventLogContainer.style.visibility = "hidden";
                    playerStatsContainer.style.visibility = "hidden";
                    activeSidebarContent = gameHelpButton;
                } else if (targetContent === eventLogButton) {
                    updateActiveTab(eventLogButton);
                    gameHelpContainer.style.visibility = "hidden";
                    eventLogContainer.style.visibility = "visible";
                    playerStatsContainer.style.visibility = "hidden";
                    activeSidebarContent = eventLogButton;
                } else {
                    updateActiveTab(playerStatsButton);
                    gameHelpContainer.style.visibility = "hidden";
                    eventLogContainer.style.visibility = "hidden";
                    playerStatsContainer.style.visibility = "visible";
                    activeSidebarContent = playerStatsButton;
                }
                toggleSidebar();
            }, 300);
        }
    } setTimeout(() => {
        tabClicked = false;
    }, 300);
}

// Game Area Visibility Functions
const toggleWagerInput = () => {
    if (wagerShowing) {
        wagerContainer.style.opacity = "0";
        setTimeout(() => {
            wagerContainer.style.visibility = "hidden";
        }, 350);
    } else {
        wagerContainer.style.visibility = "visible";
        wagerContainer.style.opacity = "1";
    }
    wagerShowing = !wagerShowing;
}

const toggleGiantRoll = () => {
    if (giantRollShowing) {
        giantRollContainer.style.transform = "translate(-50%, -100%)";
    } else {
        giantRollContainer.style.transform = "translate(-50%, 0%)";
    }
    giantRollShowing = !giantRollShowing;
}

const togglePlayerRoll = () => {
    if (playerRollShowing) {
        playerRollContainer.style.transform = "translate(-50%, 100%)";
    } else {
        playerRollContainer.style.transform = "translate(-50%, 0%)";
    }
    playerRollShowing = !playerRollShowing;
}

const toggleRoundResults = () => {
    if (roundResultsShowing) {
        roundResultsContainer.style.opacity = "0";
        setTimeout(() => {
            roundResultsContainer.style.visibility = "hidden";
        }, 350);
    } else {
        roundResultsContainer.style.visibility = "visible";
        roundResultsContainer.style.opacity = "1";
    }
    roundResultsShowing = !roundResultsShowing;
}

// Generates dice rolls of varying sizes, inclusive of min and max values;
const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Validating Wager Input
const validateInput = inputValue => {
    const sanitizedValue = inputValue.trim();
    if (sanitizedValue === "") {
        return false;
    }
    return true;
}

// Gameplay Functions
//? see ## submitWager() in script_comments.md
const submitWager = () => {
    const submittedWager = Math.floor(wagerInput.value);
    if (!validateInput(wagerInput.value)) {
        return;
    } else if (wager > 0) {
        console.error("Wager already placed");
        return;
    } else if (submittedWager < 1) {
        console.error("Wager less than 1 submitted");
        return;
    } else if (Math.floor(submittedWager) > gold) {
        console.error("Submitted wager is more than player gold");
        return;
    } else {
        wager = submittedWager;
        roundOver = false;
        gold -= wager;
        goldText.innerText = gold;
        pot += wager;
        roundEarnings -= wager;
        gamesPlayed++;
        textUpdate(gamesPlayedText, gamesPlayed);
        console.log(`Wager: ${wager}`);
        toggleWagerInput();
        playAgainClicked = false;
        setTimeout(() => {
            rollGiant();
        }, 200);
    }
}

//? see ## rollGiant() in script_comments.md
const rollGiant = () => {
    giantRoll = randomInt(1, 10);
    giantRollText.innerText = giantRoll;
    toggleGiantRoll();
    if (giantRoll === 1) {
        console.log('Giant kicks');
        roundResultsHeaderText.innerText = "You lose";
        roundResultsDescText.innerText = "The giant kicks your halflings away before they can act.";
        kicks++;
        textUpdate(kicksText, kicks);
        houseWins();
        roundEnd();
    } else {
        if (giantRoll === 2 || giantRoll === 3) {
            houseRate = 1;
        } else if (giantRoll >= 4 && giantRoll <= 6) {
            houseRate = 2;
        } else if (giantRoll >= 7 && giantRoll <= 9) {
            houseRate = 3;
        } else if (giantRoll === 10) {
            houseRate = 5;
        } else {
            houseRate = 1;
        }
        pot += (wager * houseRate);
        console.log("Start Pot: ", pot);
        rollPlayer();
    }
}

//? see ## rollHalflings() in script_commands.md
const rollPlayerPairs = (rolls) => {
    // While function is not accessible normally, catching bad input here prevents issues in later functions.
    if (rolls % 2 === 1) { // Error check to ensure input is not an odd number, player rolls should always be pairs.
        console.error("Player had odd number of rolls");
        return;
    }
    for (let i = 0; i < rolls; i++) {
        playerRolls.push(randomInt(1, 6));
    }
}

class PlayerRollPair {
    constructor(r1, r2) {
        this.roll1 = r1;
        this.roll2 = r2;
        this.total = this.roll1 + this.roll2;
    }
}

const pairPlayerRolls = () => {
    const newIndex = playerRolls.length / 2;
    for (let i = 0; i < newIndex; i++) {
        playerPairs.push(new PlayerRollPair(playerRolls[i], playerRolls[newIndex + i]));
    }
}

//? see ##playerRoll() in script_comments.md
const rollPlayer = () => {
    if (giantRoll === 0) {
        console.error("Giant has not rolled");
        return;
    } else if (roundOver) {
        console.error("No active round");
        return;
    } else {
        rollPlayerPairs(2);
        playerRoll1Text.innerText = playerRolls[0];
        playerRoll2Text.innerText = playerRolls[1];
        playerRollTotal.innerText = playerRolls[0] + playerRolls[1];
        togglePlayerRoll();
        const rollOutcome = checkRolls(playerRolls[0], playerRolls[1], giantRoll);
        switch (rollOutcome) {
            case 'split':
                kSplitEvent();
                console.warn("Split, running as player win for now")
                playerWins(pot);
                break;
            case 'win':
                kHitEvent();
                playerWins(pot);
                break;
            case 'push':
                snakeEvent();
                betsPush(wager);
                break;
            case 'maw':
                mawEvent();
                houseWins();
                break;
            default:
                kMissEvent();
                houseWins();
                break;
        }
        roundEnd();
    }
}

//? see ## checkRolls() in script_comments.md
const checkRolls = (roll1, roll2, knee) => {
    const rollsTotal = roll1 + roll2;
    if (rollsTotal === 2) {
        return 'push';
    } else if (rollsTotal >= 11) {
        return 'maw';
    } else if (rollsTotal === knee) {
        return 'split';
    } else if (rollsTotal > knee) {
        return 'win';
    } else {
        return 'lose';
    }
}

/*

    PLAYER SPLIT STUFF WILL GO HERE

*/

// Results Tracking Functions
const snakeEvent = () => {
    console.log("Bets push");
    snakes++;
    textUpdate(snakesText, snakes);
    roundResultsHeaderText.innerText = "Bets Push";
    roundResultsDescText.innerText = "A snake scares the giant, causing it to run away. The round resets and you get your gold back."
}

const mawEvent = () => {
    console.log("Maw consumes, Giant wins");
    maws++;
    textUpdate(mawsText, maws);
    roundResultsHeaderText.innerText = "You lose";
    roundResultsDescText.innerText = `The giant consumes your halflings.`
}

const kHitEvent = () => {
    console.log("Knee hit, Player wins");
    kHit++;
    textUpdate(kHitText, kHit);
    roundResultsHeaderText.innerText = "You win!";
    roundResultsDescText.innerHTML = `Your halflings hit giant's knee and fell the beast.<br /> You win ${pot} gold!`
}

const kSplitEvent = () => {
    console.log("Player splits the knee");
    kSplit++;
    textUpdate(kSplitText, kSplit);
    // Placeholder text until splits are fully implemented
    roundResultsHeaderText.innerText = "You win!";
    roundResultsDescText.innerHTML = `Your halflings hit giant's knee and fell the beast.<br /> You win ${pot} gold!`
}


const kMissEvent = () => {
    console.log("Missed knee, Giant wins");
    kMissed++;
    textUpdate(kMissedText, kMissed);
    roundResultsHeaderText.innerText = "You lose";
    roundResultsDescText.innerText = `Your halflings miss the giant's knee and were slain.`
}

// Win/Loss/Draw Functions
const betsPush = toReturn => {
    gold += toReturn;
    goldText.innerText = gold;
    roundEarnings += toReturn;
    console.log("Returning", toReturn, "gold to the player");
    console.log(`Round earnings: ${roundEarnings}`);
}

const houseWins = () => {
    allWinnings += roundEarnings;
    textUpdate(overallText, allWinnings);
}

const playerWins = winnings => {
    gold += winnings;
    goldText.innerText = gold;
    roundEarnings += winnings;
    console.log(`Round earnings: ${roundEarnings}`);
    allWinnings += roundEarnings;
    textUpdate(overallText, allWinnings);
}

// Ending the Round
const roundEnd = () => {
    wager = 0;
    pot = 0;
    houseRate = 1;
    textUpdate(lastGameText, roundEarnings);
    roundEarnings = 0;
    playerRolls = [];
    roundOver = true;
    splitCount = 0;
    toggleRoundResults();
    submitClicked = false;
    localStorage.setItem("gold", gold);
    localStorage.setItem("gamesPlayed", gamesPlayed);
    localStorage.setItem("allWinnings", allWinnings);
    localStorage.setItem("kHit", kHit);
    localStorage.setItem("kMissed", kMissed);
    localStorage.setItem("kSplit", kSplit);
    localStorage.setItem("kicks", kicks);
    localStorage.setItem("snakes", snakes);
    localStorage.setItem("maws", maws);
    localStorage.setItem("legendary", legendary);
    localStorage.setItem("bestLegendary", bestLegendary);
}


// Set active tab from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("activeTab") === "Game Help") {
        activeTab = gameHelpButton;
        changeSidebarContent(gameHelpButton);
    } else if (localStorage.getItem("activeTab") === "Event Log") {
        activeTab = eventLogButton;
        changeSidebarContent(eventLogButton);
    } else if (localStorage.getItem("activeTab") === "Player Stats") {
        activeTab = playerStatsButton;
        changeSidebarContent(playerStatsButton);
    } else {
        activeTab = "";
    }
    console.log("Page load Active Tab:", activeTab);
    updateActiveTab(activeTab);
});


// User Inputs

// Sidebar Content Tabs
gameHelpButton.addEventListener("click", () => {
    if (!tabClicked) {
        tabClicked = true;
        changeSidebarContent(gameHelpButton);
    }
});
eventLogButton.addEventListener("click", () => {
    if (!tabClicked) {
        tabClicked = true;
        changeSidebarContent(eventLogButton);
    }
});
playerStatsButton.addEventListener("click", () => {
    if (!tabClicked) {
        tabClicked = true;
        changeSidebarContent(playerStatsButton);
    }
});

// Catching the use of "Enter" on the Wager Submit field
wagerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (!submitClicked) {
            submitClicked = true;
            submitWager();
        }
    }
})

wagerSubmit.addEventListener("click", () => {
    if (!submitClicked) {
        submitClicked = true;
        submitWager();
    }
})

playAgainBtn.addEventListener("click", () => {
    if (!playAgainClicked) {
        playAgainClicked = true;
        toggleRoundResults();
        toggleGiantRoll();
        if (playerRollShowing) {
            togglePlayerRoll();
        }
        setTimeout(() => {
            toggleWagerInput();
        }, 350);
    }
})

// Dev Stuff
const addGold = document.getElementById("dev-add-gold-btn");
const toggleWagerInputBtn = document.getElementById("toggle-wager-input-vis");
const toggleGiantRollBtn = document.getElementById("toggle-giant-roll-vis");
const togglePlayerRollBtn = document.getElementById("toggle-player-roll-vis");
const toggleRoundResultsBtn = document.getElementById("toggle-round-results-vis");
const clearLocalStorageBtn = document.getElementById("clear-local-data-btn");

addGold.addEventListener("click", () => {
    if (gold < 999999) {
        gold += 500;
        goldText.innerText = gold;
    }
})

toggleWagerInputBtn.addEventListener("click", toggleWagerInput);
toggleGiantRollBtn.addEventListener("click", toggleGiantRoll);
togglePlayerRollBtn.addEventListener("click", togglePlayerRoll);
toggleRoundResultsBtn.addEventListener("click", toggleRoundResults);
clearLocalStorageBtn.addEventListener("click", () => {
    localStorage.clear();
});