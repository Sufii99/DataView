import "@hotwired/turbo-rails";
import * as React from 'react';
import { createRoot } from 'react-dom/client';

/* JS de vistas */
import './views/header/mobile_menu.js';
import './views/header/header_transition.js';
import './views/header/help_drop.js';
import './views/header/help_mobile.js';
import './views/notifications/notification_slide.js';

/* Componentes jsx */
import ChartDemo from './components/Home/ChartDemo.jsx';
import DashboardApp from './components/Dashboard/DashboardApp.jsx';
import AdminPanel from './components/Administration/AdminPanel.jsx';

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