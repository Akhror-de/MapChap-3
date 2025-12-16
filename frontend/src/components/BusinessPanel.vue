<template>
  <div class="side-panel vercel-panel">
    <!-- Модальное окно удаления -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showDeleteModal" class="delete-modal-overlay" @click="cancelDelete">
          <div class="delete-modal" @click.stop>
            <div class="modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>{{ t('business_confirm_delete') }}</h3>
            <p>{{ offerToDelete?.title }}</p>
            <p class="modal-hint">{{ t('business_delete_hint') }}</p>
            <div class="modal-actions">
              <button class="btn btn-secondary" @click="cancelDelete">{{ t('cancel') }}</button>
              <button class="btn btn-danger" @click="executeDeleteOffer">{{ t('delete') }}</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="handleBack">
          <span class="back-icon">←</span>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          {{ t('business_title') }}
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('loading') }}</p>
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h3>{{ t('profile_login_required') }}</h3>
        <p>{{ t('profile_login_message') }}</p>
        <button class="btn btn-primary" @click="initAuth">{{ t('profile_login') }}</button>
      </div>

      <!-- Верификация (Шаг 1) -->
      <div v-else-if="!authStore.isBusinessOwner && currentStep === 'verification'" class="verification-section">
        <!-- Хедер -->
        <div class="hero-card">
          <div class="hero-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3>{{ t('business_become_partner') }}</h3>
          <p>{{ t('business_partner_desc') }}</p>
        </div>

        <!-- Индикатор шагов -->
        <div class="steps-indicator">
          <div class="step active">
            <span class="step-num">1</span>
            <span class="step-label">{{ t('business_step1') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">2</span>
            <span class="step-label">{{ t('business_step2') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">3</span>
            <span class="step-label">{{ t('business_step3') }}</span>
          </div>
        </div>

        <!-- Табы верификации -->
        <div class="verification-tabs">
          <button 
            class="tab-btn"
            :class="{ active: verificationMethod === 'inn' }"
            @click="verificationMethod = 'inn'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {{ t('business_verify_inn') }}
          </button>
          <button 
            class="tab-btn"
            :class="{ active: verificationMethod === 'manual' }"
            @click="verificationMethod = 'manual'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {{ t('business_verify_manual') }}
          </button>
        </div>

        <!-- Форма ИНН -->
        <div v-if="verificationMethod === 'inn'" class="section-card">
          <div class="section-title">{{ t('business_inn_check') }}</div>
          <p class="section-description">{{ t('business_inn_desc') }}</p>
          
          <!-- Выбор страны -->
          <div class="form-group">
            <label>{{ t('business_country_label') }}</label>
            <div class="country-btns">
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'RU' }"
                @click="innForm.country = 'RU'"
              >RU · {{ t('business_country_russia') }}</button>
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'KZ' }"
                @click="innForm.country = 'KZ'"
              >KZ · {{ t('business_country_kazakhstan') }}</button>
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'BY' }"
                @click="innForm.country = 'BY'"
              >BY · {{ t('business_country_belarus') }}</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ innForm.country === 'KZ' ? t('business_bin_company') : t('business_inn_label') }}</label>
            <input 
              v-model="innForm.inn"
              type="text" 
              :placeholder="getINNPlaceholder"
              :maxlength="innForm.country === 'KZ' ? 12 : 12"
              @input="validateINN"
            >
            <span v-if="innError" class="field-error">{{ innError }}</span>
          </div>

          <div v-if="innVerificationResult" class="result-card" :class="{ success: innVerificationResult.success }">
            <div v-if="innVerificationResult.success" class="result-success">
              <span class="result-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div>
                <strong>{{ innVerificationResult.verification.name }}</strong>
                <p>{{ innForm.country === 'KZ' ? 'БИН' : 'ИНН' }}: {{ innVerificationResult.verification.inn }}</p>
                <p v-if="innVerificationResult.verification.address">{{ innVerificationResult.verification.address }}</p>
                <p v-if="innVerificationResult.verification.status">{{ t('business_status') }}: {{ innVerificationResult.verification.status }}</p>
              </div>
            </div>
            <div v-else class="result-error">
              <span class="result-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </span>
              <p>{{ innVerificationResult.error }}</p>
            </div>
          </div>

          <button class="btn btn-primary btn-block" @click="verifyByINN" :disabled="isVerifying || !isValidINN">
            {{ isVerifying ? t('loading') : t('business_check') }}
          </button>
          
          <!-- Подсказка для других стран СНГ -->
          <div class="cis-hint">
            <p>{{ t('business_cis_hint') }}</p>
          </div>
        </div>

        <!-- Ручная форма -->
        <div v-if="verificationMethod === 'manual'" class="section-card">
          <div class="section-title">{{ t('business_manual_verification') }}</div>
          
          <div class="form-group">
            <label>{{ t('business_company_name') }} *</label>
            <input v-model="manualForm.company_name" type="text" :placeholder="t('business_company_placeholder')">
          </div>

          <div class="form-group">
            <label>{{ t('business_phone') }} *</label>
            <input v-model="manualForm.phone" type="tel" placeholder="+998 90 123-45-67">
          </div>

          <div class="form-group">
            <label>{{ t('business_email') }} *</label>
            <input v-model="manualForm.email" type="email" placeholder="email@company.com">
          </div>

          <div class="form-group">
            <label>{{ t('business_social') }}</label>
            <div class="social-btns">
              <button 
                class="social-btn"
                :class="{ active: manualForm.social_type === 'telegram' }"
                @click="manualForm.social_type = 'telegram'"
              >TG</button>
              <button 
                class="social-btn"
                :class="{ active: manualForm.social_type === 'instagram' }"
                @click="manualForm.social_type = 'instagram'"
              >IG</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_username') }}</label>
            <input v-model="manualForm.social_username" type="text" placeholder="@username">
          </div>

          <button class="btn btn-primary btn-block" @click="verifyManually" :disabled="isVerifying || !isValidManualForm">
            {{ isVerifying ? t('loading') : t('business_confirm') }}
          </button>
        </div>

        <!-- Преимущества -->
        <div class="benefits-card">
          <div class="benefit-item">
            <span class="benefit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </span>
            <div>
              <strong>{{ t('business_analytics') }}</strong>
              <p>{{ t('business_analytics_desc') }}</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </span>
            <div>
              <strong>{{ t('business_push_notifications') }}</strong>
              <p>{{ t('business_push_desc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 2: После верификации - создание первого объявления -->
      <div v-else-if="authStore.isBusinessOwner && currentStep === 'create-offer'" class="create-offer-section">
        <!-- Индикатор шагов -->
        <div class="steps-indicator">
          <div class="step completed">
            <span class="step-num">✓</span>
            <span class="step-label">{{ t('business_step1') }}</span>
          </div>
          <div class="step-line active"></div>
          <div class="step active">
            <span class="step-num">2</span>
            <span class="step-label">{{ t('business_step2') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">3</span>
            <span class="step-label">{{ t('business_step_done') }}</span>
          </div>
        </div>

        <div class="success-banner">
          <span class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </span>
          <div>
            <strong>{{ t('business_verification_passed') }}</strong>
            <p>{{ t('business_create_first_offer') }}</p>
          </div>
        </div>

        <!-- Форма объявления -->
        <div class="section-card">
          <div class="section-title">{{ t('business_info_about') }}</div>
          
          <div class="form-group">
            <label>{{ t('business_name_label') }} *</label>
            <input v-model="offerForm.title" type="text" :placeholder="t('business_name_placeholder')">
          </div>

          <div class="form-group">
            <label>{{ t('business_offer_category') }} *</label>
            <div class="category-grid">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                class="category-btn"
                :class="{ active: offerForm.category === cat.id }"
                @click="offerForm.category = cat.id"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_short_desc') }} *</label>
            <textarea v-model="offerForm.description" rows="3" :placeholder="t('business_short_desc_placeholder')"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('business_full_desc') }}</label>
            <textarea v-model="offerForm.full_description" rows="5" :placeholder="t('business_full_desc_placeholder')"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('business_offer_address') }} *</label>
            <input v-model="offerForm.address" type="text" placeholder="">
            <span class="field-hint">{{ t('business_address_hint') }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('business_phone') }} *</label>
              <input v-model="offerForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
            </div>
            <div class="form-group">
              <label>{{ t('business_email') }}</label>
              <input v-model="offerForm.email" type="email" placeholder="email@company.com">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('business_website') }}</label>
              <input v-model="offerForm.website" type="url" placeholder="https://example.com">
            </div>
            <div class="form-group">
              <label>{{ t('business_hours') }}</label>
              <input v-model="offerForm.working_hours" type="text" placeholder="">
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_amenities') }}</label>
            <div class="amenities-grid">
              <button 
                v-for="amenity in amenitiesList" 
                :key="amenity.id"
                class="amenity-btn"
                :class="{ active: offerForm.amenities.includes(amenity.id) }"
                @click="toggleAmenity(amenity.id)"
              >
                <span>{{ amenity.icon }}</span>
                <span>{{ getAmenityName(amenity.id) }}</span>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="currentStep = 'dashboard'">{{ t('business_skip') }}</button>
            <button class="btn btn-primary" @click="submitOffer" :disabled="!canSubmitOffer || isSubmitting">
              {{ isSubmitting ? t('loading') : t('business_create_offer') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Бизнес дашборд -->
      <div v-else-if="authStore.isBusinessOwner && currentStep === 'dashboard'" class="business-content">
        <div class="tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">{{ t('business_overview') }}</button>
          <button class="tab-btn" :class="{ active: activeTab === 'offers' }" @click="activeTab = 'offers'">{{ t('business_my_offers') }}</button>
          <button class="tab-btn" :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">{{ t('business_new_offer') }}</button>
        </div>

        <!-- Обзор -->
        <div v-if="activeTab === 'overview'">
          <div class="welcome-card">
            <span v-if="authStore.user?.is_verified" class="verified-badge">{{ t('business_verified_badge') }}</span>
            <h3>{{ t('business_welcome') }}, {{ businessInfo.companyName }}!</h3>
            <p v-if="authStore.user?.inn">ИНН: {{ authStore.user.inn }}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
              <div class="metric-value">{{ businessStats.totalViews }}</div>
              <div class="metric-label">{{ t('business_views') }}</div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </span>
              <div class="metric-value">{{ businessStats.totalLikes }}</div>
              <div class="metric-label">{{ t('business_likes') }}</div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <div class="metric-value">{{ businessStats.activeOffers }}</div>
              <div class="metric-label">{{ t('business_offers') }}</div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <div class="metric-value">{{ businessStats.averageRating || '-' }}</div>
              <div class="metric-label">{{ t('business_rating') }}</div>
            </div>
          </div>

          <div class="quick-actions">
            <button class="action-btn" @click="activeTab = 'create'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ t('business_new_offer_btn') }}
            </button>
            <button class="action-btn" @click="activeTab = 'offers'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              {{ t('business_manage') }}
            </button>
          </div>
        </div>

        <!-- Мои объявления -->
        <div v-if="activeTab === 'offers'">
          <div v-if="userOffers.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h4>{{ t('business_no_offers') }}</h4>
            <p>{{ t('business_create_first') }}</p>
            <button class="btn btn-primary" @click="activeTab = 'create'">{{ t('create') }}</button>
          </div>

          <div v-else class="offers-list">
            <div v-for="offer in userOffers" :key="offer.id" class="offer-card" :class="offer.status">
              <div class="offer-header">
                <h4>{{ offer.title }}</h4>
                <span class="offer-status" :class="offer.status">{{ getStatusText(offer.status) }}</span>
              </div>
              <p class="offer-desc">{{ offer.description }}</p>
              <div class="offer-stats">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ offer.views || 0 }}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {{ offer.likes || 0 }}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ offer.address }}
                </span>
              </div>
              <div class="offer-actions">
                <button class="btn btn-small btn-secondary" @click="editOffer(offer)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {{ t('edit') }}
                </button>
                <button class="btn btn-small" :class="offer.status === 'active' ? 'btn-pause' : 'btn-primary'" @click="handleToggleOfferStatus(offer.id)">
                  <svg v-if="offer.status === 'active'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="btn btn-small btn-danger" @click="confirmDeleteOffer(offer)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Создание -->
        <div v-if="activeTab === 'create'">
          <div class="section-card">
            <div class="section-title">{{ editingOffer ? t('business_editing') : t('business_new_offer_btn') }}</div>
            
            <div class="form-group">
              <label>{{ t('business_name_label') }} *</label>
              <input v-model="offerForm.title" type="text" :placeholder="t('business_name_placeholder')">
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_category') }} *</label>
              <div class="category-grid">
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  class="category-btn"
                  :class="{ active: offerForm.category === cat.id }"
                  @click="offerForm.category = cat.id"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.name }}</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('business_short_desc') }} *</label>
              <textarea v-model="offerForm.description" rows="3" :placeholder="t('business_short_desc_placeholder')"></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('business_full_desc') }}</label>
              <textarea v-model="offerForm.full_description" rows="5" :placeholder="t('business_full_desc_placeholder')"></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_address') }} *</label>
              <input v-model="offerForm.address" type="text" placeholder="">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('business_phone') }} *</label>
                <input v-model="offerForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
              </div>
              <div class="form-group">
                <label>{{ t('business_email') }}</label>
                <input v-model="offerForm.email" type="email" placeholder="email@company.com">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('business_website') }}</label>
                <input v-model="offerForm.website" type="url" placeholder="https://example.com">
              </div>
              <div class="form-group">
                <label>{{ t('business_hours') }}</label>
                <input v-model="offerForm.working_hours" type="text" placeholder="">
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('business_amenities') }}</label>
              <div class="amenities-grid">
                <button 
                  v-for="amenity in amenitiesList" 
                  :key="amenity.id"
                  class="amenity-btn"
                  :class="{ active: offerForm.amenities.includes(amenity.id) }"
                  @click="toggleAmenity(amenity.id)"
                >
                  <span>{{ amenity.icon }}</span>
                  <span>{{ getAmenityName(amenity.id) }}</span>
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button v-if="editingOffer" class="btn btn-secondary" @click="cancelEdit">{{ t('cancel') }}</button>
              <button class="btn btn-primary" :class="{ 'btn-block': !editingOffer }" @click="submitOffer" :disabled="!canSubmitOffer || isSubmitting">
                {{ isSubmitting ? t('loading') : (editingOffer ? t('save') : t('business_publish')) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { apiService } from '../services/api'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useLocale } from '../composables/useLocale'

export default {
  name: 'BusinessPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    const { closePanel, showNotification } = uiStore
    const { getUserOffers } = storeToRefs(businessStore)
    const { t } = useLocale()

    const isLoading = ref(false)
    const activeTab = ref('overview')
    const editingOffer = ref(null)
    const verificationMethod = ref('inn')
    const isVerifying = ref(false)
    const isSubmitting = ref(false)
    const innVerificationResult = ref(null)
    const innError = ref('')
    const currentStep = ref('verification') // verification, create-offer, dashboard
    const categories = ref([])

    const innForm = reactive({ inn: '', country: 'RU' })
    const manualForm = reactive({ company_name: '', phone: '', email: '', social_type: 'telegram', social_username: '' })
    const offerForm = reactive({ 
      title: '', 
      category: '', 
      description: '',
      full_description: '',
      address: '', 
      phone: '', 
      email: '',
      website: '',
      working_hours: '',
      amenities: [],
      lat: 55.751244, 
      lng: 37.618423 
    })

    // Список удобств
    const amenitiesList = [
      { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
      { id: 'parking', name: 'Парковка', icon: '🅿️' },
      { id: 'card_payment', name: 'Оплата картой', icon: '💳' },
      { id: 'delivery', name: 'Доставка', icon: '🚚' },
      { id: 'takeaway', name: 'С собой', icon: '📦' },
      { id: 'wheelchair', name: 'Доступная среда', icon: '♿' },
      { id: 'children', name: 'Детская зона', icon: '👶' },
      { id: 'pet_friendly', name: 'С животными', icon: '🐕' },
      { id: 'ac', name: 'Кондиционер', icon: '❄️' },
      { id: 'outdoor', name: 'Терраса', icon: '🌿' },
      { id: 'reservation', name: 'Бронь', icon: '📅' },
      { id: '24h', name: '24 часа', icon: '🕐' }
    ]

    const userOffers = computed(() => getUserOffers.value)
    const businessInfo = computed(() => ({ 
      companyName: authStore.user?.company_name || authStore.user?.first_name || 'Бизнес' 
    }))
    
    const businessStats = computed(() => {
      const offers = userOffers.value
      return {
        totalViews: offers.reduce((s, o) => s + (o.views || 0), 0),
        totalLikes: offers.reduce((s, o) => s + (o.likes || 0), 0),
        activeOffers: offers.filter(o => o.status === 'active').length,
        averageRating: null
      }
    })

    const isValidINN = computed(() => { 
      const inn = innForm.inn.replace(/\D/g, '')
      if (innForm.country === 'KZ') {
        // Казахстан: БИН 12 цифр
        return inn.length === 12
      } else if (innForm.country === 'BY') {
        // Беларусь: УНП 9 цифр
        return inn.length === 9
      } else {
        // Россия: ИНН 10 или 12 цифр
        return inn.length === 10 || inn.length === 12
      }
    })
    
    const getINNPlaceholder = computed(() => {
      if (innForm.country === 'KZ') return t('business_inn_kz_placeholder')
      if (innForm.country === 'BY') return t('business_inn_by_placeholder')
      return t('business_inn_placeholder')
    })
    
    const isValidManualForm = computed(() => 
      manualForm.company_name.length >= 2 && 
      manualForm.phone.length >= 10 && 
      manualForm.email.includes('@')
    )
    
    const canSubmitOffer = computed(() => 
      offerForm.title && 
      offerForm.category && 
      offerForm.description && 
      offerForm.address && 
      offerForm.phone
    )

    const initAuth = () => authStore.initTelegramAuth()
    
    const handleBack = () => {
      if (currentStep.value === 'create-offer') {
        currentStep.value = 'dashboard'
      } else {
        closePanel()
      }
    }

    const loadCategories = async () => {
      try {
        const result = await apiService.getCategories()
        categories.value = result.categories || []
      } catch (e) {
        console.log('Categories load error:', e)
        categories.value = businessStore.categories
      }
    }
    
    const validateINN = () => { 
      innForm.inn = innForm.inn.replace(/\D/g, '')
      
      let errorMsg = ''
      const inn = innForm.inn
      
      if (inn.length > 0 && !isValidINN.value) {
        if (innForm.country === 'KZ') {
          errorMsg = 'БИН должен содержать 12 цифр'
        } else if (innForm.country === 'BY') {
          errorMsg = 'УНП должен содержать 9 цифр'
        } else {
          errorMsg = 'ИНН должен содержать 10 или 12 цифр'
        }
      }
      
      innError.value = errorMsg
      innVerificationResult.value = null 
    }
    
    const verifyByINN = async () => {
      if (!isValidINN.value) return
      isVerifying.value = true
      innVerificationResult.value = null
      
      try {
        const result = await apiService.verifyByINN(authStore.user.telegram_id, innForm.inn)
        innVerificationResult.value = result
        
        if (result.success) {
          // Обновляем данные пользователя локально
          await authStore.registerAsBusiness({
            companyName: result.verification.name,
            inn: result.verification.inn,
            verificationType: 'inn'
          })
          
          // Пытаемся синхронизировать с сервером (не критично если не получится)
          await authStore.fetchUser()
          
          showNotification('✅ Верификация пройдена!', 'success')
          
          // Переходим к созданию объявления
          setTimeout(() => {
            currentStep.value = 'create-offer'
            // Заполняем адрес из данных DaData
            if (result.verification?.address) {
              offerForm.address = result.verification.address
            }
          }, 1500)
        }
      } catch (e) {
        innVerificationResult.value = { success: false, error: e.message || 'Ошибка проверки ИНН' }
        showNotification('❌ ' + (e.message || 'Ошибка проверки'), 'error')
      } finally { 
        isVerifying.value = false 
      }
    }

    const verifyManually = async () => {
      if (!isValidManualForm.value) return
      isVerifying.value = true
      
      try {
        await apiService.verifyManually(authStore.user.telegram_id, manualForm)
        await authStore.fetchUser()
        showNotification('✅ Бизнес-аккаунт активирован!', 'success')
        
        setTimeout(() => {
          currentStep.value = 'create-offer'
        }, 1500)
      } catch (e) { 
        showNotification('❌ ' + (e.message || 'Ошибка'), 'error') 
      } finally { 
        isVerifying.value = false 
      }
    }

    const toggleAmenity = (id) => {
      const idx = offerForm.amenities.indexOf(id)
      if (idx > -1) {
        offerForm.amenities.splice(idx, 1)
      } else {
        offerForm.amenities.push(id)
      }
    }

    const getAmenityName = (id) => {
      const names = {
        wifi: t('amenity_wifi'),
        parking: t('amenity_parking'),
        card_payment: t('amenity_card_payment'),
        delivery: t('amenity_delivery'),
        takeaway: t('amenity_takeaway'),
        wheelchair: t('amenity_wheelchair'),
        children: t('amenity_children'),
        pet_friendly: t('amenity_pet_friendly'),
        ac: t('amenity_ac'),
        outdoor: t('amenity_outdoor'),
        reservation: t('amenity_reservation'),
        '24h': t('amenity_24h')
      }
      return names[id] || id
    }

    const getStatusText = (s) => {
      const statuses = { 
        active: t('business_offer_active'), 
        paused: t('business_offer_paused') 
      }
      return statuses[s] || s
    }
    
    const submitOffer = async () => {
      if (!canSubmitOffer.value || isSubmitting.value) return
      
      isSubmitting.value = true
      try {
        const data = { 
          ...offerForm, 
          coordinates: [offerForm.lat, offerForm.lng],
          inn: authStore.user?.inn || null
        }
        
        if (editingOffer.value) {
          await businessStore.updateOffer(editingOffer.value.id, data)
          showNotification('✅ Объявление обновлено', 'success')
        } else {
          await businessStore.createOffer(data)
          showNotification('🎉 Объявление опубликовано!', 'success')
        }
        
        resetForm()
        currentStep.value = 'dashboard'
        activeTab.value = 'offers'
      } catch (e) { 
        showNotification('❌ ' + (e.message || 'Ошибка'), 'error') 
      } finally {
        isSubmitting.value = false
      }
    }

    const editOffer = (o) => { 
      editingOffer.value = o
      Object.assign(offerForm, {
        title: o.title || '',
        category: o.category || '',
        description: o.description || '',
        full_description: o.full_description || '',
        address: o.address || '',
        phone: o.phone || '',
        email: o.email || '',
        website: o.website || '',
        working_hours: o.working_hours || '',
        price_level: o.price_level || 'medium',
        amenities: o.amenities || [],
        lat: o.coordinates?.[0] || 55.751244,
        lng: o.coordinates?.[1] || 37.618423
      })
      activeTab.value = 'create' 
    }
    
    const cancelEdit = () => { 
      editingOffer.value = null
      resetForm()
      activeTab.value = 'offers' 
    }
    
    const handleToggleOfferStatus = async (id) => { 
      await businessStore.toggleOfferStatus(id)
      showNotification('✅ Статус изменен', 'success') 
    }
    
    const handleDeleteOffer = async (id) => {
      if (confirm(t('business_confirm_delete'))) {
        try {
          await businessStore.deleteOffer(id)
          showNotification(t('business_offer_deleted'), 'success')
        } catch (e) {
          showNotification(t('error'), 'error')
        }
      }
    }

    const offerToDelete = ref(null)
    const showDeleteModal = ref(false)

    const confirmDeleteOffer = (offer) => {
      offerToDelete.value = offer
      showDeleteModal.value = true
    }

    const executeDeleteOffer = async () => {
      if (!offerToDelete.value) return
      try {
        await businessStore.deleteOffer(offerToDelete.value.id)
        showNotification(t('business_offer_deleted'), 'success')
      } catch (e) {
        showNotification(t('error'), 'error')
      } finally {
        showDeleteModal.value = false
        offerToDelete.value = null
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      offerToDelete.value = null
    }
    
    const resetForm = () => { 
      editingOffer.value = null
      Object.assign(offerForm, { 
        title: '', 
        category: '', 
        description: '',
        full_description: '',
        address: '', 
        phone: '', 
        email: '',
        website: '',
        working_hours: '',
        amenities: [],
        lat: 55.751244, 
        lng: 37.618423 
      }) 
    }
    
    // Определяем начальный шаг
    watch(() => authStore.isBusinessOwner, (isBusiness) => {
      if (isBusiness) {
        currentStep.value = 'dashboard'
        businessStore.loadUserOffers()
      } else {
        currentStep.value = 'verification'
      }
    }, { immediate: true })

    onMounted(() => {
      loadCategories()
    })

    return { 
      authStore, businessStore, isLoading, activeTab, editingOffer, verificationMethod, 
      isVerifying, isSubmitting, innVerificationResult, innError, innForm, manualForm, offerForm, 
      userOffers, businessInfo, businessStats, isValidINN, isValidManualForm, canSubmitOffer, 
      categories, amenitiesList, currentStep, getINNPlaceholder,
      closePanel, handleBack, initAuth, validateINN, verifyByINN, verifyManually, 
      submitOffer, editOffer, cancelEdit, handleToggleOfferStatus, handleDeleteOffer, 
      getStatusText, toggleAmenity, getAmenityName, t,
      showDeleteModal, offerToDelete, confirmDeleteOffer, executeDeleteOffer, cancelDelete
    }
  }
}
</script>

<style scoped>
/* Vercel style panel */
.vercel-panel {
  background: #000;
  border-left: 1px solid #222;
}

/* Delete Modal */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.delete-modal {
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 32px;
  max-width: 360px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  color: #ee5050;
  margin-bottom: 16px;
}

.delete-modal h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #fff;
}

.delete-modal p {
  margin: 0 0 4px;
  font-size: 14px;
  color: #888;
}

.modal-hint {
  font-size: 12px !important;
  color: #555 !important;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions .btn {
  flex: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .delete-modal,
.modal-leave-to .delete-modal {
  transform: scale(0.95);
}

.verification-section, .create-offer-section { padding: 0; }

/* Steps indicator */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #141414;
  border-radius: 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: #2a2a2a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.step.active .step-num {
  background: #fff;
  color: #000;
}

.step.completed .step-num {
  background: #fff;
  color: #000;
}

.step-label {
  font-size: 11px;
  color: #666;
}

.step.active .step-label,
.step.completed .step-label {
  color: #fff;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #2a2a2a;
  margin: 0 8px;
}

.step-line.active {
  background: #fff;
}

/* Success banner */
.success-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  margin-bottom: 16px;
}

