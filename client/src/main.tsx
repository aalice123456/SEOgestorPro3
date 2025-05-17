import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "SeoGestorPro - SEO Project Management Dashboard";

// Set meta description
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'SeoGestorPro helps SEO professionals manage clients, projects, tasks, and reports efficiently in one centralized platform.';
document.head.appendChild(metaDescription);

// Set Open Graph tags
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = 'SeoGestorPro - SEO Project Management Dashboard';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Manage your SEO projects efficiently with SeoGestorPro. Track clients, projects, tasks, and generate reports.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

// Create and append favicon link
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>';
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
