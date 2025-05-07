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

var splitFlag = 0;

var splitRoll1 = 0;
var splitRoll2 = 0;

var legendRoll1 = 0;
var legendRoll2 = 0;
var legendRoll3 = 0;
var legendRoll4 = 0;

let eventTextUpdate;

let textIndex = 0;

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

const buttonRules = document.querySelector("#buttonRules");
const buttonEvents = document.querySelector("#buttonEvents");
const buttonPayouts = document.querySelector("#buttonPayouts");
const helpText = document.querySelector("#helpText");

const gameHelp = [
    '<p>Halflings and Giants is a game of chance where you, the Halflings, gamble against the house, the Giant.</p><p>By rolling two six sided die the Halflings need to beat the Giant\'s roll of a single ten sided die. The game begins with the Halflings placing a wager into the pot. The Giant then rolls setting the "Knee." The Halfling, you the player, then click to roll each die individually. You are trying to roll higher than the Knee. If you succeed, you get varying levels of payout depending on the height of the Knee.</p>',
    '<ul><li>If the Giant rolls a 1, this is the "Kick." The Giant wins automatically.</li><li>If the Halflings roll two ones, that is the "Snake." The Giant flees in fear and the game resets to placing a wager.</li><li>If the Halflings roll an 11 or 12 they leap into the "Maw." This is another automatic win for the Giant.</li><li>If the Halflings hit the Knee exactly, they may chose to "split" their dice. The Halfling will then roll an additional two dice, and they will be paired with the existing halflings. Each pair rolled will follow the same rules as above.</li><ul><li>If the Halflings hit the Knee again while split they can choose to go "Legendary". In this situation, the player will roll an additional 4 dice, each being paired with one of the previous 4 rolls.</li></ul></ul>',
    '<ul><li>If the Knee is 2-3, house pays 1:1</li><li>If the Knee is 4-6, house pays 2:1</li><li>If the Knee is 7-9, house pays 3:1</li><li>If the Knee is 10, house pays 5:1</li></ul>',
    ''
]

function validateInput(inputValue) {
    const sanitizedValue = inputValue.trim();
    // console.log(sanitizedValue);
    if (sanitizedValue === "") {
        eventTextUpdate = "Your wager cannot be blank.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        // alert("Wager cannot be blank!");
        return false;
    }
    return true;
}

// Text fading ref: https://stackoverflow.com/questions/74114504/how-to-make-text-fade-out-and-new-text-fade-in-on-change
function fadeChange(targetText, targetVar, fadeTime) {
    targetText.setAttribute("class", "text-fade");
    setTimeout(() => {
        targetText.innerHTML = targetVar;
        targetText.setAttribute("class", "text-show");
    }, fadeTime)
}

/*
function roundStart() {
    roundEarnings = 0;
}
*/

