document.addEventListener("turbo:load", function () {
  const openBtn = document.getElementById("open-menu")
  const closeBtn = document.getElementById("close-menu")
  const mobileMenu = document.getElementById("mobile-menu")

  if (openBtn && mobileMenu) {
    openBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden")
    })
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.add("hidden")
    })
  }
})

document.addEventListener("turbo:load", function () {
  const toggleBtn = document.getElementById("toggle-help")
  const subMenu = document.getElementById("disclosure-help")
  const toggleIcon = document.getElementById("toggle-help-icon")

  if (toggleBtn && subMenu && toggleIcon) {
    toggleBtn.addEventListener("click", function () {
      subMenu.classList.toggle("hidden")

      const isExpanded = !subMenu.classList.contains("hidden")
      toggleIcon.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)"
    })
  }
})
