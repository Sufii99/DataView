import "@hotwired/turbo-rails";
import * as React from 'react';
import { createRoot } from 'react-dom/client';

/* JS de vistas */
import './viewScripts/header/mobile_menu.js';
import './viewScripts/header/header_transition.js';
import './viewScripts/header/help_drop.js';
import './viewScripts/header/help_mobile.js';
import './viewScripts/notifications/notification_slide.js';
import "./viewScripts/cookies/cookies.js";

/* Componentes jsx */
import ChartDemo from './components/home/ChartDemo.jsx';
import DashboardApp from './components/dashboard/DashboardApp.jsx';
import AdminPanel from './components/administration/AdminPanel.jsx';

document.addEventListener("turbo:load", () => {
  const chartDemoRoot = document.getElementById("chart-demo-root");
  if (chartDemoRoot) {
    const root = createRoot(chartDemoRoot);
    root.render(<ChartDemo />);
  }

  const dashboardRoot = document.getElementById("dashboard-root");
  if (dashboardRoot) {
    const root = createRoot(dashboardRoot);
    root.render(<DashboardApp />);
  }

  const container = document.getElementById("admin-panel")
  if (container) {
    const root = createRoot(container)
    root.render(<AdminPanel />)
  }
});