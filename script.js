const TARGET_BOX = document.querySelector("#target-box")
const GAME_STATUS_BTN = document.querySelector("#game-status-btn")
const GUESS_DISPLAY = document.querySelector("#guess-display")
const END_MSG_DISPLAY = document.querySelector("#end-msg-display")
const GUESS_HISTORY = document.querySelector("#guess-history")

const GAME_CONTROLS = document.querySelector("#game-controls")
const CORRECT_BTN = document.querySelector("#correct-btn")
const TOO_LOW_BTN = document.querySelector("#too-low-btn")
const TOO_HIGH_BTN = document.querySelector("#too-high-btn")
const CONTROL_BTNS = document.querySelectorAll(".control-btn")

let min
let max
let guess
let guessCount

function startGame () {
  TARGET_BOX.disabled = true
  GAME_STATUS_BTN.innerText = "Reset"

  guessCount = 1
  min = 1
  max = 100
  guess = Math.floor((min + max) / 2)
  GUESS_DISPLAY.innerText = guess
  addGuessRecord()

  GAME_CONTROLS.style.display = "block";
  for (const btn of CONTROL_BTNS) {
    btn.disabled = false
  }
}

function endGame () {
  END_MSG_DISPLAY.innerText = `I guessed your number in ${guessCount} guesses.`
  clearGuessHistory()
  for (const btn of CONTROL_BTNS) {
    btn.disabled = true
  }
  document.body.classList.add('js-end-game-pulse')
}

function resetGame () {
  TARGET_BOX.disabled = false
  GAME_STATUS_BTN.innerText = "Start!"
  GUESS_DISPLAY.innerText = ""
  END_MSG_DISPLAY.innerText = ""

  GAME_CONTROLS.style.display = "none";

  clearGuessHistory()
}

function clearGuessHistory () {
  while (GUESS_HISTORY.firstElementChild) {
    GUESS_HISTORY.firstElementChild.remove()
  }
}

function adjustGuess (triggeringEvent) {
  if (triggeringEvent.target === TOO_LOW_BTN) {
    min = guess
    guess = Math.ceil((min + max) / 2)
  } else {
    max = guess
    guess = Math.floor((min + max) / 2)
  }
  GUESS_DISPLAY.innerText = guess
  guessCount += 1
  addGuessRecord()
}

function toggleGameStatus () {
  if (TARGET_BOX.disabled) {
    resetGame()
  } else {
    startGame()
  }
}

function revertGameState (event) {
  if (event.target.parentNode !== GUESS_HISTORY) {
    return
  }
  const guessRecord = event.target
  const guessCountEndIndex = guessRecord.innerText.indexOf("min")
  guessCount = parseInt(guessRecord.dataset.guessCount)
  min = parseInt(guessRecord.dataset.min)
  guess = parseInt(guessRecord.dataset.guess)
  max = parseInt(guessRecord.dataset.max)

  GUESS_DISPLAY.innerText = guess

  const deletionIndex = Array.from(GUESS_HISTORY.children)
                             .indexOf(guessRecord) + 1
  while (GUESS_HISTORY.children[deletionIndex]) {
    GUESS_HISTORY.children[deletionIndex].remove()
  }
}

function addGuessRecord () {
  const newGuessRecord = document.createElement('pre')
  newGuessRecord.innerText = [guessCount,
                              `min: ${min}`,
                              `guess: ${guess}`,
                              `max: ${max}`].join("    ")
  newGuessRecord.dataset.guessCount = guessCount
  newGuessRecord.dataset.min = min
  newGuessRecord.dataset.guess = guess
  newGuessRecord.dataset.max = max
  GUESS_HISTORY.appendChild(newGuessRecord)
}



GUESS_HISTORY.addEventListener('click', revertGameState)
GAME_STATUS_BTN.addEventListener('click', toggleGameStatus)
CORRECT_BTN.addEventListener('click', endGame)
TOO_HIGH_BTN.addEventListener('click', adjustGuess)
TOO_LOW_BTN.addEventListener('click', adjustGuess)
document.body.addEventListener(
  'animationend',
  () => document.body.classList.remove('js-end-game-pulse')
)