.success-icon {
  font-size: 32px;
}

.success-banner strong {
  color: #22c55e;
  display: block;
  margin-bottom: 2px;
}

.success-banner p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

/* Hero card */
.hero-card {
  text-align: center;
  padding: 32px 20px;
  background: #fff;
  border-radius: 20px;
  margin-bottom: 20px;
}
.hero-icon { margin-bottom: 12px; color: #000; }
.hero-card h3 { margin: 0 0 8px; font-size: 22px; color: #000; }
.hero-card p { margin: 0; opacity: 0.7; color: #000; }

/* Tabs */
.verification-tabs, .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  color: #888;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #fff;
  border-color: #fff;
  color: #000;
}
.tab-btn:hover:not(.active) { background: #1a1a1a; color: #fff; }

/* Form */
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: #888; font-weight: 500; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 12px 14px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #fff;
}
.form-group textarea { resize: vertical; min-height: 80px; }
.field-error { display: block; margin-top: 4px; color: #ff4444; font-size: 12px; }
.field-hint { display: block; margin-top: 4px; color: #666; font-size: 12px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Category grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover { background: #1a1a1a; }
.category-btn.active { background: #fff; border-color: #fff; }
.category-btn.active .cat-name { color: #000; }
.cat-icon { font-size: 20px; }
.cat-name { font-size: 10px; color: #888; text-align: center; }

/* Amenities grid */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.amenity-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.amenity-btn:hover { background: #1a1a1a; color: #fff; }
.amenity-btn.active { background: #fff; border-color: #fff; color: #000; }

/* Social buttons */
.social-btns { display: flex; gap: 8px; }

/* Country buttons */
.country-btns {
  display: flex;
  gap: 8px;
}

.country-btn {
  flex: 1;
  padding: 10px 8px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.country-btn:hover { 
  background: #1a1a1a; 
  color: #fff; 
}

.country-btn.active { 
  background: #fff; 
  border-color: #fff; 
  color: #000; 
}

/* CIS hint */
.cis-hint {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 10px;
}

.cis-hint p {
  margin: 0;
  font-size: 12px;
  color: #888;
  text-align: center;
}

.cis-hint strong {
  color: #fff;
}
.social-btn {
  flex: 1;
  padding: 10px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.social-btn.active { background: #fff; border-color: #fff; color: #000; }

/* Result card */
.result-card {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
}
.result-card.success { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }
.result-success, .result-error { display: flex; align-items: flex-start; gap: 12px; }
.result-icon { font-size: 24px; }
.result-success strong { color: #22c55e; display: block; margin-bottom: 4px; }
.result-success p, .result-error p { margin: 2px 0; color: #888; font-size: 13px; }

/* Benefits */
.benefits-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 16px;
}
.benefit-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #2a2a2a; }
.benefit-item:last-child { border-bottom: none; }
.benefit-icon { font-size: 24px; }
.benefit-item strong { color: #fff; font-size: 14px; }
.benefit-item p { margin: 2px 0 0; color: #666; font-size: 12px; }

/* Welcome card */
.welcome-card {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 16px;
  color: #fff;
}
.verified-badge { display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; margin-bottom: 8px; }
.welcome-card h3 { margin: 0; font-size: 18px; }
.welcome-card p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }

/* Metrics */
.metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
.metric-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
}
.metric-card.orange { border-color: rgba(255, 107, 0, 0.3); }
.metric-icon { font-size: 20px; }
.metric-value { font-size: 24px; font-weight: 700; color: #fff; margin: 4px 0; }
.metric-label { font-size: 12px; color: #666; }

/* Quick actions */
.quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover { background: #1a1a1a; color: #fff; border-color: #ff6b00; }
.action-btn span { font-size: 20px; }

/* Offers list */
.offers-list { display: flex; flex-direction: column; gap: 12px; }
.offer-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
}
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.offer-header h4 { margin: 0; font-size: 15px; color: #fff; }
.offer-status { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
.offer-status.active { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.offer-status.paused { background: rgba(255, 165, 0, 0.15); color: #ffa500; }
.offer-desc { margin: 0 0 12px; font-size: 13px; color: #666; }
.offer-stats { display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #888; }
.offer-actions { display: flex; gap: 8px; }

/* Form actions */
.form-actions { display: flex; gap: 12px; margin-top: 20px; }
.form-actions .btn { flex: 1; }

/* Section card */
.section-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.section-title { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.section-description { font-size: 13px; color: #666; margin: 0 0 16px; }

/* Buttons - Vercel style */
.btn {
  padding: 10px 16px;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #0a0a0a;
  color: #888;
}

.btn:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.btn-primary {
  background: #fff;
  border-color: #fff;
  color: #000;
}

.btn-primary:hover {
  background: #e0e0e0;
  border-color: #e0e0e0;
}

.btn-secondary {
  background: transparent;
  border-color: #333;
  color: #888;
}

.btn-secondary:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.btn-danger { 
  background: transparent;
  border-color: #ee5050;
  color: #ee5050;
}

.btn-danger:hover {
  background: rgba(238, 80, 80, 0.1);
}

.btn-pause {
  background: transparent;
  border-color: #f5a623;
  color: #f5a623;
}

.btn-pause:hover {
  background: rgba(245, 166, 35, 0.1);
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
}

.btn-block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
