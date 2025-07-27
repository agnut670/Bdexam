/**
 * Timer Management System
 * Handles countdown timer functionality for quiz sessions
 */

class TimerManager {
    constructor() {
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.onTimeUpCallback = null;
        this.timerElement = document.getElementById('timer');
        
        // Warning thresholds
        this.warningTime = 5 * 60; // 5 minutes
        this.criticalTime = 2 * 60; // 2 minutes
        this.hasWarned = false;
        this.hasCriticalWarned = false;
    }

    /**
     * Start the timer with specified duration
     * @param {number} duration - Timer duration in seconds
     * @param {function} onTimeUpCallback - Callback function when timer reaches zero
     */
    startTimer(duration, onTimeUpCallback = null) {
        this.timeRemaining = duration;
        this.onTimeUpCallback = onTimeUpCallback;
        this.isRunning = true;
        this.hasWarned = false;
        this.hasCriticalWarned = false;
        
        this.updateDisplay();
        this.resetTimerStyle();
        
        // Clear any existing interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Start countdown
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
        
        console.log(`Timer started for ${this.formatTime(duration)}`);
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        this.isRunning = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        console.log('Timer stopped');
    }

    /**
     * Pause the timer
     */
    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            console.log('Timer paused');
        }
    }

    /**
     * Resume the timer
     */
    resumeTimer() {
        if (!this.isRunning && this.timeRemaining > 0) {
            this.isRunning = true;
            this.timerInterval = setInterval(() => {
                this.tick();
            }, 1000);
            console.log('Timer resumed');
        }
    }

    /**
     * Handle each timer tick
     */
    tick() {
        if (!this.isRunning) return;
        
        this.timeRemaining--;
        this.updateDisplay();
        this.checkWarnings();
        
        // Check if time is up
        if (this.timeRemaining <= 0) {
            this.handleTimeUp();
        }
    }

    /**
     * Update the timer display
     */
    updateDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = this.formatTime(this.timeRemaining);
        }
        
        // Update style based on remaining time
        this.updateTimerStyle();
    }

    /**
     * Format time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (seconds < 0) seconds = 0;
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Update timer styling based on remaining time
     */
    updateTimerStyle() {
        if (!this.timerElement) return;
        
        const timerDisplay = this.timerElement.closest('.timer-display');
        if (!timerDisplay) return;
        
        // Remove existing classes
        timerDisplay.classList.remove('timer-warning', 'timer-critical');
        
        if (this.timeRemaining <= this.criticalTime) {
            timerDisplay.classList.add('timer-critical');
        } else if (this.timeRemaining <= this.warningTime) {
            timerDisplay.classList.add('timer-warning');
        }
    }

    /**
     * Reset timer styling
     */
    resetTimerStyle() {
        if (!this.timerElement) return;
        
        const timerDisplay = this.timerElement.closest('.timer-display');
        if (timerDisplay) {
            timerDisplay.classList.remove('timer-warning', 'timer-critical');
        }
    }

    /**
     * Check for warning thresholds and show notifications
     */
    checkWarnings() {
        // Critical time warning (2 minutes)
        if (this.timeRemaining <= this.criticalTime && !this.hasCriticalWarned) {
            this.hasCriticalWarned = true;
            this.showTimeWarning('critical', 'Only 2 minutes remaining! Please hurry up.');
            
        // Warning time (5 minutes)
        } else if (this.timeRemaining <= this.warningTime && !this.hasWarned) {
            this.hasWarned = true;
            this.showTimeWarning('warning', '5 minutes remaining. Please manage your time wisely.');
        }
    }

    /**
     * Show time warning notification
     * @param {string} type - Warning type ('warning' or 'critical')
     * @param {string} message - Warning message
     */
    showTimeWarning(type, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `time-notification time-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-clock"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'critical' ? '#fed7d7' : '#fef5e7'};
            color: ${type === 'critical' ? '#c53030' : '#d69e2e'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-weight: 500;
            border-left: 4px solid ${type === 'critical' ? '#c53030' : '#d69e2e'};
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
                padding: 0.25rem;
                border-radius: 4px;
                opacity: 0.7;
            }
            .notification-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.1);
            }
            .time-critical {
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        // Add sound alert for critical warnings
        if (type === 'critical') {
            this.playAlertSound();
        }
    }

    /**
     * Play alert sound (using Web Audio API)
     */
    playAlertSound() {
        try {
            // Create audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create oscillator for beep sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configure sound
            oscillator.frequency.value = 800; // 800 Hz frequency
            oscillator.type = 'sine';
            
            // Configure volume
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            // Play sound
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
        } catch (error) {
            console.log('Audio alert not available:', error);
        }
    }

    /**
     * Handle timer expiration
     */
    handleTimeUp() {
        this.stopTimer();
        this.timeRemaining = 0;
        this.updateDisplay();
        
        // Show time up notification
        this.showTimeUpNotification();
        
        // Call the callback function
        if (this.onTimeUpCallback && typeof this.onTimeUpCallback === 'function') {
            setTimeout(() => {
                this.onTimeUpCallback();
            }, 1000);
        }
        
        console.log('Time is up!');
    }

    /**
     * Show time up notification
     */
    showTimeUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'time-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-stopwatch"></i>
                <div>
                    <h3>Time's Up!</h3>
                    <p>Your quiz will be submitted automatically.</p>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: #2d3748;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            text-align: center;
            border: 3px solid #e53e3e;
            animation: bounceIn 0.5s ease-out;
            min-width: 300px;
        `;
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% {
                    transform: translate(-50%, -50%) scale(0.3);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.05);
                }
                70% {
                    transform: translate(-50%, -50%) scale(0.9);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            .time-up-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .time-up-notification i {
                font-size: 2rem;
                color: #e53e3e;
            }
            .time-up-notification h3 {
                margin: 0 0 0.5rem 0;
                color: #e53e3e;
                font-size: 1.2rem;
            }
            .time-up-notification p {
                margin: 0;
                color: #4a5568;
            }
        `;
        document.head.appendChild(style);
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (backdrop.parentElement) backdrop.remove();
            if (notification.parentElement) notification.remove();
        }, 3000);
    }

    /**
     * Get remaining time in seconds
     * @returns {number} Remaining time in seconds
     */
    getRemainingTime() {
        return this.timeRemaining;
    }

    /**
     * Check if timer is running
     * @returns {boolean} True if timer is running
     */
    isTimerRunning() {
        return this.isRunning;
    }

    /**
     * Add time to the timer
     * @param {number} seconds - Seconds to add
     */
    addTime(seconds) {
        this.timeRemaining += seconds;
        this.updateDisplay();
        console.log(`Added ${seconds} seconds to timer`);
    }

    /**
     * Set timer to specific time
     * @param {number} seconds - Time to set in seconds
     */
    setTime(seconds) {
        this.timeRemaining = seconds;
        this.updateDisplay();
        console.log(`Timer set to ${this.formatTime(seconds)}`);
    }
}

// Create global timer manager instance
window.timerManager = new TimerManager();

// Handle page visibility changes (pause/resume timer when tab is hidden/visible)
document.addEventListener('visibilitychange', function() {
    if (window.timerManager) {
        if (document.hidden) {
            window.timerManager.pauseTimer();
        } else {
            window.timerManager.resumeTimer();
        }
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimerManager };
}
