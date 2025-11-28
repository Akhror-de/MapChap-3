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
          О проекте
        </h2>
      </div>
    </div>

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
          <div class="app-badges">
            <span class="badge production">🚀 Продакшн</span>
            <span class="badge release">🎯 Стабильная версия</span>
          </div>
        </div>

        <!-- Описание проекта -->
        <div class="description-section">
          <h3>О проекте</h3>
          <p>
            <strong>MapChap</strong> - это современная платформа для размещения и поиска бизнес-объявлений 
            на интерактивной карте. Мы создаем экосистему, где бизнес может эффективно привлекать клиентов, 
            а пользователи - находить лучшие предложения рядом с собой.
          </p>
          <div class="mission-vision">
            <div class="mission">
              <h4>🎯 Наша миссия</h4>
              <p>Сделать поиск бизнесов и услуг максимально простым и удобным для каждого пользователя.</p>
            </div>
            <div class="vision">
              <h4>🚀 Наше видение</h4>
              <p>Стать ведущей платформой для бизнес-объявлений в странах СНГ с фокусом на качество и удобство.</p>
            </div>
          </div>
        </div>

        <!-- Ключевые преимущества -->
        <div class="advantages-section">
          <h3>⭐ Почему выбирают MapChap?</h3>
          <div class="advantages-grid">
            <div class="advantage-card">
              <div class="advantage-icon">🎯</div>
              <h4>Точный поиск</h4>
              <p>Находите бизнесы именно там, где вам нужно, с точностью до метра</p>
            </div>
            <div class="advantage-card">
              <div class="advantage-icon">💼</div>
              <h4>Для бизнеса</h4>
              <p>Эффективное продвижение для компаний любого размера</p>
            </div>
            <div class="advantage-card">
              <div class="advantage-icon">📱</div>
              <h4>Удобный интерфейс</h4>
              <p>Простой и интуитивно понятный дизайн для всех пользователей</p>
            </div>
            <div class="advantage-card">
              <div class="advantage-icon">🔄</div>
              <h4>Постоянное развитие</h4>
              <p>Регулярные обновления и улучшения платформы</p>
            </div>
          </div>
        </div>

        <!-- Команда -->
        <div class="team-section">
          <h3>👥 Наша команда</h3>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">👨‍💻</div>
              <div class="member-info">
                <h4>Хабибуллаев Ахрор</h4>
                <p class="member-role">Основатель и CEO</p>
                <p class="member-bio">Идеолог проекта, full-stack разработчик с 3+ годами опыта</p>
              </div>
            </div>
            <div class="team-member">
              <div class="member-avatar">💰</div>
              <div class="member-info">
                <h4>Яна Владимировна Ивченко</h4>
                <p class="member-role">Финансовый директор</p>
                <p class="member-bio">Управление финансами и бизнес-процессами</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Технологии -->
        <div class="tech-section">
          <h3>🛠️ Технологии</h3>
          <div class="tech-stack">
            <div class="tech-category">
              <h5>Frontend</h5>
              <div class="tech-tags">
                <span class="tech-tag">Vue 3</span>
                <span class="tech-tag">Vite</span>
                <span class="tech-tag">Pinia</span>
                <span class="tech-tag">Yandex Maps API</span>
              </div>
            </div>
            <div class="tech-category">
              <h5>Backend</h5>
              <div class="tech-tags">
                <span class="tech-tag">Node.js</span>
                <span class="tech-tag">Express</span>
                <span class="tech-tag">Yandex Database</span>
              </div>
            </div>
            <div class="tech-category">
              <h5>Инфраструктура</h5>
              <div class="tech-tags">
                <span class="tech-tag">Vercel</span>
                <span class="tech-tag">Yandex Cloud</span>
                <span class="tech-tag">Docker</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Контакты -->
        <div class="contacts-section">
          <h3>📞 Контакты</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div class="contact-details">
                <strong>Email для связи</strong>
                <a href="mailto:khabibullaevakhrorjon@gmail.com" class="contact-link">
                  khabibullaevakhrorjon@gmail.com
                </a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <div class="contact-details">
                <strong>Телефон</strong>
                <a href="tel:+79998214758" class="contact-link">
                  +7 (999) 821-47-58
                </a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">💬</span>
              <div class="contact-details">
                <strong>Техническая поддержка</strong>
                <span class="contact-text">Telegram: @mapchap_support</span>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🌐</span>
              <div class="contact-details">
                <strong>Официальный сайт</strong>
                <a href="https://mapchap.com" target="_blank" class="contact-link">
                  mapchap.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Социальные сети -->
        <div class="social-section">
          <h3>🔗 Мы в соцсетях</h3>
          <div class="social-links">
            <a href="https://t.me/mapchap_official" target="_blank" class="social-link telegram">
              <span class="social-icon">📢</span>
              <span class="social-text">Telegram Channel</span>
            </a>
            <a href="https://vk.com/mapchap" target="_blank" class="social-link vk">
              <span class="social-icon">👥</span>
              <span class="social-text">VK Community</span>
            </a>
            <a href="https://github.com/Akhror-de/MapChap-3" target="_blank" class="social-link github">
              <span class="social-icon">💻</span>
              <span class="social-text">GitHub</span>
            </a>
          </div>
        </div>

        <!-- Статистика -->
        <div class="stats-section">
          <h3>📊 Наша статистика</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">1,247+</div>
              <div class="stat-label">Активных пользователей</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">356+</div>
              <div class="stat-label">Зарегистрированных бизнесов</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">15,892+</div>
              <div class="stat-label">Просмотров объявлений</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Поддержка пользователей</div>
            </div>
          </div>
        </div>

        <!-- Партнеры -->
        <div class="partners-section">
          <h3>🤝 Наши партнеры</h3>
          <div class="partners-list">
            <div class="partner-item">
              <span class="partner-icon">🏢</span>
              <span class="partner-name">Малый и средний бизнес</span>
            </div>
            <div class="partner-item">
              <span class="partner-icon">🏪</span>
              <span class="partner-name">Сети магазинов</span>
            </div>
            <div class="partner-item">
              <span class="partner-icon">🍕</span>
              <span class="partner-name">Рестораны и кафе</span>
            </div>
            <div class="partner-item">
              <span class="partner-icon">💄</span>
              <span class="partner-name">Салоны красоты</span>
            </div>
          </div>
        </div>

        <!-- Дорожная карта -->
        <div class="roadmap-section">
          <h3>🗺️ Дорожная карта</h3>
          <div class="roadmap-timeline">
            <div class="roadmap-item completed">
              <div class="timeline-marker">✅</div>
              <div class="timeline-content">
                <h5>Q4 2023 - Запуск MVP</h5>
                <p>Базовая функциональность, карта, поиск, профили</p>
              </div>
            </div>
            <div class="roadmap-item current">
              <div class="timeline-marker">🚀</div>
              <div class="timeline-content">
                <h5>Q1 2024 - MapChap 3.0</h5>
                <p>Полный редизайн, Telegram авторизация, бизнес-панель</p>
              </div>
            </div>
            <div class="roadmap-item upcoming">
              <div class="timeline-marker">📅</div>
              <div class="timeline-content">
                <h5>Q2 2024 - Мобильное приложение</h5>
                <p>Нативные приложения для iOS и Android</p>
              </div>
            </div>
            <div class="roadmap-item upcoming">
              <div class="timeline-marker">📅</div>
              <div class="timeline-content">
                <h5>Q3 2024 - Платежи и бронирования</h5>
                <p>Онлайн-оплаты, система бронирования, отзывы</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="faq-section">
          <h3>❓ Часто задаваемые вопросы</h3>
          <div class="faq-list">
            <div class="faq-item">
              <h5>Как добавить свой бизнес на карту?</h5>
              <p>Зарегистрируйтесь как владелец бизнеса через панель "Для бизнеса", заполните информацию о вашей компании и разместите объявление.</p>
            </div>
            <div class="faq-item">
              <h5>Сколько стоит размещение?</h5>
              <p>Базовое размещение бесплатное. Премиум-функции доступны по подписке.</p>
            </div>
            <div class="faq-item">
              <h5>Как связаться с поддержкой?</h5>
              <p>Напишите нам в Telegram @mapchap_support или на почту khabibullaevakhrorjon@gmail.com</p>
            </div>
          </div>
        </div>

        <!-- Копирайт -->
        <div class="footer-section">
          <div class="legal-info">
            <p>© 2024 MapChap. Все права защищены.</p>
            <p>ООО "МАПЧАП". ИНН: 1234567890</p>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">Пользовательское соглашение</a>
            <a href="#" class="footer-link">Политика конфиденциальности</a>
            <a href="#" class="footer-link">Условия использования</a>
          </div>
          <p class="made-with-love">Сделано с ❤️ для развития бизнеса в России и странах СНГ</p>
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
  margin: 0 0 1rem 0;
}

