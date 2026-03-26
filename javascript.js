// ====> Back End <====
const HUMAN_PLAYER = "human";
const COMPUTER_PLAYER = "computer";
const MAX_SCORE = 5;
let scorePlayerA = 0;
let scorePlayerB = 0;

const RPSOption = Object.freeze({
  Rock: "rock",
  Paper: "paper",
  Scissors: "scissors",
});

const bus = new EventTarget();

const EventsNames = {
  UpdateScore: "updateScore",
  Draw: "draw",
  PlayerAScores: "playerAScores",
  PlayerBScores: "playerBScores",
  GameOver: "gameOver",
};

function playRoundSinglePlayerAs(playerChoice) {
  runMatch(playerChoice, getComputerChoice());
  logScore();

  if (gameHasWinner()) {
    gameOver();
  }
}

function getComputerChoice() {
  const options = [RPSOption.Rock, RPSOption.Paper, RPSOption.Scissors];
  const randomIndex = Math.floor(Math.random() * options.length);
  const choice = options[randomIndex];
  return choice;
}

function runMatch(choiceA, choiceB) {
  choiceA = choiceA.toLowerCase();
  choiceB = choiceB.toLowerCase();

  let eventToDispatch = null;
  let matchResult = { detail: { winner: null, loser: null } };

  if (isADraw(choiceA, choiceB)) {
    eventToDispatch = EventsNames.Draw;
    matchResult.detail.winner = choiceA;
    matchResult.detail.loser = choiceA;
    console.log(`It's a draw! You both played \`${event.detail.choice}\``);
  } else if (doesABeatsB(choiceA, choiceB)) {
    scorePlayerA++;
    eventToDispatch = EventsNames.PlayerAScores;
    matchResult.detail.winner = choiceA;
    matchResult.detail.loser = choiceB;
    console.log(`You win! \`${choiceA}\` beats \`${choiceB}\``);
  } else {
    scorePlayerB++;
    eventToDispatch = EventsNames.PlayerBScores;
    matchResult.detail.winner = choiceB;
    matchResult.detail.loser = choiceA;
    console.log(`You lose! \`${choiceA}\` loses to \`${choiceB}\``);
  }
  bus.dispatchEvent(new CustomEvent(eventToDispatch, matchResult));

  function isADraw(choiceA, choiceB) {
    return choiceA === choiceB;
  }

  function doesABeatsB(choiceA, choiceB) {
    return (
      (choiceA === RPSOption.Rock && choiceB === RPSOption.Scissors) ||
      (choiceA === RPSOption.Scissors && choiceB === RPSOption.Paper) ||
      (choiceA === RPSOption.Paper && choiceB === RPSOption.Rock)
    );
  }
}

function logScore() {
  bus.dispatchEvent(new Event(EventsNames.UpdateScore));
  console.log(getScoreString());
}

function getScoreString() {
  return `Player: ${scorePlayerA} point${scorePlayerA !== 1 ? "s" : ""}
Computer: ${scorePlayerB} point${scorePlayerB !== 1 ? "s" : ""} `;
}

function gameHasWinner() {
  return scorePlayerA >= MAX_SCORE || scorePlayerB >= MAX_SCORE;
}

function gameOver() {
  console.log(`Game Over`);
  bus.dispatchEvent(
    new CustomEvent(EventsNames.GameOver, { detail: { winner: getWinner() } }),
  );
  logWinner();
}

function getWinner() {
  return scorePlayerA > scorePlayerB ? HUMAN_PLAYER : COMPUTER_PLAYER;
}

function logWinner() {
  if (scorePlayerA > scorePlayerB) {
    console.log("Congratulations! You won!");
  } else {
    console.log("You lost... I'm sorry :(");
  }
  console.log(`The score was:
${getScoreString()}`);
}

// ====> Front End <====
const rockButton = document.querySelector("#rock");
const paperButton = document.querySelector("#paper");
const scissorsButton = document.querySelector("#scissors");

setupButtonChoices();
setupScore();
setupMatchResult();
setupGameOver();

function setupButtonChoices() {
  rockButton.addEventListener("click", () =>
    playRoundSinglePlayerAs(RPSOption.Rock),
  );
  paperButton.addEventListener("click", () =>
    playRoundSinglePlayerAs(RPSOption.Paper),
  );
  scissorsButton.addEventListener("click", () =>
    playRoundSinglePlayerAs(RPSOption.Scissors),
  );
}

function setupScore() {
  bus.addEventListener(EventsNames.UpdateScore, (event) => {
    updateScore();
  });

  function updateScore() {
    const scoreDiv = document.querySelector("#score");
    const playerAScore = scoreDiv.querySelector("#player-a-score span");
    const playerBScore = scoreDiv.querySelector("#player-b-score span");
    playerAScore.textContent = scorePlayerA;
    playerBScore.textContent = scorePlayerB;
  }
}

function setupMatchResult() {
  const messageDiv = document.querySelector("#message");
  bus.addEventListener(
    EventsNames.Draw,
    (event) =>
      (messageDiv.textContent = `It's a draw! You both played \`${event.detail.winner}\``),
  );
  bus.addEventListener(
    EventsNames.PlayerAScores,
    (event) =>
      (messageDiv.textContent = `You win! \`${event.detail.winner}\` beats \`${event.detail.loser}\``),
  );
  bus.addEventListener(
    EventsNames.PlayerBScores,
    (event) =>
      (messageDiv.textContent = `You lose! \`${event.detail.loser}\` loses to \`${event.detail.winner}\``),
  );
}

function setupGameOver() {
  const gameOverDiv = document.querySelector("#game-over");
  gameOverDiv.style.display = "none";
  bus.addEventListener(EventsNames.GameOver, (event) => {
    disableButtonChoices();
    showGameOverScreen(event.detail.winner);
    console.log("SHOW GAME OVER SCREEN");
  });

  function disableButtonChoices() {
    document.querySelector("#rps-buttons").style.display = "none";
  }

  function showGameOverScreen(winner) {
    gameOverDiv.style.display = "inherit";
    updateWinnerMessage(winner);
  }

  function updateWinnerMessage(winner) {
    const gameWinnerMessage = document.querySelector("#game-over #game-winner");
    clearElement(gameWinnerMessage);
    gameWinnerMessage.append(...getWinnerMessageElements(winner));

    function getWinnerMessageElements(winner) {
      const messageElements = [];
      const messageTextArray = getWinnerMessageTextArray(winner);
      for (let i = 0; i < messageTextArray.length; i++) {
        pushAsTextElement(messageElements, messageTextArray[i]);
      }
      return messageElements;

      function getWinnerMessageTextArray(winner) {
        const messageList = [];
        if (winner === HUMAN_PLAYER) {
          messageList.push(`Congratulations! You won the game`);
        } else if (winner === COMPUTER_PLAYER) {
          messageList.push(`You lost to the computer`);
          messageList.push(`That's too bad... :(`);
        } else {
          messageList.push(`There was no winner!`);
          messageList.push(`HOW DID THAT EVEN HAPPEN?!`);
        }
        return messageList;
      }
    }
  }
}

function pushAsTextElement(elementsArray, text) {
  const e = document.createElement("p");
  e.textContent = text;
  elementsArray.push(e);
}

function clearElement(element) {
  element.textContent = "";
}
