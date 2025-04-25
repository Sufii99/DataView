document.addEventListener("turbo:load", function () {
  const openBtn = document.getElementById("open-menu");
  const closeBtn = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  openBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

document.addEventListener("turbo:load", function () {
  const toggleBtn = document.getElementById("toggle-menu");
  const subMenu = document.getElementById("disclosure-1");
  const toggleIcon = document.getElementById("toggle-icon");

  toggleBtn.addEventListener("click", function () {
    // Alternar la clase 'hidden' para mostrar/ocultar el submenú
    subMenu.classList.toggle("hidden");

    // Cambiar la dirección de la flecha dependiendo del estado del submenú
    const isExpanded = !subMenu.classList.contains("hidden");
    toggleIcon.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
  });
});
