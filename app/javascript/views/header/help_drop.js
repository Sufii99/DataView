document.addEventListener("turbo:load", () => {
    const dropdownContainer = document.querySelector(".relative");
    const dropdownMenu = dropdownContainer.querySelector("div.absolute");
    const arrowIcon = dropdownContainer.querySelector("svg");
    const buttonGroup = dropdownContainer.querySelector(".group");
  
    let timeout;
  
    const showMenu = () => {
      clearTimeout(timeout);
      dropdownMenu.classList.add("opacity-100", "translate-y-0", "visible");
      dropdownMenu.classList.remove("opacity-0", "translate-y-1", "invisible");
  
      // Activar estilo de flecha y texto
      arrowIcon.classList.add("rotate-180", "text-blue-600");
      buttonGroup.classList.add("text-blue-600", "is-open");
    };
  
    const hideMenu = () => {
      timeout = setTimeout(() => {
        dropdownMenu.classList.remove("opacity-100", "translate-y-0", "visible");
        dropdownMenu.classList.add("opacity-0", "translate-y-1", "invisible");
  
        // Restaurar estilos
        arrowIcon.classList.remove("rotate-180", "text-blue-600");
        buttonGroup.classList.remove("text-blue-600", "is-open");
      }, 200);
    };
  
    dropdownContainer.addEventListener("mouseenter", showMenu);
    dropdownContainer.addEventListener("mouseleave", hideMenu);
    dropdownMenu.addEventListener("mouseenter", () => clearTimeout(timeout));
    dropdownMenu.addEventListener("mouseleave", hideMenu);
  });
  