function submitWager() {
    if (wager > 0) {
        eventTextUpdate = "You have already placed a wage, you cannot place another one until this round is complete.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        // alert("You have already placed a wager!");
    } else {
        wager = wagerInput.value;
        if (validateInput(wager)) {
            wager = Math.floor(wager);
            if (wager < 1) {
                eventTextUpdate = 'Your wager cannot be less than 1. Nice try though.<br><img src="./img/cat_glare.gif">';
                fadeChange(eventLogText, eventTextUpdate, 350);
                wager = 0;
                // alert("You can't wager negative gold. Nice try.");
            } else if (wager > gold) {
                eventTextUpdate = "You cannot wager more gold than you have. You currently have " + gold + " gold.";
                fadeChange(eventLogText, eventTextUpdate, 350);
                wager = 0;
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

function rollGiant() {
    giantRoll = randomInt(1, 10);
    // console.log("Giant roll: " + giantRoll);
    fadeChange(giantRollText, giantRoll, 350);
    if (giantRoll === 1) {
        console.log("Giant kicks, Giant wins.");
        eventTextUpdate = "The Giant kicks the Halflings before they can move, the Giant wins and you lose your wager.";
        fadeChange(eventLogText, eventTextUpdate, 350);
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
        eventTextUpdate = "<p>The Giant rolls a d10. The knee is set to " + giantRoll + ".<br>The payout rate for this knee is " + houseRate + ":1.</p><p>Roll your Halflings to take on the Giant.</p>";
        fadeChange(eventLogText, eventTextUpdate, 350);
        pot = wager + (wager * houseRate);
        fadeChange(potText, pot, 350);
    }
}

function rollHalflings() {
    if (giantRoll === 0) {
        // alert("You need to place a wager and have the Giant roll before you can roll your halflings!");
        eventTextUpdate = "You need to place a wager and have the Giant roll before you can roll your Halflings!";
        fadeChange(eventLogText, eventTextUpdate, 350);
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
        checkRolls(halflingRoll1, halflingRoll2, giantRoll);
        /*
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
        */
    }
}

function checkRolls(roll1, roll2, knee) {
    rollsTotal = roll1 + roll2;
    if (rollsTotal === 2) {
        console.log("Giant is scared by a snake, bets push.");
        eventTextUpdate = "The Giant sees a snake and runs in fear. Bets are reset.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        betsPush();
        snakes++;
        fadeChange(snakesText, snakes, 350);
        roundEnd();
    } else if (rollsTotal === 11 || rollsTotal === 12) {
        console.log("Halflings are consumed by the Maw, Giant wins.");
        eventTextUpdate = "The Halflings miscalculate their attack and are consumed by the Giant. The Giant wins and you lose your wager.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        houseWins();
        maws++;
        fadeChange(mawsText, maws, 350);
        roundEnd();
    } else if (rollsTotal < knee) {
        console.log("Halflings miss the knee, Giant wins.");
        eventTextUpdate = "The Halflings are unable to strike the Giant's knee and are crushed. The Giant wins and you lose your wager.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        houseWins();
        kneesMissed++;
        fadeChange(kneesMissedText, kneesMissed, 350);
        roundEnd();
    } else if (rollsTotal > knee) {
        console.log("Halflings hit the knee, Halflings win.");
        eventTextUpdate = "The Halflings strike the Giants knee and fell the beast. You win " + pot + " gold!";
        fadeChange(eventLogText, eventTextUpdate, 350);
        playerWins();
        kneesHit++;
        fadeChange(kneesHitText, kneesHit, 350);
        roundEnd();
    } else if (rollsTotal === knee) {
        // splitRolls();
        console.log("Halflings split the knee.");
        console.log(">> Not doing anything here yet.");
        eventTextUpdate = "The Halflings split the knee! I haven't implemented this yet.";
        fadeChange(eventLogText, eventTextUpdate, 350);
        playerWins();
        roundEnd();
    } else {
        console.log(">>>> HOW DID THIS HAPPEN");
        eventTextUpdate = "How did you get here?";
        fadeChange(eventLogText, eventTextUpdate, 350);
        betsPush();
        roundEnd();
    }
    /*
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
    */
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
    roundEarnings += wager;
    console.log("Round earnings: " + roundEarnings);
    fadeChange(goldText, gold, 350);
}

function houseWins() {
    allWinnings += roundEarnings;
    fadeChange(overallText, allWinnings, 350);
}

function playerWins() {
    gold += pot;
    roundEarnings += pot;
    console.log("Round earnings: " + roundEarnings);
    allWinnings += roundEarnings;
    fadeChange(goldText, gold, 350);
    fadeChange(overallText, allWinnings, 350);
}

function roundEnd() {
    wager = 0;
    pot = 0;
    houseRate = 1;
    fadeChange(potText, pot, 350);
    fadeChange(lastGameText, roundEarnings, 350);
    roundEarnings = 0;
    // console.log("Wager: " + wager);
    // console.log("[------------------------ RESETTING ------------------------]");
    eventLogText.setAttribute("class", "text-fade");
    setTimeout(() => {
        eventLogText.innerHTML += "<p>Submit another wager to play again.</p>"
        eventLogText.setAttribute("class", "text-show");
    }, 350)
}

function restart() {
    pass
}

function addGold() {
    gold += 500;
    fadeChange(goldText, gold, 350);
}

function updateHelp(page) {
    if (textIndex !== page) {
        fadeChange(helpText, gameHelp[page], 350);
        textIndex = page;
    } else {
        fadeChange(helpText, gameHelp[3], 350);
        textIndex = 3;
    }
}


// buttonRules.onclick = fadeChange(helpText, gameHelp[0], 350);
// buttonEvents.onclick = fadeChange(helpText, gameHelp[1], 350);
// buttonPayouts.onclick = fadeChange(helpText, gameHelp[2], 350);
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
