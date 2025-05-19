// Detect when memo section is visible
const memoSection = document.querySelector('.memo');

function toggleMemoBackground() {
  const rect = memoSection.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  if (rect.top <= windowHeight && rect.bottom >= 0) {
    memoSection.classList.add('active');
  } else {
    memoSection.classList.remove('active');
  }
}

// Randomize X-axis shifts per row
function applyRandomShifts() {
  const rows = document.querySelectorAll('.picture-row');
  rows.forEach(row => {
    const randomShift = Math.floor(Math.random() * 100 - 50); // -50 to +50px
    row.style.setProperty('--random-shift', `${randomShift}px`);
  });
}

window.addEventListener('scroll', toggleMemoBackground);
window.addEventListener('load', () => {
  applyRandomShifts();
  toggleMemoBackground();
});

window.addEventListener("load", () => {
  const audio = document.getElementById("song");
  audio.volume = 1.0;
  audio.play();
});

// Predetermined credentials
const CORRECT_NAME     = "Clayah Bianca Baltazar";
const CORRECT_USERNAME = "Kliah";
const CORRECT_PASSWORD = "Kal-El&Kliah1023";

document.addEventListener("DOMContentLoaded", () => {
  const form         = document.getElementById("loginForm");
  const nameInput    = document.getElementById("nameInput");
  const userInput    = document.getElementById("userInput");
  const passInput    = document.getElementById("passInput");
  const loginMessage = document.getElementById("loginMessage");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const nameVal = nameInput.value.trim();
    const userVal = userInput.value.trim();
    const passVal = passInput.value;

    if (
      nameVal === CORRECT_NAME &&
      userVal === CORRECT_USERNAME &&
      passVal === CORRECT_PASSWORD
    ) {
      // Redirect on success
      window.location.href = "Storage/Storage.html";
    } else {
      loginMessage.textContent = "ada mali langging, usa pa daw heheheh";
    }
  });
});
