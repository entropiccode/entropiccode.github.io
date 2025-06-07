// Base Game Variables
let gold = 50;
let pot = 0;
let wager = 0;
let houseRate = 1;

// Tracking Variables
let roundEarnings = 0;
let legendDepth = 0;
let allWinnings = 0;
let kHit = 0;
let kMissed = 0;
let kSplit = 0;
let kicks = 0;
let snakes = 0;
let maws = 0;
let legendary = 0;
let bestLegendary = 0;

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

// Page Elements
const wagerContainer = document.getElementById("wager-input-container");
const giantRollContainer = document.getElementById("giant-roll-container");
const playerRollContainer = document.getElementById("player-roll-container");
const roundResultsContainer = document.getElementById("round-results-container");

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

// Click Status Variables
// Because we're not using React or any other external libraries, these prevent buttons from calling a function multiple times before it has processed.
let submitClicked = false;
let playAgainClicked = false;

// Validating Wager Input
const validateInput = inputValue => {
    const sanitizedValue = inputValue.trim();
    if (sanitizedValue === "") {
        return false;
    }
    return true;
}

// Element Visibility Functions
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
        giantRollContainer.style.transform = "translateY(-100%)";
    } else {
        giantRollContainer.style.transform = "translateY(0%)";
    }
    giantRollShowing = !giantRollShowing;
}

const togglePlayerRoll = () => {
    if (playerRollShowing) {
        playerRollContainer.style.transform = "translateY(100%)";
    } else {
        playerRollContainer.style.transform = "translateY(0%)";
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
    roundResultsHeaderText.innerText = "Bets Push";
    roundResultsDescText.innerText = "A snake scares the giant, causing it to run away. The round resets and you get your gold back."
}

const mawEvent = () => {
    console.log("Maw consumes, Giant wins");
    maws++;
    roundResultsHeaderText.innerText = "You lose";
    roundResultsDescText.innerText = `The giant consumes your halflings.`
}

const kHitEvent = () => {
    console.log("Knee hit, Player wins");
    kHit++;
    roundResultsHeaderText.innerText = "You win!";
    roundResultsDescText.innerHTML = `Your halflings hit giant's knee and fell the beast.<br /> You win ${pot} gold!`
}

const kSplitEvent = () => {
    console.log("Player splits the knee");
    kSplit++;
    // Placeholder text until splits are fully implemented
    roundResultsHeaderText.innerText = "You win!";
    roundResultsDescText.innerHTML = `Your halflings hit giant's knee and fell the beast.<br /> You win ${pot} gold!`
}


const kMissEvent = () => {
    console.log("Missed knee, Giant wins");
    kMissed++;
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
}

const playerWins = winnings => {
    gold += winnings;
    goldText.innerText = gold;
    roundEarnings += winnings;

    console.log(`Round earnings: ${roundEarnings}`);
    allWinnings += roundEarnings;
}

// Ending the Round
const roundEnd = () => {
    wager = 0;
    pot = 0;
    houseRate = 1;
    roundEarnings = 0;
    playerRolls = [];
    roundOver = true;
    splitCount = 0;
    toggleRoundResults();
    submitClicked = false;
}

// User Inputs

// Catching the use of "Enter" on the Wager Submit field
wagerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (submitClicked === false) {
            submitClicked = true;
            submitWager();
        }
    }
})

wagerSubmit.addEventListener("click", () => {
    if (submitClicked === false) {
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