// I disclose that I have used chatGpt because i don't have like a lot knowledge about the clasees in
// javascript and i have used the chatGpt to understand the classes and how to use them in javascript
// Button class basically holds all the functionality of the single button and its properties.
class Button {
    constructor(number, container) {
        this.number = number;
        this.container = container;
        this.element = document.createElement("button");
        this.element.className = "memoryButton";
        this.element.style.width = "10em"
        this.element.style.height = "5em"
        this.element.textContent = this.number;
        
        this.setRandomColor();
        this.container.appendChild(this.element);
    }

    // function for setting the random color for the button 
    setRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        this.element.style.backgroundColor = `#${randomColor}`;
    }

    // function for setting the random position for the button
    setRandomPosition() {
        this.element.style.position = 'absolute';
        const maxX = window.innerWidth - this.element.clientWidth;
        console.log(window.innerWidth);
        const maxY = window.innerHeight - this.element.clientHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;

    }

    // function to hide the number inside the button
    hideNumber() {
        this.element.textContent = '';

    }

    // function to view the number inside the button
    viewNumber() {
        this.element.textContent = this.number;
    }
}


// This class handles all the game logic
class MemoryGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.buttons = [];  // this is the array for storing all the buttons according to user decided numebr
        this.originalOrder = []; // array for storing original order of the buttons
        this.expectedOrder = []; // array to tempory store original order to check correctness
    }


    // functin to create the button and pushing it inside the arrays
    createButtons(buttonCount) {
        for (let i = 0; i < buttonCount; i++) {
            const button = new Button(i + 1, this.container);
            this.buttons.push(button);
            this.originalOrder.push(button);

        }
        this.expectedOrder = [...this.originalOrder]; // using the spread operator to copy the whole array into a new array
    }

    // function to clear the window to restart the game 
    clearButtons() {
        this.container.innerHTML = '';
        this.buttons = [];
        this.originalOrder = [];
        this.expectedOrder = [];

    }

    // function to shuffle the buttons number of time as the number of buttons
    randomizeButtons(buttonCount) {
        let scrambleNumber = 0; // number of time we want to shuffle the buttons
        // setInterval for performing the function after certain interval
        const scrambleInterval = setInterval(() => {
            this.buttons.forEach(button => button.setRandomPosition());
            scrambleNumber++;
            if (scrambleNumber >= buttonCount) {
                clearInterval(scrambleInterval);
                setTimeout(() => this.hideButtonNumbers(), 1000);
            }
        }, 2000);
    }

    // function for hiding the numbers from the buttons after all shuffling and then making the buttons clickable
    hideButtonNumbers() {
        this.buttons.forEach(button => button.hideNumber());
        this.makeButtonsClickable();

    }

    // checking the order once the button is clicked
    makeButtonsClickable() {
        this.buttons.forEach(button => {
            button.element.onclick = () => this.checkButtonOrder(button);
        })
    }

    checkButtonOrder(button) {
        const correctButton = this.expectedOrder.shift();
        if (button === correctButton) {
            button.viewNumber();
            if (this.expectedOrder.length === 0) {
                alert(messages.excellentMemory);
            }
        }
        else {
            alert(messages.wrongOrder);
            this.revealCorrectOrder();
        }
    }

    // function to reveal the correct order if user can not guess the order
    revealCorrectOrder() {
        this.originalOrder.forEach(button => button.viewNumber());
        this.buttons.forEach(button => button.element.onclick = null);
        
    }
}


// class the manage the game that is doing user input validation and starting the game by calling methods in the memory game class
class GameManager {
    constructor() {
        this.memoryGame = new MemoryGame('buttonContainer');
    }

    startGame() {
        const buttonCount = parseInt(document.getElementById('buttonCount').value);
        if (isNaN(buttonCount) || buttonCount < 3 || buttonCount > 7) {
            alert(messages.invalidNumber);
            return;
        }
        this.memoryGame.clearButtons();
        this.memoryGame.createButtons(buttonCount);
        setTimeout(() => {
            this.memoryGame.randomizeButtons(buttonCount);
        }, buttonCount * 1000);

    }

}

// initializing the game after listing button clicked
document.getElementById('startButton').addEventListener('click', () => {
    const gameManager = new GameManager();
    gameManager.startGame();
})