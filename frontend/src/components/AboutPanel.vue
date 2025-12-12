<template>
  <div class="side-panel modern-panel">
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

    <div class="panel-content">
      <!-- Логотип и название -->
      <div class="app-hero">
        <div class="app-logo">
          <span class="logo-icon">🗺️</span>
        </div>
        <h1 class="app-name">MapChap</h1>
        <p class="app-tagline">Ваш путеводитель по локальному бизнесу</p>
        <div class="app-version">
          <span class="version-badge">v3.0.0</span>
          <span class="version-date">2024</span>
        </div>
      </div>

      <!-- Описание -->
      <div class="about-section">
        <h3>🚀 О проекте</h3>
        <p>
          <strong>MapChap</strong> — это Telegram Mini App для поиска и размещения 
          бизнес-объявлений на карте. Мы соединяем предпринимателей 
          с клиентами, помогая находить лучшие места рядом.
        </p>
      </div>

      <!-- Функции -->
      <div class="features-section">
        <h3>⭐ Возможности</h3>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🗺️</span>
            <div class="feature-content">
              <h4>Интерактивная карта</h4>
              <p>Находите бизнесы рядом с вами на карте</p>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">💼</span>
            <div class="feature-content">
              <h4>Для бизнеса</h4>
              <p>Размещайте объявления и привлекайте клиентов</p>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔔</span>
            <div class="feature-content">
              <h4>Умные уведомления</h4>
              <p>Узнавайте о новых местах рядом</p>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">✅</span>
            <div class="feature-content">
              <h4>Верификация</h4>
              <p>Проверка бизнеса через ИНН (DaData)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Команда -->
      <div class="team-section">
        <h3>👥 Команда</h3>
        <div class="team-list">
          <div class="team-member">
            <div class="member-avatar">
              <span>👨‍💻</span>
            </div>
            <div class="member-info">
              <h4>Хабибуллаев Ахрор</h4>
              <p>Основатель и CEO</p>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <span>👩‍💼</span>
            </div>
            <div class="member-info">
              <h4>Яна Владимировна Ивченко</h4>
              <p>Финансовый директор</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Контакты -->
      <div class="contacts-section">
        <h3>📞 Свяжитесь с нами</h3>
        <div class="contacts-list">
          <a href="mailto:khabibullaevakhrorjon@gmail.com" class="contact-item">
            <span class="contact-icon">✉️</span>
            <div class="contact-info">
              <span class="contact-label">Email</span>
              <span class="contact-value">khabibullaevakhrorjon@gmail.com</span>
            </div>
            <span class="contact-arrow">›</span>
          </a>
          
          <a href="tel:+79998214758" class="contact-item">
            <span class="contact-icon">📱</span>
            <div class="contact-info">
              <span class="contact-label">Телефон</span>
              <span class="contact-value">+7 (999) 821-47-58</span>
            </div>
            <span class="contact-arrow">›</span>
          </a>
          
          <a href="https://t.me/mapchap_support" target="_blank" class="contact-item">
            <span class="contact-icon">💬</span>
            <div class="contact-info">
              <span class="contact-label">Telegram</span>
              <span class="contact-value">@mapchap_support</span>
            </div>
            <span class="contact-arrow">›</span>
          </a>
        </div>
      </div>

      <!-- Юридическая информация -->
      <div class="legal-section">
        <div class="legal-links">
          <button class="legal-btn" @click="showPrivacyPolicy">
            📄 Политика конфиденциальности
          </button>
          <button class="legal-btn" @click="showTermsOfService">
            📝 Условия использования
          </button>
        </div>
      </div>

      <!-- Футер -->
      <div class="about-footer">
        <p>Сделано с ❤️ в России</p>
        <p class="copyright">© 2024 MapChap. Все права защищены.</p>
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
    const { closePanel, showNotification } = uiStore

    const showPrivacyPolicy = () => {
      showNotification('Политика конфиденциальности в разработке', 'info')
    }

    const showTermsOfService = () => {
      showNotification('Условия использования в разработке', 'info')
    }

    return {
      closePanel,
      showPrivacyPolicy,
      showTermsOfService
    }
  }
}
</script>

<style scoped>
.app-hero {
  text-align: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  margin-bottom: 24px;
}

.app-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.app-name {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
}

.app-tagline {
  margin: 0 0 16px 0;
  font-size: 16px;
  opacity: 0.9;
}

.app-version {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.version-badge {
  padding: 4px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.version-date {
  font-size: 12px;
  opacity: 0.8;
}

.about-section,
.features-section,
.team-section,
.contacts-section,
.legal-section {
  margin-bottom: 24px;
}

.about-section h3,
.features-section h3,
.team-section h3,
.contacts-section h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: var(--tg-text-color);
}

.about-section p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--tg-text-color);
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 14px;
}

.feature-icon {
  font-size: 28px;
}

.feature-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.feature-content p {
  margin: 0;
  font-size: 12px;
  color: var(--tg-hint-color);
  line-height: 1.4;
}

/* Team */
.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 14px;
}

.member-avatar {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.member-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
}

.member-info p {
  margin: 0;
  font-size: 13px;
  color: var(--tg-hint-color);
}

/* Contacts */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.contact-item:hover {
  background: var(--tg-border-color);
}

.contact-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  background: var(--tg-bg-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 12px;
  color: var(--tg-hint-color);
}

.contact-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--tg-text-color);
}

.contact-arrow {
  font-size: 20px;
  color: var(--tg-hint-color);
}

/* Legal */
.legal-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legal-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  background: var(--tg-secondary-bg-color);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  color: var(--tg-text-color);
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.legal-btn:hover {
  background: var(--tg-border-color);
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 20px;
  border-top: 1px solid var(--tg-border-color);
  margin-top: 20px;
}

.about-footer p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--tg-hint-color);
}

.about-footer .copyright {
  font-size: 12px;
  margin: 0;
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-value {
    font-size: 13px;
  }
}
</style>
