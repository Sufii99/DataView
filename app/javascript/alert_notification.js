document.addEventListener("turbo:load", hideFlashAlert);
document.addEventListener("turbo:render", hideFlashAlert);

function hideFlashAlert() {
  const flashAlert = document.getElementById("flash-alert");
  if (flashAlert) {
    // Aparece la alerta inmediatamente
    flashAlert.classList.add("show");

    // Desaparece la alerta después de 5 segundos
    setTimeout(() => {
      flashAlert.classList.remove("show");
    }, 5000); // 5 segundos
  }
}

