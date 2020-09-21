//Black jack ===================================================================================================

let blackjackGame = {
  you: { scoreSpan: '#your-blackjack-score', div: '#your-box', score: 0 },
  dealer: {
    scoreSpan: '#dealer-blackjack-score',
    div: '#dealer-box',
    score: 0,
  },
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
  cardsScore: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  ties: 0,
  standMode: false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const winnerSound = new Audio('static/sounds/cash.mp3');
const loserSound = new Audio('static/sounds/aww.mp3');

document
  .querySelector('#blackjack-hit-button')
  .addEventListener('click', blackJackHit);

document
  .querySelector('#blackjack-deal-button')
  .addEventListener('click', blackJackDeal);

document
  .querySelector('#blackjack-stand-button')
  .addEventListener('click', dealerLogic);

function blackJackHit() {
  let card = randomCard();
  showCard(YOU, card);
  cardCount(YOU, card);
  showScore(YOU);
}
function blackJackDeal() {
  deal();
}

showCard = (activePlayer, card) => {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
};

function cardCount(activePlayer, card) {
  let cardScore = blackjackGame['cardsScore'][card];
  if (card === 'A') {
    if (activePlayer['score'] <= 10) {
      cardScore = 11;
    } else {
      cardScore = 1;
    }
  }
  let count = (activePlayer['score'] += cardScore);
  document.querySelector(activePlayer['scoreSpan']).innerHTML = count;
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }
}

function deal() {
  let yourImages = document.querySelector('#your-box').querySelectorAll('img');
  let dealerImage = document
    .querySelector('#dealer-box')
    .querySelectorAll('img');
  for (let i = 0; i < yourImages.length; i++) {
    yourImages[i].remove();
  }

  for (let i = 0; i < dealerImage.length; i++) {
    dealerImage[i].remove();
  }
  YOU['score'] = 0;
  DEALER['score'] = 0;
  document.querySelector(YOU['scoreSpan']).innerHTML = 0;
  document.querySelector(DEALER['scoreSpan']).innerHTML = 0;
  document.querySelector(YOU['scoreSpan']).style.color = ' white';
  document.querySelector(DEALER['scoreSpan']).style.color = ' white';
  document.querySelector('#blackjack-result').textContent = 'Lets Play!';
  document.querySelector('#blackjack-result').style.color = 'black';

  document.querySelector('#blackjack-hit-button').disabled = false;
}

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomNumber];
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function dealerLogic() {
  document.querySelector('#blackjack-hit-button').disabled = true;
  document.querySelector('#blackjack-deal-button').disabled = true;
  blackjackGame['standMode'] = true;
  while (DEALER['score'] < 16 && blackjackGame['standMode'] === true) {
    let card = randomCard();
    showCard(DEALER, card);
    cardCount(DEALER, card);
    showScore(DEALER);
    await sleep(1000);
  }
  let winner = computeWinner();
  showResult(winner);
  document.querySelector('#blackjack-deal-button').disabled = false;
}

function gameEnds() {
  clearInterval(dealerLogic);
}

function computeWinner() {
  let winner;
  let dealerScore = DEALER['score'];
  let youScore = YOU['score'];
  if (youScore <= 21) {
    if (youScore > dealerScore || dealerScore > 21) {
      blackjackGame['wins'] += 1;
      winner = YOU;
    } else if (youScore < dealerScore) {
      blackjackGame['losses'] += 1;
      winner = DEALER;
    } else if (youScore === dealerScore) {
      winner = 'Tie';
      blackjackGame['ties'] += 1;
    }
  } else if (youScore > 21 && dealerScore <= 21) {
    winner = DEALER;
    blackjackGame['losses'] += 1;
  } else if (youScore && dealerScore > 21) {
  }

  console.log('THe winner is', winner);

  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (winner === YOU) {
    document.querySelector('#wins').textContent = blackjackGame['wins'];
    message = 'You Win! ';
    messageColor = 'green';
    winnerSound.play();
  } else if (winner === DEALER) {
    document.querySelector('#losses').textContent = blackjackGame['losses'];
    message = 'You Loose!';
    messageColor = 'red';
    loserSound.play();
  } else if ('Tie') {
    document.querySelector('#ties').textContent = blackjackGame['ties'];
    message = 'You Tie!';
    messageColor = 'yellow';
  }
  document.querySelector('#blackjack-result').textContent = message;
  document.querySelector('#blackjack-result').style.color = messageColor;
}
