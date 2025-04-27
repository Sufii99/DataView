document.addEventListener('turbo:load', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  /* Fuera del dashboard, aplicar scroll dinámico, con header fijo */
  if (!window.location.pathname.startsWith('/dashboard')) {
    navbar.classList.remove('bg-white', 'shadow-md');
    navbar.classList.add('bg-transparent');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        navbar.classList.remove('bg-transparent');
        navbar.classList.add('bg-white', 'shadow-md');
      } else {
        navbar.classList.remove('bg-white', 'shadow-md');
        navbar.classList.add('bg-transparent');
      }
    });
  } else {
    /* En Dashboard, no hay scroll dinámico, sin header fijo */
    navbar.classList.remove('bg-transparent');
    navbar.classList.remove('fixed', 'top-0', 'left-0', 'w-full', 'z-50');
    navbar.classList.add('bg-white', 'shadow-md');
  }
});