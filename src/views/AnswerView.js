/**
 * Answer View
 * Handles answer input, validation display, and feedback
 */
class AnswerView {
    constructor() {
        this.answerSection = document.getElementById('answerSection');
        this.initializeAnswerSection();
    }

    /**
     * Initialize the answer section HTML
     */
    initializeAnswerSection() {
        if (!this.answerSection) return;

        this.answerSection.innerHTML = `
            <div class="mb-3">
                <label for="answerInput" class="form-label">Enter your answer:</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="answerInput" placeholder="e.g., x^3/3, -cos(x), ln|x|">
                    <span class="input-group-text">+ C</span>
                </div>
                <div class="form-text">Don't include the constant of integration - it's added automatically</div>
            </div>
            
            <!-- Answer Preview -->
            <div class="mb-3">
                <div class="preview-section">
                    <h6>Answer Preview:</h6>
                    <div id="answerPreview" class="answer-preview">
                        Your answer will appear here...
                    </div>
                </div>
            </div>
            
            <!-- Validation Buttons -->
            <div class="d-grid gap-2 d-md-flex justify-content-md-center mb-3">
                <button class="btn btn-primary" id="checkAnswerBtn" disabled>
                    <i class="bi bi-check-circle me-1"></i>Check Answer
                </button>
                <button class="btn btn-secondary" id="resetBtn">
                    <i class="bi bi-arrow-clockwise me-1"></i>Reset
                </button>
            </div>
            
            <!-- Answer Validation Area -->
            <div id="validationArea" class="answer-validation" style="display: none;">
                <div id="validationMessage"></div>
            </div>
        `;

        // Cache new elements
        this.answerInput = document.getElementById('answerInput');
        this.answerPreview = document.getElementById('answerPreview');
        this.checkAnswerBtn = document.getElementById('checkAnswerBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.validationArea = document.getElementById('validationArea');
        this.validationMessage = document.getElementById('validationMessage');
    }

    /**
     * Update the answer preview
     * @param {string} latexExpression - The LaTeX expression to display
     */
    updateAnswerPreview(latexExpression) {
        if (this.answerPreview) {
            this.answerPreview.innerHTML = latexExpression;
        }
    }

    /**
     * Show answer validation result
     * @param {Object} result - Validation result
     */
    showValidation(result) {
        if (!this.validationArea || !this.validationMessage) return;

        this.validationArea.style.display = 'block';
        this.validationArea.className = 'answer-validation';

        // Add appropriate styling based on result type
        if (result.isCorrect) {
            this.validationArea.classList.add('correct');
            this.validationMessage.innerHTML = `
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <strong>Correct!</strong> ${result.message}
            `;
        } else if (result.type === 'partial') {
            this.validationArea.classList.add('partial');
            this.validationMessage.innerHTML = `
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                <strong>Partial Credit:</strong> ${result.message}
            `;
        } else {
            this.validationArea.classList.add('incorrect');
            this.validationMessage.innerHTML = `
                <i class="bi bi-x-circle-fill text-danger me-2"></i>
                <strong>Try Again:</strong> ${result.message}
            `;
        }

        // Add shake animation for incorrect answers
        if (!result.isCorrect) {
            this.addShakeAnimation();
        }
    }

    /**
     * Show the correct answer when max attempts reached
     * @param {string} correctAnswer - The correct answer in LaTeX
     */
    showCorrectAnswer(correctAnswer) {
        if (!this.validationArea || !this.validationMessage) return;

        this.validationArea.style.display = 'block';
        this.validationArea.className = 'answer-validation incorrect';
        
        this.validationMessage.innerHTML = `
            <i class="bi bi-info-circle-fill text-info me-2"></i>
            <strong>Maximum attempts reached.</strong><br>
            The correct answer is: <span class="math-inline">$${correctAnswer} + C$</span>
        `;
    }

    /**
     * Clear the validation display
     */
    clearValidation() {
        if (this.validationArea) {
            this.validationArea.style.display = 'none';
            this.validationArea.className = 'answer-validation';
        }
        
        if (this.validationMessage) {
            this.validationMessage.innerHTML = '';
        }
    }

    /**
     * Get the current answer input value
     * @returns {string} The answer input value
     */
    getAnswerInput() {
        return this.answerInput?.value || '';
    }

    /**
     * Clear the answer input
     */
    clearAnswerInput() {
        if (this.answerInput) {
            this.answerInput.value = '';
        }
        
        this.updateAnswerPreview('Your answer will appear here...');
        this.clearValidation();
    }

    /**
     * Enable or disable the check answer button
     * @param {boolean} enabled - Whether to enable the button
     */
    setCheckButtonEnabled(enabled) {
        if (this.checkAnswerBtn) {
            this.checkAnswerBtn.disabled = !enabled;
        }
    }

    /**
     * Focus on the answer input
     */
    focusAnswerInput() {
        if (this.answerInput) {
            this.answerInput.focus();
        }
    }

    /**
     * Add shake animation to the answer input
     */
    addShakeAnimation() {
        if (this.answerInput) {
            this.answerInput.classList.add('shake');
            setTimeout(() => {
                this.answerInput.classList.remove('shake');
            }, 500);
        }
    }

    /**
     * Show success celebration animation
     */
    celebrateSuccess() {
        // Add bounce animation to the validation area
        if (this.validationArea) {
            this.validationArea.classList.add('bounce');
            setTimeout(() => {
                this.validationArea.classList.remove('bounce');
            }, 600);
        }

        // Create confetti effect
        this.showConfetti();
    }

    /**
     * Show confetti animation
     */
    showConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    width: 10px;
                    height: 10px;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: fall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 3000);
            }, i * 100);
        }
    }

    /**
     * Show or hide the answer section
     * @param {boolean} show - Whether to show the section
     */
    toggle(show) {
        if (this.answerSection) {
            this.answerSection.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Show a hint about answer format
     * @param {string} technique - The integration technique
     */
    showFormatHint(technique) {
        const hints = {
            'power': 'For polynomials, your answer will likely contain powers of x',
            'trig': 'Trigonometric integrals often result in other trig functions',
            'substitution': 'The result may look different from the original function',
            'parts': 'Integration by parts often results in a product minus another integral',
            'partial': 'Partial fractions usually result in logarithmic terms'
        };

        const hint = hints[technique];
        if (hint && this.answerInput) {
            this.answerInput.placeholder = hint;
        }
    }

    /**
     * Validate the answer section elements
     * @returns {boolean} True if all elements are present
     */
    validateElements() {
        const requiredElements = ['answerInput', 'answerPreview', 'checkAnswerBtn'];
        
        return requiredElements.every(elementName => {
            const exists = !!this[elementName];
            if (!exists) {
                console.warn(`Required answer element not found: ${elementName}`);
            }
            return exists;
        });
    }
}

export default AnswerView;
