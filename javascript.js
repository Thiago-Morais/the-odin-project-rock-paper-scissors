const MAX_SCORE = 3;
let humanScore = 0;
let computerScore = 0;

function playGame() {
  while (!gameHasWinner()) {
    const humanChoice = getHumanChoice();
    const computerChoice = getComputerChoice();
    playRound(humanChoice, computerChoice);
    logScore();
  }
  logWinner();
}

function gameHasWinner() {
  return humanScore >= MAX_SCORE || computerScore >= MAX_SCORE;
}

function getHumanChoice() {
  const message = `Type your option:
- "Rock"
- "Paper"
- "Scissors"`;
  const input = prompt(message, "Rock");
  return input;
}

function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = parseInt(Math.random() * options.length);
  const choice = options[randomIndex];
  return choice;
}

function playRound(humanChoice, computerChoice) {
  humanChoice = humanChoice.toLowerCase();
  computerChoice = computerChoice.toLowerCase();

  if (isADraw(humanChoice, computerChoice)) {
    console.log(`It's a draw! You both played \`${humanChoice}\``);
  } else if (doesABeatsB(humanChoice, computerChoice)) {
    humanScore++;
    console.log(`You win! \`${humanChoice}\` beats \`${computerChoice}\``);
  } else {
    computerScore++;
    console.log(`You lose! \`${humanChoice}\` loses to \`${computerChoice}\``);
  }

  function isADraw(humanChoice, computerChoice) {
    return humanChoice === computerChoice;
  }

  function doesABeatsB(humanChoice, computerChoice) {
    return (
      (humanChoice === "rock" && computerChoice === "scissors") ||
      (humanChoice === "scissors" && computerChoice === "paper") ||
      (humanChoice === "paper" && computerChoice === "rock")
    );
  }
}

function logScore() {
  console.log(getScoreString());
}

function getScoreString() {
  return `Player: ${humanScore} point${humanScore !== 1 ? "s" : ""}
Computer: ${computerScore} point${computerScore !== 1 ? "s" : ""} `;
}

function logWinner() {
  if (humanScore > computerScore) {
    console.log("Congratulations! You won!");
  } else {
    console.log("You lost... I'm sorry :(");
  }
  console.log(`The score was:
${getScoreString()}`);
}

// playGame();
