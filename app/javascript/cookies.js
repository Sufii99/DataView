document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
  
    document.getElementById("accept-cookies").addEventListener("click", () => {
      fetch("/cookies/accept", { method: "POST", headers: { "X-CSRF-Token": document.querySelector("[name='csrf-token']").content } })
        .then(() => banner.remove());
    });
  
    document.getElementById("reject-cookies").addEventListener("click", () => {
      fetch("/cookies/reject", { method: "POST", headers: { "X-CSRF-Token": document.querySelector("[name='csrf-token']").content } })
        .then(() => banner.remove());
    });
  });
  