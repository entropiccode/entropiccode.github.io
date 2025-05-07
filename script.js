let gold = 50;
let pot = 0;
let roundEarnings = 0;
let allWinnings = 0;
let kneesHit = 0;
let kneesMissed = 0;
let kneesSplit = 0;
let kicks = 0;
let snakes = 0;
let maws = 0;
let legendary = 0;

var wager = 0;

var giantRoll = 0;
var halflingRoll1 = 0;
var halflingRoll2 = 0;
var houseRate = 1;

var splitRoll1 = 0;
var splitRoll2 = 0;

var legendRoll1 = 0;
var legendRoll2 = 0;
var legendRoll3 = 0;
var legendRoll4 = 0;

const goldText = document.querySelector("#goldText");
const potText = document.querySelector("#potText");
const lastGameText = document.querySelector("#lastGameText");
const overallText = document.querySelector("#overallText");
const kneesHitText = document.querySelector("#kneesHitText");
const kneesMissedText = document.querySelector("#kneesMissText");
const kneesSplitText = document.querySelector("#kneesSplitText");
const kicksText = document.querySelector("#kicksText");
const snakesText = document.querySelector("#snakesText");
const mawsText = document.querySelector("#mawsText");
const legendaryText = document.querySelector("#legendaryText");

const giantRollText = document.querySelector("#giantRoll");

const halflingRoll1Text = document.querySelector("#halflingRoll1");
const halflingRoll2Text = document.querySelector("#halflingRoll2");
const halflingRollTotalText = document.querySelector("#halflingRollTotal");

const wagerInput = document.querySelector("#wagerInput");
const wagerSubmit = document.querySelector("#wagerSubmit");

const eventLogText = document.querySelector("#eventLog");

const gameEvents = [
    {
        name: "enterWager",
        text: "Enter a wager to begin."
    },
    {
        name: "blankWager",
        text: "Your wager must be a number, and cannot be 0 or less."
    },
    {
        name: "wagerAlreadyPlaced",
        text: "You have already submitted a wager, you cannot submit another one."
    },
    {
        name: "negativeWager",
        text: 'Your wager cannot be negative. Nice try though.\n<img src="./img/cat_glare.gif">'
    },
    {
        name: "notEnoughGold",
        text: "You cannot wager more gold than you have. You currently have " + gold + " gold."
    },
    {
        name: "giantRolls",
        text: "The giant rolls a d10. The knee is set to " + giantRoll + "."
    },
    {
        name: "payoutRate",
        text: "The payout rate for this knee is " + houseRate + ":1."
    },
    {
        name: "giantKicks"
    },
    {
        name: "giantScared"
    },
    {
        name: "halflingsEaten"
    },
    {
        name: "kneeMissed"
    },
    {
        name: "kneeHit"
    },
    {
        name: "kneeSplit"
    },
    {
        name: "startNewRound",
        text: 'Click "Start Round" to start a new round.'
    },
];

function validateInput(inputValue) {
    const sanitizedValue = inputValue.trim();
    // console.log(sanitizedValue);
    if (sanitizedValue === "") {
        fadeChange(eventLogText, gameEvents.find(x => x.name === "blankWager").text, 350);
        // alert("Wager cannot be blank!");
        return false;
    }
    return true;
}

function fadeChange(targetText, targetVar, fadeTime) {
    targetText.setAttribute("class", "text-fade");
    setTimeout(() => {
        targetText.innerHTML = targetVar;
        targetText.setAttribute("class", "text-show");
    }, fadeTime)
}

function roundStart() {
    roundEarnings = 0;
}

