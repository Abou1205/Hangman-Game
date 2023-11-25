const word = document.querySelector(".word");
const popupContainer = document.querySelector(".popup-container");
const popup = document.querySelector(".popup");
const succesMessage = document.querySelector(".success-message");
const failMessage = document.querySelector(".fail-message");
const wrongLetterEl = document.querySelector(".wrong-letters");
const items = document.querySelectorAll(".item");
const messageEl = document.querySelector(".message");
const againBtn = document.querySelector(".play-again")


const correctLetters = [];
const wrongLetters = [];
let selectedWord = getRandomWord()

async function getRandomWordFromAPI() {
  const apiUrl = "https://random-word-api.herokuapp.com/word";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // console.log(data);

    if (Array.isArray(data) && data.length > 0) {
      return data[0].toString().toLowerCase();
    } else {
      console.error("Invalid response from API:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching random word:", error);
    return null;
  }
}


async function getRandomWord() {
  selectedWord = await getRandomWordFromAPI();
  if (selectedWord && typeof selectedWord === 'string') {
    displayWord();
  } else {
    console.error("Invalid word retrieved from API:", selectedWord);
  }
}

function displayWord() {
  if (typeof selectedWord !== 'string') {
    console.error("Selected word is not a string:", selectedWord);
    return;
  }

  word.innerHTML = `
        ${selectedWord
          .split("")
          .map(
            (letter) => `<div class="letter">
            ${correctLetters.includes(letter.toLowerCase()) ? letter : ""}
        </div>`
          )
          .join("")}
    `;

  const w = word.innerText.replace(/\n/g, "");
  if (w === selectedWord) {
    if(!popupContainer.style.display || popupContainer.style.display !== 'flex'){
      popupContainer.style.display = "flex";
      popup.style.backgroundColor = "green"
      succesMessage.innerText = "Congratulations, You Won";
      failMessage.innerText = ""
    }
  }
}

function updateWrongLetters() {
  wrongLetterEl.innerHTML = `
      ${wrongLetters.length > 0 ? "<h3>Wrong Letters</h3>" : ""}
      ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;



  items.forEach((item, index) => {
    const errorCount = wrongLetters.length;

    if (index < errorCount) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  if (wrongLetters.length === items.length) {
    popup.style.backgroundColor = "red";
    popupContainer.style.display = "flex";
    failMessage.innerText = ` Unfortunately, You Lost Word Is: ${selectedWord} `;
    succesMessage.innerText = ""
  }
}


function displayMessage() {
  messageEl.classList.add("show")


  setTimeout(function() {
    messageEl.classList.remove("show")
  }, 2000)
}


againBtn.addEventListener("click", function(){
  correctLetters.splice(0)
  wrongLetters.splice(0)

  selectedWord = getRandomWord()

  displayWord()
  updateWrongLetters()

  popupContainer.style.display = "none"


  
})

window.addEventListener("keydown", function (e) {
  if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 222 ) {
    const letter = e.key.toLowerCase();

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        displayMessage()
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLetters();
      } else {
        displayMessage()
      }
    }
  }
});

displayWord();
