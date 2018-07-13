/*
 * Create a list that holds all of your cards
 */
const allCards = document.querySelector('.deck');
let selectedCards = [];

//matched cards counter
let matchCount = 0;
let list = document.querySelectorAll('li.card');
let turns = 0;
let startTime = 0;
//this will prevent interval being called multiple times when set to 1
let timedisplayed = 0;
let clockSet;

//sounds

var snd = new Audio("../sounds/match-bell.mp3"); // buffers automatically when created


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = array => {
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

function shuffleCards() {
  const unshuffledCards = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(unshuffledCards);
  for (card of shuffledCards) {
    allCards.appendChild(card);
  }
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

const displayTimer = () => {
  const timer = document.querySelector('.clock');
  timedisplayed = 1;
  clockSet = setInterval(function() {
    currentTime = Date.now();
    timer.innerHTML = `Time:   ${((currentTime - startTime) / 1000).toFixed(0)}  Seconds`;
  }, 1000);
};

const clockStop = () => {
  clearInterval(clockSet);
};

//reset game
const resetGame = () => {
  const starBoard = document.querySelectorAll('.stars li');
  for (star of starBoard) {
    if (star.style.color !== '#ffff00') {
      star.style.color = '#ffff00';
    }
  }
  snd.play();
  clockStop();
  startTime = "";
  matchCount = "";
  turns = 0;
  currentTime = "";
  timedisplayed = "";
  selectedCards = [];
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = turns;
  list.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
    const timer = document.querySelector('.clock');
    timer.innerHTML = `Time:  Pick a card`;
  });
  shuffleCards();
};
const replayButton = document.querySelector('.restart');
replayButton.addEventListener('click', resetGame);


const toggleStats = () => {
  const statsBackground = document.querySelector('.stats-background');
  statsBackground.classList.toggle('hide');
};

const startGame = () => {
  resetGame();
  toggleStats();
};

startGame(); //comment out for tile test intro

const deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const chosen = event.target;
  if (chosen.className == 'card') {
    flipCard(chosen);
    addCard(chosen);
    recordStartTime();
    if (timedisplayed !== 1) {
      displayTimer();
    }
  }
});

//show card
const flipCard = chosen => {
  if (selectedCards.length < 2) {
    chosen.classList.toggle('open'); //classList and toggle- https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    chosen.classList.toggle('show');
    snd.play();
  }
};



// add cards to list
const addCard = chosen => {
  if (selectedCards.length < 2) {
    selectedCards.push(chosen);
    if (selectedCards.length === 2) {
      counter();
      isItMatched();
    }
  }
};

//matched, lock open
const isItMatched = () => {
  const isCardClassNameEqual = (firstCard, secondCard) => firstCard.firstElementChild.className === secondCard.firstElementChild.className;
  if (isCardClassNameEqual(selectedCards[0], selectedCards[1])) {
    // selectedCards.classList.toggle('match');
    selectedCards[0].classList.toggle('match');
    selectedCards[1].classList.toggle('match');
    // alert('DING DING! You got a match! OMG!!!');
    matchCount++;
    nextPick();
    if (matchCount === 8) {
      gameOver();
    }
  } else {
    unmatched();
  }
};

//unmatched, remove from list, hide
const unmatched = () => {
  setTimeout(() => {
    selectedCards.forEach(function(chosen) {
      chosen.classList.remove('open', 'show');
    });
    darkStar();
    nextPick();
  }, 1000);
};

//clears array to continue to next two picks
const nextPick = () => {
  selectedCards.length = 0;
};

//all cards matched, disply final score
const gameOver = () => {
  recordStopTime();
  calculateTimePlayed();
  launchPlayerStats();
  clockStop();
};

//move counter

const counter = () => {
  turns++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = turns;
};

//starSystem() will use number of turns rather than failed turns to deduct stars
//use on 3 star game
// function starSystem() {
//   if (turns === 12 || turns === 16){
//    darkStar();
// };

//stars drop if turn is failed when called on unmatched function
//use on 10 star game
const darkStar = () => {
  const starBoard = document.querySelectorAll('.stars li');
  for (star of starBoard) {
    if (star.style.color !== 'gray') {
      star.style.color = 'gray';
      break;
    }
  }
};

const countStars = () => {
  const starStat = document.querySelectorAll('.stars li');
  starsRemain = 0;
  for (star of starStat) {
    if (star.style.color !== 'gray') {
      starsRemain++;
    }
  }
  return starsRemain;
};

//get time
const recordStartTime = () => {
  if (!startTime) { //prevents startTime reassignment after every clicked card
    startTime = Date.now();
  }
};

let stopTime = 0;

const recordStopTime = () => {
  stopTime = Date.now();
};

const calculateTimePlayed = () => {
  const timePlayed = ((stopTime - startTime) / 1000); //converts to seconds
  return timePlayed;
};

const launchPlayerStats = () => {
  const timeStat = document.querySelector('.timer');
  const time = calculateTimePlayed();
  const movesStat = document.querySelector('.attempt-number');
  const starStat = document.querySelector('.stars-remaining');
  const stars = countStars();

  timeStat.innerHTML = `Time to Complete:   ${time}  Seconds`;
  movesStat.innerHTML = `Attempts Needed:   ${turns}`;
  starStat.innerHTML = `Stars Remaining:   ${stars}  Stars`

  setTimeout(() => {
    toggleStats();
  }, 1500);
};

//make stats buttons work
document.querySelector('.stats-quit-btn').addEventListener('click', () => {
  toggleStats();
});

document.querySelector('.stats-play-btn').addEventListener('click', () => {
  startGame();
});