let gold = 50;
let pot = 0;
let lastGame = 0;
let allWinnings = 0;
let kneesHit = 0;
let kneesMissed = 0;
let kneesSplit = 0;
let kicks = 0;
let snakes = 0;
let maws = 0;
let legendary = 0;

var giantRoll = 0;
var halflingRoll1 = 0;
var halflingRoll2 = 0;
var halflingTotal = 0;
var houseRate = 1;
var payout = 0;

const goldText = document.querySelector("#goldText");
const potText = document.querySelector("#potText");
const lastGameText = document.querySelector("#lastGameText");
const overallText = document.querySelector("#overallText");
const kneesHitText = document.querySelector("#kneesHitText");
const kneesMissedText = document.querySelector("#kneesMissedText");
const kneesSplitText = document.querySelector("#kneesSplitText");
const kicksText = document.querySelector("#kicksText");
const snakesText = document.querySelector("#snakesText");
const mawsText = document.querySelector("#mawsText");
const legendaryText = document.querySelector("#legendaryText");

const giantRollText = document.querySelector("#giantRoll");
const payoutRateText = document.querySelector("#payoutRate");
const payoutText = document.querySelector("#goldPayout");

const halflingRoll1Text = document.querySelector("#halflingRoll1");
const halflingRoll2Text = document.querySelector("#halflingRoll2");
const halflingRollTotalText = document.querySelector("#halflingRollTotal");

const wagerInput = document.querySelector("#wagerInput");
const wagerSubmit = document.querySelector("#wagerSubmit");

function validateInput(inputValue) {
    const sanitizedValue = inputValue.trim();
    // console.log(sanitizedValue);
    if (sanitizedValue === "") {
        alert("Wager cannot be blank!");
        return false;
    }
    return true;
}

function fadeChange(targetText, targetVar, fadeTime) {
    targetText.setAttribute("class", "text-fade");
    setTimeout(() => {
        targetText.innerText = targetVar;
        targetText.setAttribute("class", "text-show");
    }, fadeTime)
}

function submitWager() {
    let wager = wagerInput.value;
    if (validateInput(wager)) {
        wager = Math.floor(wager);
        console.log(wager);
        if (wager > gold) {
            alert("You can't wager more gold than you have!");
        } else {
            gold -= wager;
            pot += wager;
            fadeChange(goldText, gold, 350);
            fadeChange(potText, pot, 350);
            rollGiant();
            // wagerInput.setAttribute("class", "hideThings");
            // wagerSubmit.setAttribute("class", "hideThings");
        }
        wagerInput.value = '';
    }
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Text fading ref: https://stackoverflow.com/questions/74114504/how-to-make-text-fade-out-and-new-text-fade-in-on-change
function rollGiant() {
    giantRoll = randomInt(1, 10);
    fadeChange(giantRollText, giantRoll, 350);
    if (giantRoll === 1) {
        houseWins();
        houseRate = 1;
        kicks++;
        fadeChange(kicksText, kicks, 350);
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
    }
    payout = pot * houseRate;
    const payoutRate = houseRate + ":1";
    fadeChange(payoutText, payout, 350);
    fadeChange(payoutRateText, payoutRate, 350);
}

function rollHalflings() {
    halflingRoll1 = randomInt(1, 6);
    halflingRoll2 = randomInt(1, 6);
    halflingTotal = halflingRoll1 + halflingRoll2;
    fadeChange(halflingRoll1Text, halflingRoll1, 350);
    fadeChange(halflingRoll2Text, halflingRoll2, 450);
    fadeChange(halflingRollTotalText, halflingTotal, 500);
    if (halflingTotal === 2) {
        betsPush();
        snakes++;
        fadeChange(snakesText, snakes, 350);
    } else if (halflingTotal === 11 || halflingTotal === 12) {
        houseWins();
        maws++;
        fadeChange(mawsText, maws, 350);
    } else {
        checkRolls();
    }
}

function checkRolls() {
    if (halflingTotal < giantRoll) {
        houseWins();
    } else if (halflingTotal > giantRoll) {
        playerWins();
    }
}

function betsPush() {
    lastGame = 0;
    gold += pot;
    pot = 0;
    fadeChange(goldText, gold, 350);
    fadeChange(potText, pot, 350);
    fadeChange(lastGameText, lastGame, 350);
}

function houseWins() {
    lastGame = 0;
    lastGame -= pot;
    allWinnings -= pot;
    pot = 0;
    fadeChange(lastGameText, lastGame, 350);
    fadeChange(potText, pot, 350);
    fadeChange(overallText, allWinnings, 350);
}

function playerWins() {
    lastGame = 0;
    lastGame += payout;
    gold += payout;
    allWinnings += payout;
    pot = 0;
    fadeChange(goldText, gold, 350);
    fadeChange(potText, pot, 350);
    fadeChange(lastGameText, lastGame, 350);
    fadeChange(overallText, allWinnings, 350);
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
    If the Halflings hit the Knee exactly, they may chose to "split" their dice. The Halfling will then roll a
    total of four dice, each pair representing half of the doubled wager. Each pair rolled will follow the same
    rules as above.
    If the Halflings hit the Knee again while split they can choose to go "Legendary". They now roll eight dice,
    with each pair representing a quarter of their quadrupled wager.

    Payouts!
    If the Knee is 2-3, house pays 1:1
    If the Knee is 4-6, house pays 2:1
    If the Knee is 7-9, house pays 3:1
    If the Knee is 10, house pays 5:1

*/