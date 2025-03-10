document.addEventListener("turbo:load", function() {
  const flashAlert = document.querySelector('[id^="flash-alert"]');  // Selecciona el primer elemento que comience con 'flash-alert'
  if (flashAlert) {
    // Aparece la alerta inmediatamente
    flashAlert.classList.add('show');
    
    // Después de 5 segundos, oculta la alerta
    setTimeout(function() {
      flashAlert.classList.remove('show');
    }, 5000); // 5 segundos
  }
});
