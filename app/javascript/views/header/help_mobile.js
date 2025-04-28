document.addEventListener('DOMContentLoaded', function () {
    const toggleHelpButton = document.getElementById('toggle-help');
    const disclosureHelp = document.getElementById('disclosure-help');
    const toggleHelpIcon = document.getElementById('toggle-help-icon');
  
    toggleHelpButton.addEventListener('click', function () {
      const isOpen = disclosureHelp.classList.contains('hidden');
  
      if (isOpen) {
        disclosureHelp.classList.remove('hidden');
        toggleHelpIcon.classList.add('rotate-180');
      } else {
        disclosureHelp.classList.add('hidden');
        toggleHelpIcon.classList.remove('rotate-180');
      }
    });
  });
  