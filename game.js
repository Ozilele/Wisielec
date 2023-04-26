// Variables
const canvas = document.getElementById('canvas');
const wordToGuessText = document.querySelector(".wordToBeGuessed");
const lettersBox = document.querySelector(".letters");
const alertPopup = document.querySelector(".alert-box");
const overlay = document.querySelector(".overlay");
const resetBtn = document.querySelector('.reset-game-btn');
const newGameBtn = document.querySelector('.new-game-btn');
const winCountSpan = document.querySelector('.win-count');
const loseCountSpan = document.querySelector('.lost-count');
const context = canvas.getContext("2d");

let wordToGuess;
let currWord = "";
let currTry = 0;
let gamesWon = 0;
let gamesLost = 0;
let maxTries = 11;

overlay.addEventListener('click', () => {
  overlay.classList.add("hidden");
  alertPopup.classList.add("hidden");
});

alertPopup.querySelector('.close-btn').addEventListener('click', () => {
  overlay.classList.add("hidden");
  alertPopup.classList.add("hidden");
});

const fetchData = async () => {
  const response = await fetch("https://random-word-api.vercel.app/api?words=10");
  const data = await response.json();
  return data;
}

const generateUnderscores = () => {
  for(let i = 0; i < wordToGuess.length; i++) {
    currWord += "_";
  }
  wordToGuessText.innerHTML = currWord;
  return currWord;
}

const generateRandomWord = async () => {
	const randomWords = await fetchData();
	wordToGuess = randomWords[Math.floor(Math.random() * randomWords.length)];
  console.log(wordToGuess);
}

const generateButtons = () => {
  const lettersHTML = "abcdefghijklmnopqrstuvwxyz".split("").map(letter => 
    `
      <button 
        class="letter-btn"
        id='` + letter + `'
        onClick="handleGuess('` + letter + `')"
      >
        ` + letter + `
      </button>
  `).join('');
  lettersBox.innerHTML = lettersHTML;
}

// const handleTouch = () => {

// }


const handleGuess = (letter) => {
  const btn = document.getElementById(letter);
  btn.style.backgroundColor = "#6DA9E4";
  btn.removeAttribute("onClick");
  updateGame(letter);
  btn.removeEventListener('touchend', touchEventFunc);
}

const touchEventFunc = function(id) {
  handleGuess(id);
}

const attachTouchListeners = () => {
  document.querySelectorAll(".letter-btn").forEach((btn) => {
    btn.addEventListener('touchend', () => touchEventFunc(btn.id));
    // btn.removeEventListener('touchend', func);
  });
}

const runGame = async () => {
  currTry = 0;
  currWord = "";
  winCountSpan.innerHTML = localStorage.getItem("gamesWon") != null ? localStorage.getItem("gamesWon") : gamesWon;
  loseCountSpan.innerHTML = localStorage.getItem("gamesLost") != null ? localStorage.getItem("gamesLost") : gamesLost;
  await generateRandomWord();
  currWord = generateUnderscores()
  generateButtons();
  attachTouchListeners();
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 3;
  context.strokeStyle = 'black';
  context.font = '20px Arial';
}

const drawHangman = () => {
  switch(currTry) {
    case 0: {
      context.beginPath();
      context.moveTo(10, canvas.height - 10);
      context.lineTo(200, canvas.height - 10);
      context.stroke();
      break;
    }
    case 1: {
      context.beginPath();
      context.moveTo(60, canvas.height - 10);
      context.lineTo(60, 10);
      context.stroke();
      break;
    }
    case 2: {
      context.beginPath();
      context.moveTo(60, 10);
      context.lineTo(220, 10);
      context.stroke();
      break;
    }
    case 3: {
      context.beginPath();
      context.moveTo(220, 10);
      context.lineTo(220, 60);
      context.stroke();
      break;
    }
    case 4: {
      context.beginPath();
      context.moveTo(60, 30);
      context.lineTo(90, 10);
      context.stroke();
      break;
    }
    case 5: {
      context.beginPath();
      context.arc(220, 60 + canvas.width / 10, canvas.width / 10, 0, Math.PI * 2, false);
      context.stroke();
      break;
    }
    case 6: {
      context.beginPath();
      context.moveTo(220, 60 + ((2*canvas.width) / 10));
      context.lineTo(220, 225);
      context.stroke();
      break;
    }
    case 7: {
      context.beginPath();
      context.moveTo(220, 150);
      context.lineTo(190, 190);
      context.stroke();
      break;
    }
    case 8: {
      context.beginPath();
      context.moveTo(220, 150);
      context.lineTo(250, 190);
      context.stroke();
      break;
    }
    case 9: {
      context.beginPath();
      context.moveTo(220, 225);
      context.lineTo(190, 265);
      context.stroke();
      break;
    }
    case 10: {
      context.beginPath();
      context.moveTo(220, 225);
      context.lineTo(250, 265);
      context.stroke();
      break;
    }
  }
  currTry++;
}

const checkGameState = () => {
  if(currTry == maxTries) {
    gamesLost++;
    val = localStorage.getItem("gamesLost") != null ? parseInt(localStorage.getItem("gamesLost")) + 1 : gamesLost;
    localStorage.setItem("gamesLost", val);
    alertPopup.classList.remove("hidden");
    overlay.classList.remove("hidden");
    alertPopup.querySelector('h2').innerHTML = "You lost the game 😟"
    alertPopup.querySelector(".info-score").querySelector('.lost-counter').innerHTML = `Games lost: ${val}`;
    runGame(); // start a new game
  }
  if(currWord === wordToGuess) {
    gamesWon++;
    newVal = localStorage.getItem("gamesWon") != null ? parseInt(localStorage.getItem("gamesWon")) + 1 : gamesWon;
    localStorage.setItem("gamesWon", newVal);
    alertPopup.classList.remove("hidden");
    overlay.classList.remove("hidden");
    alertPopup.querySelector('h2').innerHTML = "You won the game 😃"
    alertPopup.querySelector(".info-score").querySelector('.won-counter').innerHTML = `Games won: ${newVal}`;
    runGame(); // start a new game
  }
}

const updateGame = (letter) => {
  console.log(currWord);
  if(wordToGuess.includes(letter)) {
    let index = 0;
    let indexesOfLetter = [];
    while(index < wordToGuess.length) {
      if(wordToGuess[index] === letter) {
        indexesOfLetter.push(index);
      }
      index++;
    }
    console.log(indexesOfLetter);
    for(let ind of indexesOfLetter) {
      currWord = currWord.substring(0, ind) + letter + currWord.substring(ind + 1); 
    }
    wordToGuessText.innerHTML = currWord;
  } else {
    drawHangman();
  }
  checkGameState();
}

resetBtn.addEventListener('click', () => {
  gamesLost = 0;
  gamesWon = 0;
  runGame();
});

newGameBtn.addEventListener('click', () => {
  runGame();
});

runGame();


