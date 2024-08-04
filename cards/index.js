let flippedCards = [];
let matchedPairs = 0;
let timerInterval;
let startTime;

function changeRange(e) {
  const chosenNumber = document.querySelector("#chosen_number");
  chosenNumber.textContent = e.target.value;
}

function showGamePage() {
  resetTimer(); // Reset the timer display
  const usernameInput = document.querySelector("#username_input").value;
  const numberOfCards = parseInt(
    document.querySelector("#number_of_cards_input").value,
    10
  );

  if (!usernameInput) {
    alert("You didn't enter a username!");
    return;
  }

  matchedPairs = 0; // Reset matched pairs count
  document.querySelector("#result_username").textContent = usernameInput;
  const photosContainer = document.querySelector("#photos_container");
  photosContainer.innerHTML = ""; // Clear any existing photos
  document.querySelector("#game_over_modal").style.display = "none"; // Hide game over modal
  startTimer(); // Start the timer

  const photos = [];
  for (let i = 0; i < numberOfCards; i++) {
    const photoNumber = i + 1;
    photos.push(`../cards_photos/${photoNumber}.png`);
  }

  const allPhotos = [...photos, ...photos]; // Duplicate the photos array
  shuffleArray(allPhotos); // Shuffle the array

  allPhotos.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = "../cards_photos/blank.png"; // Initial blank image
    img.alt = src; // Use the actual photo URL in the alt attribute
    img.dataset.flipped = "false";
    img.dataset.index = index; // Store the index for reference
    img.addEventListener("click", flipCard);
    photosContainer.appendChild(img);
  });

  document.querySelector("#main_div").style.display = "none";
  document.querySelector("#result_div").style.display = "block";
}

function flipCard(event) {
  const img = event.target;
  const isFlipped = img.dataset.flipped === "true";

  if (isFlipped || flippedCards.length === 2) {
    return; // Ignore if the card is already flipped or two cards are already flipped
  }

  img.src = img.alt; // Use the alt attribute to get the actual photo URL
  img.dataset.flipped = "true";
  img.classList.add("flipped");
  flippedCards.push(img);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;
  if (firstCard.alt === secondCard.alt) {
    // It's a match
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    matchedPairs++;
    resetFlippedCards();
    checkGameOver();
  } else {
    // Not a match, immediately flip back
    setTimeout(() => {
      firstCard.src = "../cards_photos/blank.png";
      secondCard.src = "../cards_photos/blank.png";
      firstCard.dataset.flipped = "false";
      secondCard.dataset.flipped = "false";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlippedCards();
    }, 300); // Short delay for the user to see the second card
  }
}

function checkGameOver() {
  const numberOfCards = parseInt(
    document.querySelector("#number_of_cards_input").value,
    10
  );
  if (matchedPairs === numberOfCards) {
    stopTimer(); // Stop the timer
    document.querySelector("#game_over_modal").style.display = "block";
    document.querySelector("#elapsed_time").textContent =
      document.querySelector("#timer").textContent;
  }
}

function resetFlippedCards() {
  flippedCards = [];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startAgain() {
  stopTimer(); // Stop the timer
  showGamePage(); // Restart the game directly without returning to the initial setup page
  document.querySelector("#game_over_modal").style.display = "none"; // Hide game over modal
}

function exitGame() {
  stopTimer(); // Stop the timer
  resetTimer(); // Reset the timer display
  document.querySelector("#main_div").style.display = "block";
  document.querySelector("#result_div").style.display = "none";
  document.querySelector("#username_input").value = "";
  document.querySelector("#number_of_cards_input").value = 15;
  changeRange({ target: { value: 15 } });
  document.querySelector("#game_over_modal").style.display = "none"; // Hide game over modal
}

// Timer functions
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  document.querySelector("#timer").textContent = "00:00";
}

function updateTimer() {
  const now = new Date();
  const elapsedTime = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  document.querySelector("#timer").textContent = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
