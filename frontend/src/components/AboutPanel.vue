<template>
  <div class="side-panel modern-panel">
    <!-- Заголовок -->
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">ℹ️</span>
          О приложении
        </h2>
      </div>
    </div>

    <!-- Содержимое панели -->
    <div class="panel-content">
      <div class="about-content">
        <!-- Логотип и основная информация -->
        <div class="app-info">
          <div class="app-logo">
            <span class="logo-icon">🗺️</span>
          </div>
          <h1 class="app-name">MapChap</h1>
          <p class="app-tagline">Бизнес-объявления на карте</p>
          <p class="app-version">Версия 3.0.0</p>
        </div>

        <!-- Описание приложения -->
        <div class="description-section">
          <h3>О проекте</h3>
          <p>
            MapChap - это современная платформа для размещения и поиска бизнес-объявлений 
            на интерактивной карте. Мы помогаем бизнесу находить новых клиентов, 
            а пользователям - открывать лучшие места в городе.
          </p>
        </div>

        <!-- Возможности -->
        <div class="features-section">
          <h3>🎯 Основные возможности</h3>
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">📍</span>
              <div class="feature-content">
                <h4>Интерактивная карта</h4>
                <p>Удобный поиск бизнесов на карте вашего города</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💼</span>
              <div class="feature-content">
                <h4>Для бизнеса</h4>
                <p>Размещайте объявления и привлекайте новых клиентов</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <div class="feature-content">
                <h4>Адаптивный дизайн</h4>
                <p>Удобное использование на любых устройствах</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌙</span>
              <div class="feature-content">
                <h4>Темная тема</h4>
                <p>Комфортная работа в любое время суток</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="stats-section">
          <h3>📊 Наша статистика</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">1,247+</div>
              <div class="stat-label">Пользователей</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">356+</div>
              <div class="stat-label">Бизнесов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">89+</div>
              <div class="stat-label">Статей в блоге</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Поддержка</div>
            </div>
          </div>
        </div>

        <!-- Контакты -->
        <div class="contacts-section">
          <h3>📞 Контакты</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span>support@mapchap.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🌐</span>
              <span>mapchap.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">💬</span>
              <span>Telegram: @mapchap_support</span>
            </div>
          </div>
        </div>

        <!-- Социальные сети -->
        <div class="social-section">
          <h3>🔗 Мы в соцсетях</h3>
          <div class="social-links">
            <button class="social-btn">
              <span class="social-icon">📘</span>
              <span>Facebook</span>
            </button>
            <button class="social-btn">
              <span class="social-icon">📷</span>
              <span>Instagram</span>
            </button>
            <button class="social-btn">
              <span class="social-icon">🐦</span>
              <span>Twitter</span>
            </button>
            <button class="social-btn">
              <span class="social-icon">💼</span>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        <!-- Копирайт -->
        <div class="footer-section">
          <p>© 2024 MapChap. Все права защищены.</p>
          <p>Сделано с ❤️ для бизнеса</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'

export default {
  name: 'AboutPanel',
  setup() {
    const uiStore = useUIStore()
    const { closePanel } = uiStore

    return {
      closePanel
    }
  }
}
</script>

<style scoped>
.about-content {
  padding: 0;
}

.app-info {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.app-logo {
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 4rem;
  display: block;
}

.app-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-tagline {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.app-version {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.description-section,
.features-section,
.stats-section,
.contacts-section,
.social-section {
  margin-bottom: 2rem;
}

.description-section h3,
.features-section h3,
.stats-section h3,
.contacts-section h3,
.social-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.description-section p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  border-radius: 10px;
}

.feature-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.feature-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.contact-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.social-btn:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

.social-icon {
  font-size: 1.1rem;
}

.footer-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-section p {
  margin: 0.25rem 0;
}

/* Адаптивность */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
