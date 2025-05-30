document.addEventListener("turbo:load", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept-btn");

  if (!cookieBanner || !acceptBtn) return;

  /* Mostrar solo si no está aceptada */
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
      cookieBanner.style.display = "none";
      document.cookie = "cookies_accepted=true; path=/; max-age=31536000";
    });
  });
});
