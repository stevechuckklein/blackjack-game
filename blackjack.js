"use strict";

const btnDeal = document.querySelector("#deal");
const btnHit = document.querySelector("#hit");
const btnStay = document.querySelector("#stay");
const playerScore = document.getElementById("playerScore");
const dealerScore = document.getElementById("dealerScore");
const gameResult = document.getElementById("result");

let deck = {};
let playerHand = {};
let dealerHand = {};

// Set up the game with initial settings
const init = function () {
  initDeck();
  playerHand = {};
  dealerHand = {};
  gameResult.innerHTML = "";

  btnHit.hidden = false;
  btnStay.hidden = false;
  btnDeal.hidden = true;
};

// Get new deck for round
const initDeck = function () {
  deck = {
    Diamonds: [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"],
    Hearts: [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"],
    Clubs: [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"],
    Spades: [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"],
  };
};

// Remove dealt card from deck
const removeCard = function (deck, card) {
  // get place of value in card array
  const cardIndex = deck[card.suit].indexOf(card.value);
  // remove the specific card
  deck[card.suit].splice(cardIndex, 1);
  // return deck;
};

const pickCard = function (deck) {
  // get suits
  const suits = Object.keys(deck);
  // get random suit
  const suit = suits[Math.trunc(suits.length * Math.random())];
  // get random card
  const cardVal = deck[suit][Math.trunc(deck[suit].length * Math.random())];
  // save info to card object
  const card = {
    suit: suit,
    value: cardVal,
  };
  // remove card from deck
  removeCard(deck, card);

  return card;
};

// Calculate the score for each hand
const cardCalc = function (hand) {
  let total = 0;
  let aceCount = 0;

  // calculate non-ace cards and keep an ace count
  hand.cards.forEach((card) => {
    if (typeof card.value === "string" && card.value !== "Ace") total += 10;
    if (typeof card.value === "number") total += card.value;
    if (card.value === "Ace") aceCount += 1;
  });

  // calculate how aces should be counted during the game
  for (let i = 0; i < aceCount; i++) total > 10 ? (total += 1) : (total += 11);

  return total;
};

// Deal starting hand to player
const dealHand = function (deck) {
  const card1 = pickCard(deck);
  const card2 = pickCard(deck);

  const hand = { cards: [card1, card2] };
  hand.score = cardCalc(hand);

  return hand;
};

// adds another card to hand (array)
const addCard = function (hand) {
  const newCard = pickCard(deck);
  hand.cards.push(newCard);
  hand.score = cardCalc(hand);
  return hand;
};

// Show the player score in the UI
const updatePlayerScore = function (hand) {
  let str = "";
  hand.cards.forEach((card) => (str += `${card.value} of ${card.suit} <br>`));
  return str + `<br>Score: ${hand.score}`;
};

// Show the dealer score in the UI
const updateDealerScore = function (hand) {
  let str = "Hidden Card<br>";
  hand.cards.forEach((card, index) => {
    if (index === 0) return;
    str += `${card.value} of ${card.suit} <br>`;
  });
  return str;
};

// Swap shown buttons
const buttonSwitch = function () {
  if (btnDeal.hidden === false) {
    btnDeal.hidden = true;
    btnHit.hidden = false;
    btnStay.hidden = false;
  } else {
    btnDeal.hidden = false;
    btnHit.hidden = true;
    btnStay.hidden = true;
  }
};

// Compare the Dealer and player's hand against one another
const compareHand = function (pHand, dHand) {
  dealerScore.innerHTML = `${updatePlayerScore(dealerHand)}`;

  if (pHand.score > 21) playerScore.innerHTML += `<br>YOU BUH-BUH-BUSTED`;
  if (dHand.score > 21) dealerScore.innerHTML += `<br>Dealer Busted`;

  if ((pHand.score > dHand.score && pHand.score <= 21) || dHand.score > 21)
    gameResult.innerHTML = "Player Won";
  if ((pHand.score < dHand.score && dHand.score <= 21) || pHand.score > 21)
    gameResult.innerHTML = "Dealer Won";
  if (pHand.score === dHand.score) gameResult.innerHTML = "It's a Tie";

  buttonSwitch();
};

// Add card to player's hand when they hit
const hitButt = function () {
  addCard(playerHand);
  playerHand.total = cardCalc(playerHand);
  playerScore.innerHTML = `${updatePlayerScore(playerHand)}`;

  if (playerHand.total > 21) {
    compareHand(playerHand, dealerHand);
  }
};

// move on to dealer if player selects stay
const stayButt = function () {
  if (dealerHand.score > playerHand.score)
    return compareHand(playerHand, dealerHand);

  while (dealerHand.score <= 16) {
    addCard(dealerHand);
    cardCalc(dealerHand);
  }
  // dealerScore.innerHTML = `${updatePlayerScore(dealerHand)}`;
  compareHand(playerHand, dealerHand);
};

// Start the game or new game
const playBlackJack = function () {
  // Set up the game
  init();

  // deal hands
  playerHand = dealHand(deck);
  dealerHand = dealHand(deck);

  playerScore.innerHTML = `${updatePlayerScore(playerHand)}`;
  dealerScore.innerHTML = `${updateDealerScore(dealerHand)}`;

  if (playerHand.score === 21 || dealerHand.score === 21) compareHand();
};

btnDeal.addEventListener("click", playBlackJack);
btnHit.addEventListener("click", hitButt);
btnStay.addEventListener("click", stayButt);
