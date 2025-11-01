// Wait for the DOM to finish loading before running the game
// Get the button elements and add event listeners to them

document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type") === "submit") {
                checkAnswer();
            } else {
                let gameType = this.getAttribute("data-type");
                runGame(gameType);
            }
        });
    }

    // Allow pressing Enter to submit an answer
    document.getElementById("answer-box").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            checkAnswer();
        }
    });

    runGame("addition");
});

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame(gameType) {

    document.getElementById("answer-box").value = "";
    document.getElementById("answer-box").focus();
    document.getElementById("feedback").textContent = ""; // Clear any existing feedback

    // Creates two random numbers between 1 and 25
    let num1 = Math.floor(Math.random() * 25) + 1;
    let num2 = Math.floor(Math.random() * 25) + 1;

    if (gameType === "addition") {
        displayAdditionQuestion(num1, num2);
    } else if (gameType === "subtract") {
        displaySubtractQuestion(num1, num2);
    } else if (gameType === "multiply") {
        displayMultiplyQuestion(num1, num2);
    } else if (gameType === "division") {
        displayDivisionQuestion(num1, num2);
    } else {
        alert(`Unknown game type: ${gameType}`);
        throw `Unknown game type: ${gameType}. Aborting!`;
    }
}

/**
 * Checks the answer against the correct result
 */
function checkAnswer() {
    const answerBox = document.getElementById("answer-box");
    const submitButton = document.querySelector('[data-type="submit"]');
    const feedback = document.getElementById("feedback");
    const gameArea = document.querySelector(".game-area");

    // Prevent spamming the button
    submitButton.disabled = true;

    let userAnswer = parseInt(answerBox.value);
    let calculatedAnswer = calculateCorrectAnswer();
    let isCorrect = userAnswer === calculatedAnswer[0];

    if (isCorrect) {
        feedback.textContent = "✅ Correct! Nice job!";
        feedback.className = "feedback correct";
        incrementScore();
    } else {
        feedback.textContent = `❌ Oops! The correct answer was ${calculatedAnswer[0]}.`;
        feedback.className = "feedback wrong";
        incrementWrongAnswer();
    }

    // 🔆 Add the flash animation
    gameArea.classList.remove("correct-flash", "wrong-flash");
    void gameArea.offsetWidth; // restart animation trick
    gameArea.classList.add(isCorrect ? "correct-flash" : "wrong-flash");

    // Figure out the current operator so we stay on the same type
    let currentOperator = document.getElementById("operator").textContent;
    let gameType;
    switch (currentOperator) {
        case "+": gameType = "addition"; break;
        case "-": gameType = "subtract"; break;
        case "×": gameType = "multiply"; break;
        case "÷": gameType = "division"; break;
    }

    // Wait 1.5 s, then show the next question and re-enable submit
    setTimeout(() => {
        feedback.textContent = "";
        runGame(gameType);
        answerBox.value = "";
        answerBox.focus();
        submitButton.disabled = false;
    }, 1500);
}



/**
 * Gets the operands (the numbers) and the operator (plus, minus etc)
 * directly from the DOM, and returns the correct answer.
 */
function calculateCorrectAnswer() {
    let operand1 = parseInt(document.getElementById('operand1').innerText);
    let operand2 = parseInt(document.getElementById('operand2').innerText);
    let operator = document.getElementById("operator").innerText;

    if (operator === "+") {
        return [operand1 + operand2, "addition"];
    } else if (operator === "-") {
        return [operand1 - operand2, "subtract"];
    } else if (operator === "×") {
        return [operand1 * operand2, "multiply"];
    } else if (operator === "÷") {
        return [Math.floor(operand1 / operand2), "division"];
    } else {
        alert(`Unimplemented operator ${operator}`);
        throw `Unimplemented operator ${operator}. Aborting!`;
    }
}

/**
 * Gets current score from the DOM and increments it by 1
 */
function incrementScore() {
    let oldScore = parseInt(document.getElementById("score").innerText);
    document.getElementById("score").innerText = ++oldScore;
}

/**
 * Gets tally of incorrect answers and adds 1 to it.
 */
function incrementWrongAnswer() {
    let oldScore = parseInt(document.getElementById("incorrect").innerText);
    document.getElementById("incorrect").innerText = ++oldScore;
}

/**
 * Display functions for each operator
 */
function displayAdditionQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = "+";
}

function displaySubtractQuestion(operand1, operand2) {
    // Ensure no negative answers
    if (operand1 < operand2) [operand1, operand2] = [operand2, operand1];
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = "-";
}

function displayMultiplyQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = "×";
}

function displayDivisionQuestion(operand1, operand2) {
    // Make sure division gives a whole number
    operand1 = operand1 * operand2;
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = "÷";
}