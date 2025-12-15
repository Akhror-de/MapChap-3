<template>
  <div class="side-panel vercel-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">{{ t('about_title') }}</h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Герой -->
      <div class="about-hero">
        <div class="hero-logo-text">
          <span class="hero-word">MAP</span>
          <span class="hero-word">CHAP</span>
        </div>
        <p class="hero-tagline">{{ t('app_tagline') }}</p>
        <div class="hero-version">
          <span class="version-tag">v3.0.0</span>
          <span class="version-divider">/</span>
          <span class="version-year">2025</span>
        </div>
      </div>

      <!-- О проекте -->
      <div class="section-card">
        <h3 class="section-title">{{ t('about_project') }}</h3>
        <p class="section-desc">{{ t('about_project_desc') }}</p>
      </div>

      <!-- Возможности -->
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <strong>{{ t('about_map') }}</strong>
          <p>{{ t('about_map_desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <strong>{{ t('about_business') }}</strong>
          <p>{{ t('about_business_desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <strong>{{ t('about_notifications') }}</strong>
          <p>{{ t('about_notifications_desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <strong>{{ t('about_verification') }}</strong>
          <p>{{ t('about_verification_desc') }}</p>
        </div>
      </div>

      <!-- Команда -->
      <div class="section-card">
        <h3 class="section-title">{{ t('about_team') }}</h3>
        <div class="team-list">
          <div class="team-member">
            <div class="member-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="member-info">
              <strong>Хабибуллаев Ахрор</strong>
              <p>{{ t('about_founder') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Контакты -->
      <div class="section-card">
        <h3 class="section-title">{{ t('about_contacts') }}</h3>
        <div class="contacts-list">
          <a href="mailto:khabibullaevakhrorjon@gmail.com" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <span class="contact-label">Email</span>
              <span class="contact-value">khabibullaevakhrorjon@gmail.com</span>
            </div>
            <svg class="contact-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
          <a href="tel:+79998214758" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <div>
              <span class="contact-label">{{ t('about_phone') }}</span>
              <span class="contact-value">+7 (999) 821-47-58</span>
            </div>
            <svg class="contact-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
          <a href="https://t.me/mapchap_support" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <div>
              <span class="contact-label">Telegram</span>
              <span class="contact-value">@mapchap_support</span>
            </div>
            <svg class="contact-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Футер -->
      <div class="about-footer">
        <p>{{ t('about_footer') }}</p>
        <p class="copyright">© 2025 MapChap</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useLocale } from '../composables/useLocale'

export default {
  name: 'AboutPanel',
  setup() {
    const uiStore = useUIStore()
    const { t } = useLocale()
    return { closePanel: uiStore.closePanel, t }
  }
}
</script>

<style scoped>
.vercel-panel {
  background: #000;
  border-left: 1px solid #222;
}

.panel-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid #222;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-button:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

.panel-content {
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 65px);
}

.about-hero {
  text-align: center;
  padding: 48px 20px;
  background: linear-gradient(180deg, #111 0%, #000 100%);
  border: 1px solid #222;
  border-radius: 12px;
  margin-bottom: 24px;
}

.hero-logo-text {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.hero-word {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  background: linear-gradient(
    90deg, 
    #ff6b00 0%, 
    #22c55e 25%, 
    #ff6b00 50%, 
    #22c55e 75%, 
    #ff6b00 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-tagline {
  margin: 0 0 20px;
  color: #666;
  font-size: 14px;
}

.hero-version {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.version-tag {
  padding: 4px 10px;
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  color: #888;
  font-size: 12px;
  font-weight: 500;
  font-family: monospace;
}

.version-divider {
  color: #333;
}

.version-year {
  color: #444;
  font-size: 12px;
}

.section-card {
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: border-color 0.15s ease;
}

.section-card:hover {
  border-color: #333;
}

.section-title {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-desc {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.feature-card {
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.15s ease;
}

.feature-card:hover {
  border-color: #333;
  transform: translateY(-2px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #888;
}

.feature-card strong {
  display: block;
  font-size: 13px;
  color: #fff;
  margin-bottom: 4px;
}

.feature-card p {
  margin: 0;
  font-size: 12px;
  color: #555;
  line-height: 1.4;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.team-member:hover {
  border-color: #333;
}

.member-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #222 0%, #111 100%);
  border: 1px solid #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.member-info strong {
  display: block;
  font-size: 14px;
  color: #fff;
}

.member-info p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #555;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s ease;
}

.contact-item:hover {
  background: #161616;
  border-color: #333;
}

.contact-item:hover .contact-arrow {
  transform: translateX(4px);
  color: #fff;
}

.contact-item svg:first-child {
  color: #555;
  flex-shrink: 0;
}

.contact-item div {
  flex: 1;
}

.contact-label {
  display: block;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  display: block;
  font-size: 13px;
  color: #fff;
  margin-top: 2px;
}

.contact-arrow {
  color: #333;
  transition: all 0.15s ease;
}

.about-footer {
  text-align: center;
  padding: 24px 20px;
  border-top: 1px solid #222;
  margin-top: 24px;
}

.about-footer p {
  margin: 0 0 4px;
  font-size: 13px;
  color: #444;
}

.about-footer .copyright {
  font-size: 11px;
  color: #333;
}
</style>
