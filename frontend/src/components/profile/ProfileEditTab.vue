<template>
  <div class="profile-edit-tab">
    <div class="edit-section">
      <h4>👤 Основная информация</h4>
      <div class="form-grid">
        <div class="form-group">
          <label for="first_name">Имя *</label>
          <input
            id="first_name"
            v-model="form.first_name"
            type="text"
            :class="{ error: errors.first_name }"
            placeholder="Введите ваше имя"
            @input="onFieldUpdate('first_name', $event.target.value)"
          >
          <div v-if="errors.first_name" class="error-message">
            {{ errors.first_name[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="last_name">Фамилия *</label>
          <input
            id="last_name"
            v-model="form.last_name"
            type="text"
            :class="{ error: errors.last_name }"
            placeholder="Введите вашу фамилию"
            @input="onFieldUpdate('last_name', $event.target.value)"
          >
          <div v-if="errors.last_name" class="error-message">
            {{ errors.last_name[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            :class="{ error: errors.username }"
            placeholder="Ваш уникальный никнейм"
            @input="onFieldUpdate('username', $event.target.value)"
          >
          <div v-if="errors.username" class="error-message">
            {{ errors.username[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ error: errors.email }"
            placeholder="example@mail.com"
            @input="onFieldUpdate('email', $event.target.value)"
          >
          <div v-if="errors.email" class="error-message">
            {{ errors.email[0] }}
          </div>
        </div>
      </div>
    </div>

    <div class="edit-section">
      <h4>📞 Контактная информация</h4>
      <div class="form-grid">
        <div class="form-group">
          <label for="phone">Телефон</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            :class="{ error: errors.phone }"
            placeholder="+7 (999) 123-45-67"
            @input="onFieldUpdate('phone', $event.target.value)"
          >
          <div v-if="errors.phone" class="error-message">
            {{ errors.phone[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="city">Город</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            placeholder="Ваш город"
            @input="onFieldUpdate('city', $event.target.value)"
          >
        </div>
      </div>
    </div>

    <div class="edit-section">
      <h4>📝 О себе</h4>
      <div class="form-group">
        <label for="bio">Биография</label>
        <textarea
          id="bio"
          v-model="form.bio"
          :class="{ error: errors.bio }"
          placeholder="Расскажите о себе..."
          rows="4"
          maxlength="200"
          @input="onFieldUpdate('bio', $event.target.value)"
        ></textarea>
        <div class="char-counter">{{ form.bio.length }}/200</div>
        <div v-if="errors.bio" class="error-message">
          {{ errors.bio[0] }}
        </div>
      </div>
    </div>

    <!-- Компонент загрузки аватара -->
    <ProfileAvatarUpload
      :current-avatar="form.photo_url"
      :upload-progress="uploadProgress"
      @avatar-upload="$emit('avatar-upload', $event)"
      @avatar-remove="$emit('avatar-remove')"
    />

    <!-- Компонент уведомлений -->
    <ProfileNotifications
      :notifications="form.notifications"
      @update="$emit('update-field', 'notifications', $event)"
    />

    <!-- Компонент безопасности -->
    <ProfileSecurity
      @password-change="$emit('password-change', $event)"
      @two-factor-toggle="$emit('two-factor-toggle', $event)"
    />

    <div class="form-actions">
      <button
        class="btn btn-secondary"
        :disabled="!hasChanges || isSubmitting"
        @click="$emit('reset')"
      >
        Отменить
      </button>
      <button
        class="btn btn-primary"
        :disabled="!hasChanges || isSubmitting || !isValid"
        @click="$emit('save')"
      >
        <span v-if="isSubmitting" class="loading-spinner-small"></span>
        {{ isSubmitting ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>
    </div>

    <div v-if="hasChanges" class="unsaved-changes-hint">
      ⚠️ У вас есть несохраненные изменения
    </div>
  </div>
</template>

<script>
import ProfileAvatarUpload from './ProfileAvatarUpload.vue'
import ProfileNotifications from './ProfileNotifications.vue'
import ProfileSecurity from './ProfileSecurity.vue'

export default {
  name: 'ProfileEditTab',
  components: {
    ProfileAvatarUpload,
    ProfileNotifications,
    ProfileSecurity
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    hasChanges: {
      type: Boolean,
      default: false
    },
    uploadProgress: {
      type: Number,
      default: 0
    }
  },
  emits: ['update-field', 'save', 'reset', 'avatar-upload', 'avatar-remove', 'password-change', 'two-factor-toggle'],
  computed: {
    isValid() {
      return this.form.first_name && this.form.last_name && 
             !this.errors.first_name && !this.errors.last_name
    }
  },
  methods: {
    onFieldUpdate(field, value) {
      this.$emit('update-field', field, value)
    }
  }
}
</script>

<style scoped>
.profile-edit-tab {
  max-width: 800px;
  margin: 0 auto;
}

.edit-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.edit-section h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
}

.unsaved-changes-hint {
  text-align: center;
  padding: 1rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
  font-weight: 500;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .edit-section {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
