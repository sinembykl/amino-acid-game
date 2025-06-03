// JavaScript code for game logic with dynamic player input
const aminoAcids = [
  { name: "Alanine", clue: "", image: "images/alanine.png.jpg" },
  { name: "Arginine", clue: "", image: "images/arginine.png.jpg" },
  { name: "Asparagine", clue: "", image: "images/asparagine.png.jpg" },
  { name: "Aspartic Acid", clue: "", image: "images/asparticacid.png.jpg" },
  { name: "Cysteine", clue: "", image: "images/cysteine.png.jpg" },
  { name: "Glutamic Acid", clue: "", image: "images/glutamicacid.png.jpg" },
  { name: "Glutamine", clue: "", image: "images/glutamine.png.jpg" },
  { name: "Glycine", clue: "", image: "images/glycine.png.jpg" },
  { name: "Histidine", clue: "", image: "images/histidine.png.jpg" },
  { name: "Isoleucine", clue: "", image: "images/isoleucine.png.jpg" },
  { name: "Leucine", clue: "", image: "images/leucine.png.jpg" },
  { name: "Lysine", clue: "", image: "images/lysine.png.jpg" },
  { name: "Methionine", clue: "", image: "images/methionine.png.jpg" },
  { name: "Phenylalanine", clue: "", image: "images/phenylalanine.png.jpg" },
  { name: "Proline", clue: "", image: "images/proline.png.jpg" },
  { name: "Serine", clue: "", image: "images/serine.png.jpg" },
  { name: "Threonine", clue: "", image: "images/threonine.png.jpg" },
  { name: "Tryptophan", clue: "", image: "images/tryptophan.png.jpg" },
  { name: "Tyrosine", clue: "", image: "images/tyrosine.png.jpg" },
  { name: "Valine", clue: "", image: "images/valine.png.jpg" }
];

let players = [];
let currentPlayerIndex = 0;
let score = 0;
let passesLeft = 3;
let timerInterval;
let timeLeft = 300;
let answeredCards = 0;
let usedIndexes = new Set();

const img = document.getElementById("amino-img");
const clueText = document.getElementById("clue");
const scoreText = document.getElementById("score");
const playerDisplay = document.getElementById("player-name");

function setupPlayers(namesArray) {
  players = namesArray.map(name => ({ name, score: 0 }));
  currentPlayerIndex = 0;
  startGame();
}

function startGame() {
  document.getElementById("game-area").style.display = "block";
  resetPlayerState();
  enableButtons();
  startTimer();
  nextQuestion();
}

function resetPlayerState() {
  score = 0;
  passesLeft = 3;
  answeredCards = 0;
  usedIndexes.clear();
  timeLeft = 300;
  scoreText.textContent = score;
  document.getElementById("passes").textContent = `Passes left: ${passesLeft}`;
  playerDisplay.textContent = `Now playing: ${players[currentPlayerIndex].name}`;
}

document.getElementById("true-btn").onclick = () => {
  score++;
  scoreText.textContent = score;
  nextQuestion();
};

document.getElementById("false-btn").onclick = () => {
  score--;
  scoreText.textContent = score;
  nextQuestion();
};

document.getElementById("pass-btn").onclick = () => {
  if (passesLeft > 0) {
    passesLeft--;
    document.getElementById("passes").textContent = `Passes left: ${passesLeft}`;
    nextQuestion();
  } else {
    document.getElementById("pass-btn").disabled = true;
    alert("No passes left!");
  }
};

function nextQuestion() {
  if (answeredCards === aminoAcids.length) {
    endGame("All questions answered!");
    return;
  }

  let index;
  do {
    index = Math.floor(Math.random() * aminoAcids.length);
  } while (usedIndexes.has(index));

  usedIndexes.add(index);
  answeredCards++;
  const amino = aminoAcids[index];
  img.src = amino.image;
  img.style.display = "block";
  clueText.textContent = amino.clue;
}

function enableButtons() {
  document.getElementById("true-btn").disabled = false;
  document.getElementById("false-btn").disabled = false;
  document.getElementById("pass-btn").disabled = false;
}

function disableButtons() {
  document.getElementById("true-btn").disabled = true;
  document.getElementById("false-btn").disabled = true;
  document.getElementById("pass-btn").disabled = true;
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame("Time is up!");
    }
  }, 1000);
}

function endGame(reason) {
  clearInterval(timerInterval);
  disableButtons();

  alert(`${reason} ${players[currentPlayerIndex].name}'s final score is: ${score}`);
  players[currentPlayerIndex].score = score;

  currentPlayerIndex++;
  if (currentPlayerIndex < players.length) {
    setTimeout(startGame, 1000);
  } else {
    showResults();
  }
}

function showResults() {
  players.sort((a, b) => b.score - a.score);
  let result = "\ud83c\udfc6 Final Rankings:\n\n";
  players.forEach((p, i) => {
    result += `${i + 1}. ${p.name} — ${p.score} points\n`;
  });
  alert(result);
  document.getElementById("game-area").style.display = "none";
}

// Player setup UI logic
const playerCountInput = document.getElementById("player-count");
const setPlayersBtn = document.getElementById("set-players-btn");
const nicknamesContainer = document.getElementById("nicknames-inputs");
const startGameBtn = document.getElementById("start-game-btn");


setPlayersBtn.onclick = () => {
  const count = parseInt(playerCountInput.value);
  nicknamesContainer.innerHTML = "";
  if (count >= 1 && count <= 10) {
    for (let i = 0; i < count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Player ${i + 1} Name`;
      input.className = "player-name-input";
      nicknamesContainer.appendChild(input);
    }
    startGameBtn.style.display = "inline-block";
  } else {
    alert("Enter a number between 1 and 10");
  }
};

startGameBtn.onclick = () => {
  const nameInputs = document.querySelectorAll(".player-name-input");
  const names = Array.from(nameInputs).map(input => input.value.trim()).filter(name => name);

  if (names.length === nameInputs.length) {
    document.getElementById("player-setup").style.display = "none";
    setupPlayers(names);
  } else {
    alert("Please enter all player names.");
  }
};