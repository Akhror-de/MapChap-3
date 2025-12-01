<template>
  <div class="profile-stats-tab">
    <!-- Общая статистика -->
    <div class="stats-overview">
      <h4>📊 Общая статистика</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalFavorites || 0 }}</div>
            <div class="stat-label">Избранных мест</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👀</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalViews || 0 }}</div>
            <div class="stat-label">Просмотров</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalComments || 0 }}</div>
            <div class="stat-label">Комментариев</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalReviews || 0 }}</div>
            <div class="stat-label">Отзывов</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.daysActive || 0 }}</div>
            <div class="stat-label">Дней активности</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ completedAchievements.length }}</div>
            <div class="stat-label">Достижений</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Активность по месяцам -->
    <div class="activity-section">
      <h4>📈 Активность за 30 дней</h4>
      <div class="activity-chart">
        <div class="chart-container">
          <div 
            v-for="(day, index) in monthlyActivity" 
            :key="index"
            class="chart-bar"
            :style="{ height: getBarHeight(day.activity) + '%' }"
            :class="{ today: isToday(day.date) }"
            :title="`${formatChartDate(day.date)}: ${day.activity} действий`"
          >
            <div class="bar-value">{{ day.activity }}</div>
          </div>
        </div>
        <div class="chart-labels">
          <span>Начало</span>
          <span>Сегодня</span>
        </div>
      </div>
    </div>

    <!-- Распределение по категориям -->
    <div class="categories-section">
      <h4>🏷️ Распределение по категориям</h4>
      <div class="categories-chart">
        <div class="pie-chart">
          <svg viewBox="0 0 100 100" class="pie-svg">
            <circle 
              v-for="(category, index) in categoryDistribution" 
              :key="category.name"
              :stroke="category.color || getCategoryColor(index)"
              stroke-width="30"
              :stroke-dasharray="getDashArray(category.percentage)"
              stroke-dashoffset="0"
              fill="none"
              r="25"
              cx="50"
              cy="50"
              class="pie-segment"
            />
          </svg>
          <div class="pie-center">
            <div class="pie-total">{{ stats.totalFavorites || 0 }}</div>
            <div class="pie-label">мест</div>
          </div>
        </div>
        
        <div class="categories-legend">
          <div 
            v-for="(category, index) in categoryDistribution" 
            :key="category.name"
            class="legend-item"
          >
            <div class="legend-color" :style="{ background: category.color || getCategoryColor(index) }"></div>
            <div class="legend-name">{{ category.name }}</div>
            <div class="legend-count">{{ category.count }}</div>
            <div class="legend-percentage">{{ category.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Достижения -->
    <div class="achievements-section">
      <h4>🏆 Достижения</h4>
      <div class="achievements-grid">
        <div 
          v-for="achievement in stats.achievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-content">
            <h5 class="achievement-name">{{ achievement.name }}</h5>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: achievement.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ achievement.progress }}%</span>
            </div>
            <div v-if="achievement.unlocked" class="achievement-unlocked">
              🎉 Получено {{ formatDate(achievement.unlockedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Экспорт данных -->
    <div class="export-section">
      <h4>📤 Экспорт данных</h4>
      <div class="export-options">
        <button class="export-btn" @click="exportData('json')">
          <span class="export-icon">📄</span>
          <span class="export-text">Экспорт в JSON</span>
        </button>
        <button class="export-btn" @click="exportData('csv')">
          <span class="export-icon">📊</span>
          <span class="export-text">Экспорт в CSV</span>
        </button>
        <button class="export-btn" @click="exportData('pdf')">
          <span class="export-icon">📋</span>
          <span class="export-text">Экспорт в PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileStatsTab',
  props: {
    stats: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    monthlyActivity() {
      return this.stats.monthlyActivity || []
    },
    categoryDistribution() {
      return this.stats.categoryDistribution || []
    },
    completedAchievements() {
      return (this.stats.achievements || []).filter(a => a.unlocked)
    }
  },
  methods: {
    getBarHeight(activity) {
      const max = Math.max(...this.monthlyActivity.map(d => d.activity))
      return max > 0 ? (activity / max) * 100 : 0
    },
    
    isToday(date) {
      const today = new Date()
      const checkDate = new Date(date)
      return today.toDateString() === checkDate.toDateString()
    },
    
    formatChartDate(date) {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ru-RU')
    },
    
    getCategoryColor(index) {
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']
      return colors[index % colors.length]
    },
    
    getDashArray(percentage) {
      const circumference = 2 * Math.PI * 25
      return `${(percentage / 100) * circumference} ${circumference}`
    },
    
    exportData(format) {
      this.$emit('export-data', { format, stats: this.stats })
    }
  }
}
</script>

<style scoped>
.profile-stats-tab {
  max-width: 1000px;
  margin: 0 auto;
}

.stats-overview {
  margin-bottom: 2rem;
}

.stats-overview h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.activity-section,
.categories-section,
.achievements-section,
.export-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.activity-section h4,
.categories-section h4,
.achievements-section h4,
.export-section h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.activity-chart {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 4px;
  height: 200px;
  margin-bottom: 1rem;
}

.chart-bar {
  flex: 1;
  background: var(--primary);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  background: var(--primary-dark);
}

.chart-bar.today {
  background: #10B981;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.categories-chart {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
}

.pie-chart {
  position: relative;
  width: 150px;
  height: 150px;
}

.pie-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.pie-segment {
  transition: stroke-dasharray 0.3s ease;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.pie-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.categories-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.legend-item:hover {
  background: var(--bg-tertiary);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
}

.legend-count {
  font-weight: 600;
  color: var(--primary);
  min-width: 30px;
  text-align: right;
}

.legend-percentage {
  font-size: 0.9rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.achievement-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  border-color: var(--primary);
  background: linear-gradient(135deg, var(--bg-primary), rgba(59, 130, 246, 0.05));
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.achievement-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.achievement-description {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 35px;
}

.achievement-unlocked {
  font-size: 0.8rem;
  color: #10B981;
  font-weight: 500;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.export-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.export-icon {
  font-size: 2rem;
}

.export-text {
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-chart {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .pie-chart {
    justify-self: center;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .export-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 150px;
  }
}
</style>
