<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--glass-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  background: var(--primary-gradient);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.profile-section {
  text-align: center;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  box-shadow: var(--shadow-lg);
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  margin: 0;
  color: var(--text-secondary);
}

.section {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background: var(--bg-tertiary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.category-tag:hover {
  background: var(--accent-color);
  color: white;
  transform: translateY(-1px);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.favorite-item:hover {
  background: var(--bg-secondary);
  transform: translateX(5px);
}

.favorite-icon {
  font-size: 1.2rem;
}

.favorite-text {
  flex: 1;
  color: var(--text-primary);
}

.modal-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
