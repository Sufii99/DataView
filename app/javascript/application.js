import "@hotwired/turbo-rails"
import './views/header/mobile_menu.js';
import './views/header/header_transition.js';
import './views/header/help_drop.js';
import './views/header/help_mobile.js';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import BarChart from "./components/BarChart";
import DashboardApp from './components/DashboardApp'

document.addEventListener("turbo:load", () => {
  const d3Container = document.getElementById("d3-container");
  if (d3Container) {
    const rootD3 = createRoot(d3Container); 
    rootD3.render(<BarChart />);
  }

  const dashboardRoot = document.getElementById("dashboard-root");
  if (dashboardRoot) {
    const root = createRoot(dashboardRoot);
    root.render(<DashboardApp />);
  }
});