const gameBtn = document.querySelector("#startBtn");
const timerTime = document.querySelector("#time");
const imageContainer = document.querySelector("#imageContainer");
const moves = document.querySelector("#moves");
const resultMessage = document.querySelector(".result-message");

let timeTaken = 0;
let openCardClicks = 0;
let firstCardClick;
let secondCardClick;
let score = 0;
let movesCounter = 0;
let isGameStart = false;


let myInterval;
const images = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];


function startGame() {
  if (gameBtn.innerText == "Stop Game") {
    isGameStart = false;
    gameBtn.innerText = "Start Game"
    clearInterval(myInterval);
    resultMessage.innerText = `Sorry to see you go`;
  }
  else {
    gameBtn.innerText = "Stop Game";
    imageContainer.innerText = "";

    isGameStart = true;
    timeTaken = 0;
    score = 0;
    movesCounter = 0;
    moves.innerText = "0";
    resultMessage.innerText = "";

    myInterval = setInterval(updateTimer, 1000);
    updateImages();

    // now after timer starts, needs to update images on click
    // adding event listener
    addEventOnCards();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addEventOnCards() {
  imageContainer.addEventListener("click", async (e) => {
    const myCard = e.target;
    if (myCard.classList.contains("card-front") && isGameStart == true) {
      openCardClicks++;
      let flag = true;
      if (openCardClicks == 1) {
        firstCardClick = e.target.parentNode;
        myCard.style.display = `none`;
        flag = false;
      }
      else if (openCardClicks == 2 && e.target.parentNode != firstCardClick) {
        secondCardClick = e.target.parentNode;
        myCard.style.display = `none`;
        // add an interval to close them back after a sec
        // but only when 2 cards are open
        movesCounter++;
        moves.innerText = `${movesCounter}`;

        if (!isMatched()) {

          await delay(2000);
          firstCardClick.querySelector(".card-front").style.display = `flex`;
          secondCardClick.querySelector(".card-front").style.display = `flex`;

        }
        else {
          score++;
          if (score == images.length/2) {
            resultMessage.innerText = `You won with ${movesCounter} moves!`;
            isGameStart = false;
            gameBtn.innerText = "Start Game"
            clearInterval(myInterval);
          }
          console.log(score);
        }
        flag = false;
        openCardClicks = 0; // reset
      }
      
      if (flag == true)
        openCardClicks--;
    }
    // if(myCard.classList.contains("card-back"))
    // {
    //   if(openCardClicks<2)
    //   {
    //     let frontPart = myCard.parentNode.querySelector(".card-front");
    //     frontPart.style.display = `flex`;
    //     openCardClicks--;
    //     // console.log(frontPart);
    //   }
    // }
  })
}

function isMatched() {
  let first = firstCardClick.querySelector(".card-back").innerText;
  let second = secondCardClick.querySelector(".card-back").innerText;

  let result = first == second;

  return result;
  // return true;
}

function updateImages() {
  let currImages = [...images];
  let size = currImages.length;
  // making a span.card and adding 2 spans with card-back
  // and card front images, making absolute in styles
  for (let i = 0; i < size; i++) {
    let randomNum = Math.floor(Math.random() * currImages.length);

    let imageBox = document.createElement("div");

    let imageBoxBack = document.createElement("span");
    let imageBoxFront = document.createElement("span");

    imageBox.dataset.key = i;
    imageBox.classList.add("card");

    imageBoxFront.classList.add("card-front");
    imageBoxBack.classList.add("card-back");


    imageBoxBack.innerText = `${currImages[randomNum]}`
    imageBoxFront.innerText = `⭐`;
    imageBox.append(imageBoxBack, imageBoxFront);

    imageContainer.append(imageBox);

    currImages.splice(randomNum, 1);
  }
  console.log([...imageContainer.children].map(div => {
    return div.children[0].innerText
  }))

}

function format(str) {
  if (str < 10) {
    return ("0" + str);
  }
  return str;
}

function updateTimer() {
  timeTaken++;
  let calculateTime = timeTaken;
  let hour = Math.floor(calculateTime / 3600);

  calculateTime = calculateTime % 3600;

  let minutes = Math.floor(calculateTime / 60);
  calculateTime %= 60;

  let seconds = calculateTime;

  timerTime.innerText = `${format(hour)}:${format(minutes)}:${format(seconds)}`;

  // console.log(hour,minutes,seconds);

}

// startGame();