.app-badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.production {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.badge.release {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.description-section,
.advantages-section,
.team-section,
.tech-section,
.contacts-section,
.social-section,
.stats-section,
.partners-section,
.roadmap-section,
.faq-section {
  margin-bottom: 2rem;
}

.description-section h3,
.advantages-section h3,
.team-section h3,
.tech-section h3,
.contacts-section h3,
.social-section h3,
.stats-section h3,
.partners-section h3,
.roadmap-section h3,
.faq-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.description-section p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.mission, .vision {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.mission h4, .vision h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.advantage-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.advantage-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.advantage-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.advantage-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.team-member {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.member-avatar {
  width: 60px;
  height: 60px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.member-role {
  color: var(--primary);
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.member-bio {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tech-category {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.tech-category h5 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.contact-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
}

.contact-details strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.contact-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-text {
  color: var(--text-secondary);
}

.social-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

.social-icon {
  font-size: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.partners-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.partner-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.partner-icon {
  font-size: 1.5rem;
}

.partner-name {
  font-weight: 500;
  color: var(--text-primary);
}

.roadmap-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.roadmap-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
  z-index: 1;
}

.roadmap-item {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
}

.roadmap-item.completed .timeline-marker {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.roadmap-item.current .timeline-marker {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

.roadmap-item.upcoming .timeline-marker {
  border-color: var(--border-color);
}

.timeline-content {
  flex: 1;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.timeline-content h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.timeline-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.faq-item h5 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.faq-item p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.footer-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.legal-info {
  margin-bottom: 1rem;
}

.legal-info p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.8rem;
}

.footer-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.made-with-love {
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
  font-style: italic;
}

/* Адаптивность */
@media (max-width: 768px) {
  .mission-vision {
    grid-template-columns: 1fr;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .partners-list {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .roadmap-timeline::before {
    left: 15px;
  }
  
  .timeline-marker {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .team-member {
    flex-direction: column;
    text-align: center;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .contact-icon {
    align-self: center;
  }
}
</style>
