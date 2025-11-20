<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content blog-modal" @click.stop>
      <!-- Заголовок -->
      <div class="modal-header">
        <h2>📝 Блог MapChap</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Вкладки -->
      <div class="tabs">
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'developers' }"
          @click="activeTab = 'developers'"
        >
          👨‍💼 От разработчиков
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          👥 От пользователей
        </button>
      </div>

      <!-- Содержимое вкладок -->
      <div class="tab-content">
        <!-- Статьи разработчиков -->
        <div v-if="activeTab === 'developers'" class="articles-list">
          <div class="article-card">
            <div class="article-header">
              <div class="article-author">
                <div class="author-avatar">👨‍💼</div>
                <div class="author-info">
                  <strong>Ахрор Хабибуллаев</strong>
                  <span class="article-date">15 января 2024</span>
                </div>
              </div>
            </div>
            
            <h3 class="article-title">MapChap v3.0: Новая эра бизнес-карт</h3>
            <p class="article-excerpt">Рассказываем о главных обновлениях новой версии платформы и наших планах на будущее.</p>
            
            <button class="btn btn-primary">
              Читать полностью
            </button>
          </div>
        </div>

        <!-- Статьи пользователей -->
        <div v-if="activeTab === 'users'" class="articles-list">
          <div class="empty-state">
            <p>Пока нет статей от пользователей</p>
            <p>Будьте первым, кто поделится своим опытом!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

export default {
  name: 'BlogModal',
  setup() {
    const uiStore = useUIStore()
    const { activeModal } = storeToRefs(uiStore)
    const { closeModal } = uiStore

    const is
