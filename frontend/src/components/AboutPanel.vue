<template>
  <div class="about-panel" v-if="isVisible">
    <div class="about-overlay" @click="close"></div>
    <div class="about-content">
      <div class="about-header">
        <h2>🗺️ О приложении MapChap</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="about-body">
        <div class="app-info">
          <p class="app-description">
            MapChap - это инновационная платформа для размещения бизнес-объявлений на карте. 
            Мы помогаем бизнесу быть ближе к клиентам, а пользователям - находить нужные услуги быстро и удобно.
          </p>
          
          <div class="creation-date">
            <strong>Дата создания:</strong> 2024 год
          </div>
        </div>

        <div class="team-section">
          <h3>Наша команда</h3>
          
          <div class="team-member">
            <div class="member-avatar">👨‍💼</div>
            <div class="member-info">
              <div class="member-name">Хабибуллаев Ахрор</div>
              <div class="member-role">Основатель и генеральный директор</div>
            </div>
          </div>

          <div class="team-member">
            <div class="member-avatar">👩‍💼</div>
            <div class="member-info">
              <div class="member-name">Яна Владимировна Ивченко</div>
              <div class="member-role">Финансовый директор</div>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <h3>Контакты</h3>
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span class="contact-text">khabibullaevakhrorjon@gmail.com</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span class="contact-text">+7 (999) 821-47-58</span>
          </div>
        </div>

        <div class="version-info">
          <p>Версия 1.0.0</p>
          <p>© 2024 MapChap. Все права защищены.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AboutPanel',
  setup() {
    const isVisible = ref(false)

    const open = () => {
      isVisible.value = true
    }

    const close = () => {
      isVisible.value = false
    }

    return {
      isVisible,
      open,
      close
    }
  }
}
</script>

<style scoped>
.about-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.about-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 16px 16px 0 0;
}

.about-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.about-body {
  padding: 1.5rem;
}

.app-info {
  margin-bottom: 2rem;
}

.app-description {
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
}

.creation-date {
  color: #666;
  font-size: 0.9rem;
}

.team-section {
  margin-bottom: 2rem;
}

.team-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.member-avatar {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.member-role {
  color: #666;
  font-size: 0.9rem;
}

.contact-section {
  margin-bottom: 2rem;
}

.contact-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  font-size: 1.2rem;
  width: 30px;
}

.contact-text {
  color: #555;
  font-family: 'Courier New', monospace;
}

.version-info {
  text-align: center;
  color: #999;
  font-size: 0.8rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.version-info p {
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .about-content {
    width: 95%;
    margin: 1rem;
  }
  
  .about-header h2 {
    font-size: 1.3rem;
  }
  
  .team-member {
    flex-direction: column;
    text-align: center;
  }
}
</style>
