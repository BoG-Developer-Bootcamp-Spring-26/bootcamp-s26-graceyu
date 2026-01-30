const button = document.getElementById("toggle-btn");
const text = document.getElementById("extra-text");

button.addEventListener("click", () => {
  text.classList.toggle("hidden");
});
