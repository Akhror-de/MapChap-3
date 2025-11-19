<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Light theme variables */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-color: #667eea;
  --accent-hover: #5a6fd8;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --text-muted: #a0aec0;
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --bg-tertiary: #edf2f7;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.2);
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark-theme {
  --primary-gradient: linear-gradient(135deg, #7c93e0 0%, #8a68c2 100%);
  --secondary-gradient: linear-gradient(135deg, #ff8ce3 0%, #ff6b7a 100%);
  --accent-color: #7c93e0;
  --accent-hover: #6b83d4;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --text-muted: #a0aec0;
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-tertiary: #4a5568;
  --border-color: #4a5568;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.5);
  --glass-bg: rgba(45, 55, 72, 0.8);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Glass morphism эффекты */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

/* Анимации */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

/* Хедер */
.app-header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.logo p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.nav-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: scale(1.1);
}

/* Основной контент */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

.dashboard {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: calc(100vh - 120px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.search-section, .categories-section, .location-section {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.search-section:hover, .categories-section:hover, .location-section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 0.75rem 1rem;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.category-btn:hover {
  border-color: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.category-btn.active {
  border-color: var(--accent-color);
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.location-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-weight: 500;
}

.location-btn:hover {
  border-color: var(--accent-color);
  background: var(--primary-gradient);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.map-container {
  position: relative;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.map-container:hover {
  box-shadow: var(--shadow-xl);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    min-height: calc(100vh - 120px);
  }

  .sidebar {
    height: auto;
  }

  .map-container {
    height: 400px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .desktop-only {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .app-main {
    padding: 1rem 0;
  }

  .dashboard {
    gap: 1rem;
  }
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-hover);
}
</style>
