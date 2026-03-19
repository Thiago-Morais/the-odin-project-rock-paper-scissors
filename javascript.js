let humanScore = 0;
let computerScore = 0;

function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = parseInt(Math.random() * options.length);
  const choice = options[randomIndex];
  return choice;
}

// getComputerChoice();

function getHumanChoice() {
  const message = `Type your option:
- "Rock"
- "Paper"
- "Scissors"`;
  const input = prompt(message, "Rock");
  return input;
}

// getHumanChoice();

function playRound(humanChoice, computerChoice) {
  humanChoice = humanChoice.toLowerCase();
  computerChoice = computerChoice.toLowerCase();

  // check for draw
  // create a function to check a winner when they are different
  // log message deppending on player's result

  if (isADraw(humanChoice, computerChoice)) {
    console.log(`It's a draw! You both played \`${humanChoice}\``);
  } else if (doesABeatsB(humanChoice, computerChoice)) {
    console.log(`You win! \`${humanChoice}\` beats \`${computerChoice}\``);
  } else {
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

// playRound("rock", "paper");
const playerChoice = getComputerChoice();
console.log(`playerChoice = ${playerChoice}`);
const computerChoice = getComputerChoice();
console.log(`computerChoice = ${computerChoice}`);
playRound(playerChoice, computerChoice);
