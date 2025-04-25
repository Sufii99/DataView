import "@hotwired/turbo-rails"
import "./controllers"
import './header/mobile_menu.js';
import './header/header_transition.js';
import './header/help_drop.js';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import BarChart from "./components/BarChart";

document.addEventListener("turbo:load", () => {
  const reactRoot = document.getElementById("react-root");
  if (reactRoot) {
    const root = createRoot(reactRoot);  
    root.render(<App />);
  }

  const d3Container = document.getElementById("d3-container");
  if (d3Container) {
    const rootD3 = createRoot(d3Container); 
    rootD3.render(<BarChart />);
  }
});
