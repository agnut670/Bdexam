/**
 * Quiz Management System
 * Handles quiz initialization, question loading, answer checking, and results
 */

class QuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.timeRemaining = 15 * 60; // 15 minutes in seconds
        this.timerInterval = null;
        this.subject = '';
        this.isQuizCompleted = false;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Get DOM elements
        this.loadingElement = document.getElementById('loading');
        this.quizContentElement = document.getElementById('quiz-content');
        this.resultsContainerElement = document.getElementById('results-container');
        this.questionTextElement = document.getElementById('question-text');
        this.optionsContainerElement = document.getElementById('options-container');
        this.currentQuestionElement = document.getElementById('current-question');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.currentScoreElement = document.getElementById('current-score');
        this.progressFillElement = document.getElementById('progress-fill');
        this.prevBtnElement = document.getElementById('prev-btn');
        this.nextBtnElement = document.getElementById('next-btn');
        this.submitBtnElement = document.getElementById('submit-btn');
        this.restartBtnElement = document.getElementById('restart-btn');
        
        // Results elements
        this.finalScoreElement = document.getElementById('final-score');
        this.totalScoreElement = document.getElementById('total-score');
        this.percentageElement = document.getElementById('percentage');
        this.correctCountElement = document.getElementById('correct-count');
        this.incorrectCountElement = document.getElementById('incorrect-count');
    }

    bindEvents() {
        // Navigation button events
        if (this.prevBtnElement) {
            this.prevBtnElement.addEventListener('click', () => this.previousQuestion());
        }
        
        if (this.nextBtnElement) {
            this.nextBtnElement.addEventListener('click', () => this.nextQuestion());
        }
        
        if (this.submitBtnElement) {
            this.submitBtnElement.addEventListener('click', () => this.submitQuiz());
        }
        
        if (this.restartBtnElement) {
            this.restartBtnElement.addEventListener('click', () => this.restartQuiz());
        }

        // Add review answers functionality
        const reviewBtn = document.getElementById('review-answers-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.showAnswerReview();
            });
        }
    }

    async loadQuestions(subject) {
        try {
            this.subject = subject;
            this.showLoading();
            
            // Load questions from JSON file
            const response = await fetch(`../data/${subject}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load questions: ${response.status}`);
            }
            
            const data = await response.json();
            this.questions = data.questions || [];
            
            if (this.questions.length === 0) {
                throw new Error('No questions found in the data file');
            }
            
            // Shuffle questions for randomization
            this.shuffleArray(this.questions);
            
            // Initialize quiz state
            this.initializeQuizState();
            this.hideLoading();
            this.displayQuestion();
            
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showError('Failed to load quiz questions. Please try again later.');
        }
    }

    initializeQuizState() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.isQuizCompleted = false;
        
        // Update UI elements
        if (this.totalQuestionsElement) {
            this.totalQuestionsElement.textContent = this.questions.length;
        }
        if (this.currentScoreElement) {
            this.currentScoreElement.textContent = this.score;
        }
        
        this.updateNavigationButtons();
        this.updateProgressBar();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        if (this.quizContentElement) {
            this.quizContentElement.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.quizContentElement) {
            this.quizContentElement.style.display = 'block';
        }
    }

    showError(message) {
        if (this.loadingElement) {
            this.loadingElement.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #e53e3e;"></i>
                <p style="color: #e53e3e; margin-top: 1rem;">${message}</p>
                <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            `;
        }
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;

        // Update question text
        if (this.questionTextElement) {
            this.questionTextElement.textContent = question.question;
        }

        // Update current question number
        if (this.currentQuestionElement) {
            this.currentQuestionElement.textContent = this.currentQuestionIndex + 1;
        }

        // Generate options
        this.generateOptions(question);
        
        // Update progress and navigation
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Add fade-in animation
        if (this.quizContentElement) {
            this.quizContentElement.classList.add('fade-in');
            setTimeout(() => {
                this.quizContentElement.classList.remove('fade-in');
            }, 500);
        }
    }

    generateOptions(question) {
        if (!this.optionsContainerElement || !question.options) return;

        this.optionsContainerElement.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.setAttribute('data-index', index);
            
            const label = String.fromCharCode(65 + index); // A, B, C, D
            
            optionElement.innerHTML = `
                <span class="option-label">${label}</span>
                <span class="option-text">${option}</span>
            `;
            
            // Check if this option was previously selected
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            // Add click event listener
            optionElement.addEventListener('click', () => this.selectOption(index));
            
            this.optionsContainerElement.appendChild(optionElement);
        });
    }

    selectOption(optionIndex) {
        if (this.isQuizCompleted) return;

        // Remove previous selection
        const options = this.optionsContainerElement.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        
        // Add selection to clicked option
        const selectedOption = this.optionsContainerElement.querySelector(`[data-index="${optionIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Store user answer
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    updateNavigationButtons() {
        // Previous button
        if (this.prevBtnElement) {
            this.prevBtnElement.disabled = this.currentQuestionIndex === 0;
        }
        
        // Next and Submit buttons
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        
        if (this.nextBtnElement) {
            this.nextBtnElement.style.display = isLastQuestion ? 'none' : 'block';
        }
        
        if (this.submitBtnElement) {
            this.submitBtnElement.style.display = isLastQuestion ? 'block' : 'none';
        }
    }

    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        if (this.progressFillElement) {
            this.progressFillElement.style.width = `${progress}%`;
        }
    }

    calculateScore() {
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            const question = this.questions[index];
            if (question && answer === question.correctAnswer) {
                this.score++;
            }
        });
    }

    submitQuiz() {
        if (!confirm('Are you sure you want to submit the quiz? You cannot change your answers after submission.')) {
            return;
        }
        
        this.isQuizCompleted = true;
        this.calculateScore();
        this.showResults();
        
        // Stop timer
        if (window.timerManager) {
            window.timerManager.stopTimer();
        }
    }

    showResults() {
        // First show the review section with correct/incorrect answers
        this.showAnswerReview();
        
        if (this.quizContentElement) {
            this.quizContentElement.style.display = 'none';
        }
        
        if (this.resultsContainerElement) {
            this.resultsContainerElement.style.display = 'block';
        }
        
        // Update results display
        const totalQuestions = this.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const incorrectCount = totalQuestions - this.score;
        
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = this.score;
        }
        if (this.totalScoreElement) {
            this.totalScoreElement.textContent = totalQuestions;
        }
        if (this.percentageElement) {
            this.percentageElement.textContent = `${percentage}%`;
        }
        if (this.correctCountElement) {
            this.correctCountElement.textContent = this.score;
        }
        if (this.incorrectCountElement) {
            this.incorrectCountElement.textContent = incorrectCount;
        }
        
        // Add animation
        if (this.resultsContainerElement) {
            this.resultsContainerElement.classList.add('fade-in');
        }
    }

    showAnswerReview() {
        // Create answer review section
        const reviewSection = document.createElement('div');
        reviewSection.className = 'answer-review-section';
        reviewSection.innerHTML = `
            <h3><i class="fas fa-clipboard-check"></i> Answer Review</h3>
            <div class="review-questions"></div>
            <div class="review-actions">
                <button id="close-review-btn" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Close Review
                </button>
            </div>
        `;

        // Generate review for each question
        const reviewContainer = reviewSection.querySelector('.review-questions');
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            const questionReview = document.createElement('div');
            questionReview.className = `question-review ${isCorrect ? 'correct' : 'incorrect'}`;
            
            questionReview.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Question ${index + 1}</span>
                    <span class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                        <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <p class="question-text">${question.question}</p>
                <div class="answer-options">
                    ${question.options.map((option, optionIndex) => {
                        let optionClass = 'review-option';
                        let icon = '';
                        
                        if (optionIndex === question.correctAnswer) {
                            optionClass += ' correct-answer';
                            icon = '<i class="fas fa-check"></i>';
                        }
                        
                        if (userAnswer === optionIndex && userAnswer !== question.correctAnswer) {
                            optionClass += ' wrong-answer';
                            icon = '<i class="fas fa-times"></i>';
                        }
                        
                        if (userAnswer === optionIndex && userAnswer === question.correctAnswer) {
                            icon = '<i class="fas fa-check"></i>';
                        }
                        
                        return `
                            <div class="${optionClass}">
                                ${icon}
                                <span class="option-label">${String.fromCharCode(65 + optionIndex)}</span>
                                <span class="option-text">${option}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${question.explanation ? `
                    <div class="explanation">
                        <i class="fas fa-lightbulb"></i>
                        <strong>Explanation:</strong> ${question.explanation}
                    </div>
                ` : ''}
            `;
            
            reviewContainer.appendChild(questionReview);
        });

        // Style the review section
        reviewSection.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
        `;

        // Add styles for review elements
        const reviewStyles = document.createElement('style');
        reviewStyles.textContent = `
            .answer-review-section {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .answer-review-section h3 {
                text-align: center;
                color: #2d3748;
                margin-bottom: 2rem;
                font-size: 1.5rem;
            }
            
            .question-review {
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                background: #f7fafc;
            }
            
            .question-review.correct {
                border-color: #38a169;
                background: #f0fff4;
            }
            
            .question-review.incorrect {
                border-color: #e53e3e;
                background: #fed7d7;
            }
            
            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .question-number {
                font-weight: 600;
                color: #4a5568;
            }
            
            .question-result {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            .question-result.correct {
                background: #c6f6d5;
                color: #22543d;
            }
            
            .question-result.incorrect {
                background: #fed7d7;
                color: #742a2a;
            }
            
            .question-text {
                font-weight: 500;
                margin-bottom: 1rem;
                color: #2d3748;
            }
            
            .answer-options {
                display: grid;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .review-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 6px;
                background: white;
                border: 1px solid #e2e8f0;
            }
            
            .review-option.correct-answer {
                background: #c6f6d5;
                border-color: #38a169;
                color: #22543d;
            }
            
            .review-option.wrong-answer {
                background: #fed7d7;
                border-color: #e53e3e;
                color: #742a2a;
            }
            
            .review-option i {
                width: 16px;
                text-align: center;
            }
            
            .option-label {
                font-weight: 600;
                min-width: 24px;
                text-align: center;
            }
            
            .explanation {
                background: #bee3f8;
                border: 1px solid #63b3ed;
                border-radius: 6px;
                padding: 1rem;
                color: #2a4365;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .explanation i {
                color: #3182ce;
                margin-top: 0.25rem;
            }
            
            .review-actions {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
            }
            
            @media (max-width: 768px) {
                .answer-review-section {
                    padding: 1rem;
                    margin: 10px;
                }
                
                .question-header {
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-start;
                }
                
                .review-option {
                    padding: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .explanation {
                    flex-direction: column;
                    gap: 0.25rem;
                }
            }
        `;
        
        document.head.appendChild(reviewStyles);
        document.body.appendChild(reviewSection);

        // Add close review functionality
        const closeBtn = reviewSection.querySelector('#close-review-btn');
        closeBtn.addEventListener('click', () => {
            reviewSection.remove();
        });

        // Close on backdrop click
        reviewSection.addEventListener('click', (e) => {
            if (e.target === reviewSection) {
                reviewSection.remove();
            }
        });
    }

    restartQuiz() {
        // Reset quiz state
        this.initializeQuizState();
        
        // Show quiz content
        if (this.resultsContainerElement) {
            this.resultsContainerElement.style.display = 'none';
        }
        if (this.quizContentElement) {
            this.quizContentElement.style.display = 'block';
        }
        
        // Restart timer
        if (window.timerManager) {
            window.timerManager.startTimer(15 * 60);
        }
        
        // Display first question
        this.displayQuestion();
    }

    // Public method to handle timer expiration
    handleTimeUp() {
        if (!this.isQuizCompleted) {
            alert('Time is up! Your quiz will be submitted automatically.');
            this.submitQuiz();
        }
    }
}

// Global quiz manager instance
let quizManager = null;

// Initialize quiz function
function initializeQuiz(subject) {
    quizManager = new QuizManager();
    
    // Start timer
    if (window.timerManager) {
        window.timerManager.startTimer(15 * 60, () => {
            if (quizManager) {
                quizManager.handleTimeUp();
            }
        });
    }
    
    // Load questions for the subject
    quizManager.loadQuestions(subject);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizManager, initializeQuiz };
}
