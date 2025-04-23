// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import './mobile_menu.js';
import './header_transition.js';
import './help_drop.js';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'


document.addEventListener('turbo:load', () => {
  if (document.getElementById('react-root')){
    const root = createRoot(document.getElementById('react-root'));
    root.render(<App />);
  }
});