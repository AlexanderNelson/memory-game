/*
 * Create a list that holds all of your cards
 */
let selectedCards = [];

//matched cards counter
let matchCount = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
const deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const chosen = event.target;
  if (chosen.className == 'card') {
    flipCard(chosen);
    addCard(chosen);
    recordStartTime();
  }
});

//show card
function flipCard(chosen) {
  if (selectedCards.length < 2) {
    chosen.classList.toggle('open'); //classList and toggle- https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    chosen.classList.toggle('show');
  }
};



// add cards to list
function addCard(chosen) {
  if (selectedCards.length < 2) {
    selectedCards.push(chosen);
    console.log(selectedCards);
    if (selectedCards.length === 2) {
      console.log('array full, waiting for match function')
      isItMatched();
      counter();
    }
  }
};


//matched, lock open
function isItMatched() {
  const isCardClassNameEqual = (firstCard, secondCard) => firstCard.firstElementChild.className === secondCard.firstElementChild.className;
  if (isCardClassNameEqual(selectedCards[0], selectedCards[1])) {
    // selectedCards.classList.toggle('match');
    selectedCards[0].classList.toggle('match');
    selectedCards[1].classList.toggle('match');
    console.log('picked cards', selectedCards[0], selectedCards[1])
    console.log('ding ding');
    matchCount++;
    console.log('matchCount', matchCount);
    gameOver();
    nextPick();
  } else {
    unmatched();
  }
};

//unmatched, remove from list, hide
function unmatched() {
  setTimeout(() => {
    selectedCards.forEach(function(chosen) {
      chosen.classList.remove('open', 'show');
    });
    nextPick();
  }, 1000);
  console.log('BUUZZZ');
};

//clears array to continue to next two picks
function nextPick() {
  selectedCards.length = 0;
  console.log(selectedCards, 'array empty');
};

//all cards matched, disply final score
function gameOver() {
  if (matchCount === 4) {
    recordStopTime();
    calculateTimePlayed();
  }
}

//move counter

let turns = 0;

function counter() {
  turns++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = turns;
};

//stars drop as more turns are needed
function stars() {
  const starBoard = document.querySelectorAll('.stars li');
  star.forEach
};

//get time
let startTime = 0;
let stopTime = 0;

function recordStartTime() {
  if (!startTime) { //prevents startTime reassignment after every clicked card
    startTime = Date.now();
    console.log('startTime =', startTime);
  };
};

function recordStopTime() {
  stopTime = Date.now();
  console.log('stopTime =', stopTime);
};

function calculateTimePlayed() {
  const timePlayed = ((stopTime - startTime) / 1000); //converts to seconds
  console.log('timePlayed = ', timePlayed, 'seconds');
};

//reset game
let replayButton = document.querySelector('.restart');
replayButton.addEventListener('click', resetGame);
let list = document.querySelectorAll('li.card');

function resetGame() {
  console.log('replayButton clicked');
  list.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
  });
  console.log('classes remaining', list)
  // list[0].classList.remove('open', 'show');
  // console.log('remaining classes', list);
};