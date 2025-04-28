document.addEventListener("turbo:load", () => {
    document.querySelectorAll(".flash-alert").forEach(el => {
      /* Slide in */
      requestAnimationFrame(() => {
        el.classList.remove("opacity-0", "-translate-x-10");
        el.classList.add("opacity-100", "translate-x-0");
      });

      /* Slide out después de 5s */
      setTimeout(() => {
        el.classList.remove("opacity-100", "translate-x-0");
        el.classList.add("opacity-0", "-translate-x-10");

        /* Después de la transición, eliminamos el nodo */
        setTimeout(() => el.remove(), 500); // Tiempo de la transición
      }, 5000);
    });
  });
