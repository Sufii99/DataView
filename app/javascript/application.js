import "@hotwired/turbo-rails"
import "./controllers"
import './mobile_menu.js';
import './header_transition.js';
import './help_drop.js';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import BarChart from "./components/BarChart";

document.addEventListener("turbo:load", () => {
  const reactRoot = document.getElementById("react-root");
  if (reactRoot) {
    const root = createRoot(reactRoot);  // Usar createRoot en lugar de render
    root.render(<App />);
  }

  const d3Container = document.getElementById("d3-container");
  if (d3Container) {
    const rootD3 = createRoot(d3Container);  // También usar createRoot aquí
    rootD3.render(<BarChart />);
  }
});
