document.addEventListener('turbo:load', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Si estamos fuera del dashboard, aplicar scroll dinámico
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
    // En dashboard, sin scroll dinámico, pero NO fijo
    navbar.classList.remove('bg-transparent');
    navbar.classList.remove('fixed', 'top-0', 'left-0', 'w-full', 'z-50'); // Asegúrate de quitar esto
    navbar.classList.add('bg-white', 'shadow-md');
  }
});