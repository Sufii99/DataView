document.addEventListener("turbo:load", setupNotifications);
document.addEventListener("turbo:render", setupNotifications);

function setupNotifications() {
  const notifications = document.querySelectorAll(".notification-item");
  
  notifications.forEach(notification => {
    // Cerrar notificación al hacer clic en la 'X'
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.remove();
      });
    }

    // Desaparecer automáticamente después de 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);
  });
}
