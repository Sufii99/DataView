document.addEventListener("turbo:load", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept-btn");

  if (!cookieBanner || !acceptBtn) return;

  // Mostrar solo si no está aceptada
  if (!document.cookie.includes("cookies_accepted=true")) {
    cookieBanner.style.display = "block";
  }

  acceptBtn.addEventListener("click", () => {
    fetch("/cookies/accept", {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
        "Content-Type": "application/json"
      }
    }).then(() => {
      // Ocultar banner
      cookieBanner.style.display = "none";
      // Establecer cookie también desde JS por si Turbo aún no ha procesado la respuesta
      document.cookie = "cookies_accepted=true; path=/; max-age=31536000";
    });
  });
});
