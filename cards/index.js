// DOM elements
const card = document.querySelectorAll('.cell');
const front = document.querySelectorAll('.front');
const container = document.querySelector('.container');
const score = document.querySelector('.score span');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');

// Game variables
const initialTimerDuration = 32;
let timerDuration = initialTimerDuration;
let timerInterval;
const totalCards = card.length;
let matchedCards = 0;

// Event listeners
startBtn.addEventListener('click', () => {
  restartGame();
});

// Game initialization and restart
function restartGame() {
  // Stop the timer by clearing the interval
  clearInterval(timerInterval);
  // Reset the score to 0
  score.innerHTML = '0';
  // Reset the timer duration to the initial value
  timerDuration = initialTimerDuration;
  // Update the best score
  updateTimerDisplay();
  
  // Remove the 'flip' and 'match' classes from all cards, to hide them
  resetCards();
  
  // Shuffle the cards' order to mix them up for the new round
  shuffleCards();
  
  // Enable card clicking and start the timer
  enableCardClicking();
  startTimer();
}

// Timer functions
function startTimer() {
  // Clear any existing interval to prevent multiple timers running simultaneously
  clearInterval(timerInterval);
  // Set a new interval that decrements the timerDuration every second
  timerInterval = setInterval(() => {
    timerDuration--;
    // Update the displayed timer value after each second
    updateTimerDisplay();
    
    // If the timer reaches 0, stop the timer and display the final score
    if (timerDuration <= 0) {
      timerDuration=0;
      clearInterval(timerInterval);
      displayFinalScore();
    }
  }, 1000);
}

function updateTimerDisplay() {
  // Update the displayed timer value along with the best score if available
  // The ${localStorage.getItem('bestScore')} retrieves the "bestScore" value from the localStorage.
  // The conditional operator ? checks if localStorage.getItem('bestScore') is true (meaning it has a value), and if it is, it will display the string 'Best Score: {bestScoreValue}'.
  // If localStorage.getItem('bestScore') is false (meaning it does not have a value), it will display an empty string ''.
  timerElement.textContent = `Time Left: ${timerDuration} seconds | ${localStorage.getItem('bestScore') ? `Best Score: ${localStorage.getItem('bestScore')}` : ''}`;
}

// Card handling functions


function resetCards() {
  // Remove the 'flip' and 'match' classes from all cards, effectively hiding them
  card.forEach((c) => {
    c.classList.remove('flip', 'match');
  });

  // Hide the front sides of the cards by removing the 'show' class from them
  front.forEach((f) => {
    f.classList.remove('show');
  });
}

function shuffleCards() {
  // Remove the 'flip' and 'match' classes from all cards, effectively hiding them
  card.forEach((c) => {
    c.classList.remove('flip', 'match');
  });

  // Generate an array of numbers from 0 to (totalCards - 1) and shuffle the order randomly
  card.forEach((c) => {
    const num = [...Array(card.length).keys()]; // Spread syntax allows you to deconstruct an array or object into separate variables.
    const random = Math.floor(Math.random() * card.length);
    c.style.order = num[random];
  });
}

function enableCardClicking() {
  for (let i = 0; i < card.length; i++) {
    // Show the front side of the card by adding the 'show' class
    front[i].classList.add('show');

    // Set a timeout to hide the front side of the card after 2 seconds
    setInterval(() => {
      front[i].classList.remove('show');
    }, 2000);

    // Add a 'click' event listener to each card
    card[i].addEventListener('click', () => {
      // Flip the clicked card by adding a new class called 'flip'
      front[i].classList.add('flip');
      // Select all cards that are flipped
      const flippedCard = document.querySelectorAll('.flip');

      // If two cards are flipped, temporarily disable card clicking and check for a match
      if (flippedCard.length === 2) {
        container.style.pointerEvents = 'none';

        // Re-enable card clicking after 1 second
        setTimeout(() => {
          container.style.pointerEvents = 'all';
        }, 1000);

        // Check if the two flipped cards are a match
        match(flippedCard[0], flippedCard[1]);
      }
    });
  }
}

// Card matching function
function match(cardOne, cardTwo) {
  // If the two cards have the same data-index attribute, they are a match
  if (cardOne.dataset.index == cardTwo.dataset.index) {
    // Increase the score by 1
    score.innerHTML = parseInt(score.innerHTML) + 1;

    // Remove the 'flip' class from both cards
    cardOne.classList.remove('flip');
    cardTwo.classList.remove('flip');

    // Add the 'match' class to both cards to keep them flipped
    cardOne.classList.add('match');
    cardTwo.classList.add('match');

    // Update the count of matched cards
    matchedCards += 2;

    // If all cards are matched, stop the timer and display a congratulatory message
    if (matchedCards === totalCards) {
      clearInterval(timerInterval);
      displayCongrats();
    }
  } else {
    // If the two cards do not match, flip them back after 1 second
    setTimeout(() => {
      cardOne.classList.remove('flip');
      cardTwo.classList.remove('flip');
    }, 1000);
  }
}

// Game Over functions
function displayCongrats() {
  // Display a congratulatory message when the game is won
  alert(`Congratulations! You have matched all the cards. You won :)`);
  // Reload the page to start a new round
  location.reload();
}

function displayFinalScore() {
  const currentScore = parseInt(score.innerHTML);
  const bestScore = localStorage.getItem('bestScore');

  if (!bestScore || currentScore > parseInt(bestScore)) {
    // Update the best score in local storage
    localStorage.setItem('bestScore', currentScore);
    // Update the displayed best score
    updateBestScoreDisplay(currentScore);
    
  }

  // Display the final score when the timer runs out
  alert(`Game Over! Your final score is: ${currentScore}`);
  // Reload the page to start a new round
  location.reload();
}

function updateBestScoreDisplay(bestScore) {
  
  bestScoreElement.textContent = `Best Score: ${bestScore}`;
}
