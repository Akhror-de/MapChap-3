<template>
  <div class="side-panel">
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
      <!-- Герой -->
      <div class="about-hero">
        <div class="hero-logo">🗺️</div>
        <h1 class="hero-title">MapChap</h1>
        <p class="hero-tagline">Путеводитель по локальному бизнесу</p>
        <div class="hero-version">
          <span class="version-tag">v3.0.0</span>
          <span class="version-year">2024</span>
        </div>
      </div>

      <!-- О проекте -->
      <div class="section-card">
        <h3>🚀 О проекте</h3>
        <p>Telegram Mini App для поиска и размещения бизнес-объявлений на карте. Соединяем предпринимателей с клиентами.</p>
      </div>

      <!-- Возможности -->
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">🗺️</span>
          <strong>Карта</strong>
          <p>Бизнесы рядом</p>
        </div>
        <div class="feature-card orange">
          <span class="feature-icon">💼</span>
          <strong>Бизнес</strong>
          <p>Размещение</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔔</span>
          <strong>Уведомления</strong>
          <p>Push ближним</p>
        </div>
        <div class="feature-card orange">
          <span class="feature-icon">✅</span>
          <strong>Верификация</strong>
          <p>DaData ИНН</p>
        </div>
      </div>

      <!-- Команда -->
      <div class="section-card">
        <h3>👥 Команда</h3>
        <div class="team-list">
          <div class="team-member">
            <div class="member-avatar">👨‍💻</div>
            <div>
              <strong>Хабибуллаев Ахрор</strong>
              <p>Основатель и CEO</p>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">👩‍💼</div>
            <div>
              <strong>Яна Владимировна Ивченко</strong>
              <p>Финансовый директор</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Контакты -->
      <div class="section-card">
        <h3>📞 Контакты</h3>
        <div class="contacts-list">
          <a href="mailto:khabibullaevakhrorjon@gmail.com" class="contact-item">
            <span>✉️</span>
            <div>
              <span class="contact-label">Email</span>
              <span class="contact-value">khabibullaevakhrorjon@gmail.com</span>
            </div>
          </a>
          <a href="tel:+79998214758" class="contact-item">
            <span>📱</span>
            <div>
              <span class="contact-label">Телефон</span>
              <span class="contact-value">+7 (999) 821-47-58</span>
            </div>
          </a>
          <a href="https://t.me/mapchap_support" class="contact-item">
            <span>💬</span>
            <div>
              <span class="contact-label">Telegram</span>
              <span class="contact-value">@mapchap_support</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Футер -->
      <div class="about-footer">
        <p>Сделано с ❤️ в России</p>
        <p>© 2024 MapChap</p>
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
    return { closePanel: uiStore.closePanel }
  }
}
</script>

<style scoped>
.about-hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
  border-radius: 24px;
  margin-bottom: 20px;
}

.hero-logo { font-size: 56px; margin-bottom: 12px; }
.hero-title {
  margin: 0 0 8px;
  font-size: 36px;
  font-weight: 800;
  color: #000;
  letter-spacing: -1px;
}
.hero-tagline { margin: 0 0 16px; color: rgba(0,0,0,0.7); font-size: 15px; }
.hero-version { display: flex; align-items: center; justify-content: center; gap: 12px; }
.version-tag {
  padding: 4px 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  color: #000;
  font-size: 12px;
  font-weight: 600;
}
.version-year { color: rgba(0,0,0,0.6); font-size: 12px; }

.section-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.section-card h3 { margin: 0 0 12px; font-size: 16px; color: #fff; }
.section-card p { margin: 0; font-size: 14px; color: #888; line-height: 1.6; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.feature-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}
.feature-card.orange { border-color: rgba(255, 107, 0, 0.3); }
.feature-icon { font-size: 28px; display: block; margin-bottom: 8px; }
.feature-card strong { display: block; font-size: 14px; color: #fff; margin-bottom: 4px; }
.feature-card p { margin: 0; font-size: 12px; color: #666; }

.team-list { display: flex; flex-direction: column; gap: 12px; }
.team-member {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: #0a0a0a;
  border-radius: 12px;
}
.member-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.team-member strong { display: block; font-size: 14px; color: #fff; }
.team-member p { margin: 2px 0 0; font-size: 12px; color: #666; }

.contacts-list { display: flex; flex-direction: column; gap: 8px; }
.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #0a0a0a;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.contact-item:hover { background: #1a1a1a; }
.contact-item span:first-child { font-size: 22px; }
.contact-label { display: block; font-size: 11px; color: #666; text-transform: uppercase; }
.contact-value { display: block; font-size: 14px; color: #fff; margin-top: 2px; }

.about-footer {
  text-align: center;
  padding: 24px 20px;
  border-top: 1px solid #2a2a2a;
  margin-top: 20px;
}
.about-footer p { margin: 0 0 4px; font-size: 13px; color: #666; }
.about-footer p:last-child { margin: 0; font-size: 11px; color: #444; }
</style>