function submitWager() {
    if (wager > 0) {
        fadeChange(eventLogText, gameEvents.find(x => x.name === "wagerAlreadyPlaced").text, 350);
        // alert("You have already placed a wager!");
    } else {
        wager = wagerInput.value;
        if (validateInput(wager)) {
            wager = Math.floor(wager);
            if (wager < 0) {
                fadeChange(eventLogText, gameEvents.find(x => x.name === "negativeWager").text, 350);
                // alert("You can't wager negative gold. Nice try.");
            } else if (wager > gold) {
                fadeChange(eventLogText, gameEvents.find(x => x.name === "notEnoughGold").text, 350);
                // alert("You can't wager more gold than you have!");
            } else {
                gold -= wager;
                fadeChange(goldText, gold, 350);
                pot += wager;
                fadeChange(potText, pot, 350);
                roundEarnings -= wager;
                console.log("Wager set");
                console.log("Round earnings: " + roundEarnings);
                // console.log("Wager: " + wager);
                rollGiant();
                // wagerInput.setAttribute("class", "hideThings");
                // wagerSubmit.setAttribute("class", "hideThings");
            }
        }
    }
    wagerInput.value = '';
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Text fading ref: https://stackoverflow.com/questions/74114504/how-to-make-text-fade-out-and-new-text-fade-in-on-change
function rollGiant() {
    giantRoll = randomInt(1, 10);
    // console.log("Giant roll: " + giantRoll);
    fadeChange(giantRollText, giantRoll, 350);
    if (giantRoll === 1) {
        console.log("Giant kicks, Giant wins.");
        houseWins();
        kicks++;
        fadeChange(kicksText, kicks, 350);
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
        pot = wager + (wager * houseRate);
    }
}

function rollHalflings() {
    if (giantRoll === 0) {
        alert("You need to place a wager and have the Giant roll before you can roll your halflings!");
    } else {
        halflingRoll1 = randomInt(1, 6);
        // console.log("Halfling Roll 1: " + halflingRoll1);
        halflingRoll2 = randomInt(1, 6);
        // console.log("Halfling Roll 2: " + halflingRoll2);
        halflingTotal = halflingRoll1 + halflingRoll2;
        // console.log("Halfling Roll Total: " + halflingTotal);
        fadeChange(halflingRoll1Text, halflingRoll1, 350);
        fadeChange(halflingRoll2Text, halflingRoll2, 450);
        fadeChange(halflingRollTotalText, halflingTotal, 500);
        if (halflingTotal === 2) {
            // console.log("Giant is scared by a snake, bets push.");
            betsPush();
            snakes++;
            fadeChange(snakesText, snakes, 350);
        } else if (halflingTotal === 11 || halflingTotal === 12) {
            // console.log("Halflings are consumed by the maw, Giant wins.");
            houseWins();
            maws++;
            fadeChange(mawsText, maws, 350);
        } else {
            checkRolls();
        }
    }
}

function checkRolls() {
    if (halflingTotal < giantRoll) {
        // console.log("Giant wins");
        houseWins();
        kneesMissed++;
        fadeChange(kneesMissedText, kneesMissed, 350);
    } else if (halflingTotal > giantRoll) {
        // console.log("Halflings win");
        playerWins();
        kneesHit++;
        fadeChange(kneesHitText, kneesHit, 350);
    } else if (halflingTotal == giantRoll) {
        // console.log("Halflings split");
        splitRolls();
        kneesSplit++;
        fadeChange(kneesSplitText, kneesSplit, 350);
    } else {
        // console.log("I'm really not sure how this happened...")
        betsPush();
    }
}

function splitRolls() {
    // Doubling the wager, and thus doubling the size of the pot.
    gold -= wager;
    pot = pot * 2;
    splitRoll1 = randomInt(1, 6);
    splitRoll2 = randomInt(1, 6);
    split1Total = halflingRoll1 + splitRoll1;
    split2Total = halflingRoll2 + splitRoll2;
    if (split1Total === giantRoll || split2Total === giantRoll) {
        legendary();
    } else if (split1Total > giantRoll && split2Total > giantRoll) {
        playerWins();
    } else if (split1Total > giantRoll || split2Total > giantRoll) {
        pot = Math.floor(pot / 2);
        playerWins();
    } else if (split1Total < giantRoll && split2Total < giantRoll) {
        houseWins();
    } else {
        console.log("I'm not sure how we got here");
        betsPush();
    }


}

function legendarySplit() {
    // Doubling the wager AGAIN because we're going legendary
    gold -= wager * 2;
    pot = pot * 2;
    legendRoll1 = randomInt(1, 6);
    legendRoll2 = randomInt(1, 6);
    legendRoll3 = randomInt(1, 6);
    legendRoll4 = randomInt(1, 6);
    legend1Total = halflingRoll1 + legendRoll1;
    legend2Total = halflingRoll2 + legendRoll2;
    legend3Total = splitRoll1 + legendRoll3;
    legend4Total = splitRoll2 + legendRoll4;
}

function betsPush() {
    gold += wager;
    fadeChange(goldText, gold, 350);
}

function houseWins() {
    allWinnings -= roundEarnings;
    fadeChange(overallText, allWinnings, 350);
}

function playerWins() {
    gold += pot;
    allWinnings += pot;
    fadeChange(goldText, gold, 350);
    fadeChange(overallText, allWinnings, 350);
}

function roundEnd() {
    wager = 0;
    pot = 0;
    giantRoll = 0;
    houseRate = 1;
    fadeChange(potText, pot, 350);
    fadeChange(lastGameText, lastGame, 350);
    fadeChange(giantRollText, giantRoll, 350);
    fadeChange(lastGameText, roundEarnings, 350);
    // console.log("Wager: " + wager);
    // console.log("[------------------------ RESETTING ------------------------]");
}

function restart() {
    pass
}

function addGold() {
    gold += 500;
    fadeChange(goldText, gold, 350);
}
/*
    Intriguing events:

    If the Giant rolls a 1, this is the "Kick." The Giant wins automatically.
    If the Halflings roll two ones, that is the "Snake." The Giant flees in fear and the game resets to placing
    a wager.
    If the Halflings roll an 11 or 12 they leap into the "Maw." This is another automatic win for the Giant.
    If the Halflings hit the Knee exactly, they may chose to "split" their dice. The Halfling will then roll an additional two dice,
    and they will be paired with the existing halflings. Each pair rolled will follow the same rules as above.
    If the Halflings hit the Knee again while split they can choose to go "Legendary". In this situation, the player will roll an additional 4 dice,
    each being paired with one of the previous 4 rolls.

    Payouts!
    If the Knee is 2-3, house pays 1:1
    If the Knee is 4-6, house pays 2:1
    If the Knee is 7-9, house pays 3:1
    If the Knee is 10, house pays 5:1

                    <span>The payout rate for this knee is <strong><span id="payoutRate">1:1</span></strong></span>.<br>
                    <span>You will win <strong><span id="goldPayout">0</span></strong> gold if you meet the knee.</span>

    <div id="dev stuff">
        <p><strong>Dev Stuff</strong></p>
        <button class="devButton" onclick="rollGiant()">Test Giant</button>
        <button class="devButton" onclick="rollHalflings()">Test Halflings</button>
        <button class="devButton" onclick="houseWins()">House Wins</button>
        <button class="devButton" onclick="betsPush()">Bets Push</button>
        <button class="devButton" onclick="addGold()">Add Gold</button>
    </div>


*/
