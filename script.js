// TODO: Build results class after progressing javascript bootcamp to the point we have covered classes.

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
var halflingRolls = [];
var houseRate = 1;

var splitFlag = 0;
var roundOver = 0;

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
const eventLogText = document.querySelector("#eventLog");

const wagerInput = document.querySelector("#wagerInput");
const wagerSubmit = document.querySelector("#wagerSubmit");


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

// Text fading ref: https://stackoverflow.com/questions/74114504/how-to-make-text-fade-out-and-new-text-fade-in-on-change
function fadeChange(targetText, targetVar, fadeTime) {
    targetText.setAttribute("class", "text-fade");
    setTimeout(() => {
        targetText.innerHTML = targetVar;
        targetText.setAttribute("class", "text-show");
    }, fadeTime)
}

function updateEventText(text) {
    eventTextUpdate = text;
    fadeChange(eventLogText, eventTextUpdate, 350);
}

function validateInput(inputValue) {
    const sanitizedValue = inputValue.trim();
    // console.log(sanitizedValue);
    if (sanitizedValue === "") {
        updateEventText("Your wager cannot be blank.");
        return false;
    }
    return true;
}


function submitWager() {
    if (wager > 0) {
        updateEventText("You have already placed a wager, you cannot place another one until this round is complete.");
    } else {
        wager = wagerInput.value;
        if (validateInput(wager)) {
            wager = Math.floor(wager);
            if (wager < 1) {
                updateEventText('Your wager cannot be less than 1. Nice try though.<br><img src="./img/cat_glare.gif">');
                wager = 0;
            } else if (wager > gold) {
                updateEventText(`You cannot wager more gold than you have. You currently have ${gold} gold.`);
                wager = 0;
            } else {
                roundOver = 0;
                gold -= wager;
                fadeChange(goldText, gold, 350);
                pot += wager;
                fadeChange(potText, pot, 350);
                roundEarnings -= wager;
                // console.log("Round earnings: " + roundEarnings);
                console.log(`Wager: ${wager}`);
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
        updateEventText("The Giant kicks the Halflings before they can move, the Giant wins and you lose your wager.");
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
        updateEventText(`<p>The Giant rolls a d10. The knee is set to ${giantRoll}.<br>The payout rate for this knee is ${houseRate}:1.</p><p>Roll your Halflings to take on the Giant.</p>`);
        pot = wager + (wager * houseRate);
        fadeChange(potText, pot, 350);
    }
}

function rollHalflings(rolls) {
    for (let i = 0; i < rolls; i++) {
        halflingRolls.push(randomInt(1, 6));
    }
    console.log(`Halfling rolls contents: ${halflingRolls}`);
}

function playerRoll() {
    if (giantRoll === 0) {
        updateEventText("You need to place a wager and have the Giant roll before you can roll your Halflings!");
    } else if (roundOver === 1) {
        updateEventText("The round has ended, you cannot roll your halflings again until you start a new round by submitting another wager.");
    } else {
        rollHalflings(2);
        fadeChange(halflingRoll1Text, halflingRolls[0], 350);
        fadeChange(halflingRoll2Text, halflingRolls[1], 450);
        fadeChange(halflingRollTotalText, halflingRolls[0] + halflingRolls[1], 500);
        let rollOutcome = checkRolls(halflingRolls[0], halflingRolls[1], giantRoll);
        if (rollOutcome === "split") {
            splitRolls();
        } else if (rollOutcome === "win") {
            playerWins();
        } else if (rollOutcome === "push") {
            betsPush();
        } else {
            houseWins();
        }
        roundEnd();
    }
}

function checkRolls(roll1, roll2, knee) {
    rollsTotal = roll1 + roll2;
    if (rollsTotal === 2) {
        console.log("Bets push.");
        updateEventText("The Giant sees a snake and runs in fear. Bets are reset.");
        snakes++;
        fadeChange(snakesText, snakes, 350);
        return "push";
    } else if (rollsTotal === 11 || rollsTotal === 12) {
        console.log("Maw consumes, Giant wins.");
        updateEventText("The Halflings miscalculate their attack and are consumed by the Giant. The Giant wins and you lose your wager.");
        maws++;
        fadeChange(mawsText, maws, 350);
        return "lose";
    } else if (rollsTotal === knee) {
        console.log("Halflings split the knee.");
        console.log(">> Not doing anything here yet.");
        updateEventText("The Halflings split the knee!");
        kneesSplit++;
        fadeChange(kneesSplitText, kneesSplit, 350);
        return "split";
    } else if (rollsTotal > knee) {
        console.log("Halflings hit the knee, Halflings win.");
        updateEventText(`The Halflings strike the Giants knee and fell the beast. You win ${pot} gold!`);
        kneesHit++;
        fadeChange(kneesHitText, kneesHit, 350);
        return "win";
    } else {
        console.log("Halflings miss the knee, Giant wins.");
        updateEventText("The Halflings are unable to strike the Giant's knee and are crushed. The Giant wins and you lose your wager.");
        kneesMissed++;
        fadeChange(kneesMissedText, kneesMissed, 350);
        return "lose";
    }
}

/*
The pot is not being updated here because each half of this split can win the same pot, which is why the initial wager was taken from the player's gold. It is easier just to leave the value of the pot the same internally instead of doubling it and having each side play for half.
*/
function splitRolls() {
    if (splitFlag === 0) {
        if (gold < wager) {
            updateEventText(`The halflings split the knee, but you don't have enough gold to keep going. You win ${pot} gold!`);
            kneesHit++;
            fadeChange(kneesHitText, kneesHit, 350);
            playerWins();
        } else {
            // TODO: Ask user if they would like to split.
            // TODO: Prompt the user to roll new halflings instead of doing it automatically.
            rollHalflings(2);
            gold -= wager;
            fadeChange(goldText, gold, 350);
            fadeChange(potText, pot * 2, 350); // Visually doubling the pot, but the internal value remains the same for the sake of simplicity.
            console.log("Halfling team 1 total: " + halflingRolls[0] + halflingRolls[2]);
            console.log("Halfling team 2 total: " + halflingRolls[1] + halflingRolls[3]);
            let splitResult1 = checkRolls(halflingRolls[0], halflingRolls[2], giantRoll);
            let splitResult2 = checkRolls(halflingRolls[1], halflingRolls[3], giantRoll);
            updateEventText("<p><<<PLACEHOLDER TEXT>>></p>");
            if (splitResult1 === "push" || splitResult2 === "push") { // If either split results in a snake, both bets push.
                updateEventText("<p><<<PLACEHOLDER TEXT>>></p>");
                snakes++;
                fadeChange(snakesText, snakes, 350);
                betsPush();
                betsPush();
            } else if (splitResult1 === "split" || splitResult2 === "split") {
                updateEventText("<p><<<PLACEHOLDER TEXT>>></p>");
                splitFlag++;
                kneesSplit++;
                fadeChange(kneesSplitText, kneesSplit, 350);
                splitRolls();
            } else {
                // 
            }

        }
    } else if (splitFlag === 1) {
        // TODO: Ask user if they would like to go legendary.
        updateEventText("<p><<<PLACEHOLDER TEXT>>></p>");
    } else {
        pass
    }
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

/*
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
*/

function betsPush() {
    gold += wager;
    roundEarnings += wager;
    console.log(`Round earnings: ${roundEarnings}`);
    fadeChange(goldText, gold, 350);
}

function houseWins() {
    allWinnings += roundEarnings;
    fadeChange(overallText, allWinnings, 350);
}

function playerWins() {
    gold += pot;
    roundEarnings += pot;
    console.log(`Round earnings: ${roundEarnings}`);
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
    halflingRolls = [];
    roundOver = 1;
    splitFlag = 0;
    console.log("[------------------------ ROUND ENDING ------------------------]");
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


/*
    <div id="dev stuff">
        <p><strong>Dev Stuff</strong></p>
        <button class="devButton" onclick="rollGiant()">Test Giant</button>
        <button class="devButton" onclick="rollHalflings()">Test Halflings</button>
        <button class="devButton" onclick="houseWins()">House Wins</button>
        <button class="devButton" onclick="betsPush()">Bets Push</button>
        <button class="devButton" onclick="addGold()">Add Gold</button>
    </div>
*/
