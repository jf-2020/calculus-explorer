/**
 * Simple Browser-Compatible Integration Assistant
 * All components in a single file for maximum compatibility
 */

(function() {
    'use strict';

    // =============================================================================
    // CONFIGURATION
    // =============================================================================
    
    const AppConfig = {
        validation: {
            maxAttempts: 3,
            enablePartialCredit: true
        },
        ui: {
            animationDuration: 600,
            enableCelebrations: true
        },
        techniques: {
            power: { name: 'Power Rule', difficulty: 'Easy' },
            substitution: { name: 'U-Substitution', difficulty: 'Medium' },
            parts: { name: 'Integration by Parts', difficulty: 'Hard' },
            trig: { name: 'Trigonometric Integration', difficulty: 'Medium' },
            partial: { name: 'Partial Fractions', difficulty: 'Hard' }
        }
    };

    // =============================================================================
    // MATH UTILITIES
    // =============================================================================
    
    class MathUtils {
        static convertToLatex(input) {
            if (!input || input.trim() === '') {
                return 'f(x)';
            }

            let latex = input;
            
            // Handle fractions
            latex = latex.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
            latex = latex.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');
            
            // Handle powers
            latex = latex.replace(/\^(\d+)/g, '^{$1}');
            latex = latex.replace(/\^([a-zA-Z]+)/g, '^{$1}');
            
            // Handle multiplication
            latex = latex.replace(/\*/g, '\\cdot ');
            
            // Handle functions
            latex = latex.replace(/sin/g, '\\sin');
            latex = latex.replace(/cos/g, '\\cos');
            latex = latex.replace(/tan/g, '\\tan');
            latex = latex.replace(/ln/g, '\\ln');
            latex = latex.replace(/sqrt/g, '\\sqrt');
            latex = latex.replace(/pi/g, '\\pi');
            latex = latex.replace(/e\^/g, 'e^');
            
            return latex.replace(/\s+/g, ' ').trim();
        }

        static formatAsIntegral(func) {
            if (!func || func.trim() === '') {
                return '\\int f(x) \\, dx';
            }
            const latexFunction = this.convertToLatex(func);
            return `\\int ${latexFunction} \\, dx`;
        }

        static formatAnswerWithConstant(answer) {
            if (!answer || answer.trim() === '') {
                return 'Your answer will appear here...';
            }
            const latexAnswer = this.convertToLatex(answer);
            return `${latexAnswer} + C`;
        }

        static renderMathJax(elements) {
            if (window.MathJax && MathJax.typesetPromise) {
                const elementsArray = Array.isArray(elements) ? elements : [elements];
                MathJax.typesetPromise(elementsArray).catch((err) => {
                    console.warn('MathJax rendering error:', err.message);
                });
            }
        }
    }

    // =============================================================================
    // INTEGRATION PROBLEM MODEL
    // =============================================================================
    
    class IntegrationProblem {
        constructor() {
            this.functionString = '';
            this.technique = '';
            this.difficulty = '';
            this.correctAnswer = '';
            this.description = '';
            this.steps = [];
            this.hints = [];
        }

        setFunction(func) {
            this.functionString = func;
            this.analyze();
        }

        analyze() {
            const analysis = this.determineTechnique(this.functionString);
            this.technique = analysis.technique;
            this.difficulty = analysis.difficulty;
            this.description = analysis.description;
            this.correctAnswer = this.calculateCorrectAnswer(this.functionString, this.technique);
            this.generateHints();
            this.generateSteps();
        }

        determineTechnique(func) {
            const f = func.toLowerCase().replace(/\s/g, '');
            
            if (f.match(/^x\^?\d*$/) || f.match(/^\d*x\^?\d*$/) || f.match(/^[+-]?\d*x?\^?\d*([+-]\d*x?\^?\d*)*$/)) {
                return {
                    technique: 'power',
                    description: 'This is a polynomial function. Use the power rule.',
                    difficulty: 'Easy'
                };
            } else if (f.includes('sin') || f.includes('cos') || f.includes('tan')) {
                return {
                    technique: 'trig',
                    description: 'This contains trigonometric functions.',
                    difficulty: 'Medium'
                };
            } else if (f.includes('e^') || f.includes('ln')) {
                if (f.includes('*')) {
                    return {
                        technique: 'parts',
                        description: 'This looks like it needs integration by parts.',
                        difficulty: 'Hard'
                    };
                } else {
                    return {
                        technique: 'substitution',
                        description: 'This might benefit from u-substitution.',
                        difficulty: 'Medium'
                    };
                }
            } else {
                return {
                    technique: 'substitution',
                    description: 'Try u-substitution or analyze the function structure.',
                    difficulty: 'Medium'
                };
            }
        }

        calculateCorrectAnswer(func, technique) {
            const f = func.toLowerCase().replace(/\s/g, '');
            
            if (technique === 'power') {
                if (f === 'x') return 'x^2/2';
                if (f === 'x^2') return 'x^3/3';
                if (f === 'x^3') return 'x^4/4';
                if (f === '1') return 'x';
                if (f === '2x') return 'x^2';
                if (f === '3x^2') return 'x^3';
            } else if (technique === 'trig') {
                if (f === 'sin(x)') return '-cos(x)';
                if (f === 'cos(x)') return 'sin(x)';
                if (f === 'tan(x)') return '-ln|cos(x)|';
            } else if (f.includes('e^')) {
                if (f === 'e^x') return 'e^x';
                if (f === '2e^x') return '2e^x';
            } else if (f.includes('ln')) {
                if (f === '1/x') return 'ln|x|';
            }
            
            return 'Answer depends on technique used';
        }

        generateHints() {
            this.hints = [];
            
            switch (this.technique) {
                case 'power':
                    this.hints = [
                        "Look at each term in your polynomial. What power of x does each term have?",
                        "Remember: ∫x^n dx = x^(n+1)/(n+1) + C, where n ≠ -1",
                        "Don't forget to add the constant of integration (+C) at the end!"
                    ];
                    break;
                case 'trig':
                    this.hints = [
                        "What are the derivatives of basic trigonometric functions?",
                        "Remember: d/dx[sin(x)] = cos(x) and d/dx[cos(x)] = -sin(x)",
                        "Integration is the reverse of differentiation!"
                    ];
                    break;
                case 'substitution':
                    this.hints = [
                        "Look for a function and its derivative in the integrand.",
                        "Try setting u equal to the inner function.",
                        "Don't forget to substitute back after integrating!"
                    ];
                    break;
                case 'parts':
                    this.hints = [
                        "Use the LIATE rule to choose u: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential",
                        "Remember: ∫u dv = uv - ∫v du",
                        "Choose u to be the function that becomes simpler when differentiated."
                    ];
                    break;
                case 'partial':
                    this.hints = [
                        "Factor the denominator completely.",
                        "Set up partial fractions based on the factors.",
                        "Solve for the unknown coefficients using algebraic methods."
                    ];
                    break;
            }
        }

        generateSteps() {
            this.steps = [];
            
            switch (this.technique) {
                case 'power':
                    this.steps = [
                        `Identify that this is a polynomial function: ${this.functionString}`,
                        "Apply the power rule: ∫x^n dx = x^(n+1)/(n+1) + C",
                        `Calculate the result: ${this.correctAnswer} + C`
                    ];
                    break;
                case 'trig':
                    this.steps = [
                        `Identify the trigonometric function: ${this.functionString}`,
                        "Recall the antiderivatives of basic trig functions",
                        `Apply the integration: ${this.correctAnswer} + C`
                    ];
                    break;
                case 'substitution':
                    this.steps = [
                        `Analyze the function: ${this.functionString}`,
                        "Choose an appropriate substitution u = ...",
                        "Calculate du and substitute",
                        "Integrate with respect to u",
                        "Substitute back to get the final answer"
                    ];
                    break;
                case 'parts':
                    this.steps = [
                        `Identify the product: ${this.functionString}`,
                        "Choose u and dv using LIATE rule",
                        "Calculate du and v",
                        "Apply integration by parts formula",
                        "Simplify to get the final answer"
                    ];
                    break;
            }
        }

        isValid() {
            return this.functionString && this.functionString.trim() !== '';
        }
    }

    // =============================================================================
    // ANSWER VALIDATOR
    // =============================================================================
    
    class AnswerValidator {
        constructor() {
            this.maxAttempts = 3;
        }

        validateAnswer(userAnswer, correctAnswer, attempts = 1) {
            if (!userAnswer || !userAnswer.trim()) {
                return {
                    isValid: false,
                    isCorrect: false,
                    type: 'empty',
                    message: 'Please enter your answer first!',
                    feedback: 'error'
                };
            }

            const result = this.checkAnswer(userAnswer, correctAnswer);
            result.attempts = attempts;
            result.maxAttempts = this.maxAttempts;
            result.hasMoreAttempts = attempts < this.maxAttempts;

            return result;
        }

        checkAnswer(userAnswer, correctAnswer) {
            const normalizedUser = this.normalizeAnswer(userAnswer);
            const normalizedCorrect = this.normalizeAnswer(correctAnswer);
            
            // Check for exact match
            if (normalizedUser === normalizedCorrect) {
                return {
                    isValid: true,
                    isCorrect: true,
                    type: 'exact',
                    message: 'Perfect! Your answer is exactly correct.',
                    feedback: 'success'
                };
            }
            
            // Check for partial credit
            const partialResult = this.checkPartialCredit(normalizedUser, normalizedCorrect);
            if (partialResult.hasPartialCredit) {
                return {
                    isValid: true,
                    isCorrect: false,
                    type: 'partial',
                    message: partialResult.message,
                    feedback: 'warning'
                };
            }
            
            return {
                isValid: true,
                isCorrect: false,
                type: 'incorrect',
                message: 'Not quite right. Check your work and try again!',
                feedback: 'error'
            };
        }

        normalizeAnswer(answer) {
            return answer.toLowerCase()
                .replace(/\s+/g, '')
                .replace(/\+c$/, '')
                .replace(/\+constant$/, '')
                .replace(/\*/g, '')
                .replace(/\^1/g, '');
        }

        checkPartialCredit(user, correct) {
            // Missing constant of integration
            if (user + 'c' === correct || user === correct + 'c') {
                return {
                    hasPartialCredit: true,
                    message: "Almost! Don't forget the constant of integration (+C)."
                };
            }
            
            return { hasPartialCredit: false };
        }
    }

    // =============================================================================
    // MAIN INTEGRATION ASSISTANT
    // =============================================================================
    
    class IntegrationAssistant {
        constructor() {
            this.problem = new IntegrationProblem();
            this.validator = new AnswerValidator();
            this.currentStep = 0;
            this.userAttempts = 0;
            this.revealedHints = 0;
            this.initializeEventListeners();
        }

        initializeEventListeners() {
            // Function input
            const functionInput = document.getElementById('functionInput');
            if (functionInput) {
                functionInput.addEventListener('input', (e) => this.updatePreview(e.target.value));
            }

            // Buttons
            const analyzeBtn = document.getElementById('analyzeBtn');
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', () => this.analyzeFunction());
            }

            const hintBtn = document.getElementById('hintBtn');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => this.showHint());
            }

            const stepBtn = document.getElementById('stepBtn');
            if (stepBtn) {
                stepBtn.addEventListener('click', () => this.nextStep());
            }

            const checkAnswerBtn = document.getElementById('checkAnswerBtn');
            if (checkAnswerBtn) {
                checkAnswerBtn.addEventListener('click', () => this.validateAnswer());
            }

            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.reset());
            }

            const answerInput = document.getElementById('answerInput');
            if (answerInput) {
                answerInput.addEventListener('input', (e) => this.updateAnswerPreview(e.target.value));
                answerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.validateAnswer();
                    }
                });
            }
        }

        updatePreview(input) {
            const preview = document.getElementById('functionPreview');
            if (preview) {
                const latexExpression = MathUtils.formatAsIntegral(input);
                preview.innerHTML = `$$${latexExpression}$$`;
                MathUtils.renderMathJax(preview);
            }
        }

        updateAnswerPreview(input) {
            const preview = document.getElementById('answerPreview');
            if (preview) {
                const latexExpression = MathUtils.formatAnswerWithConstant(input);
                preview.innerHTML = `$$${latexExpression}$$`;
                MathUtils.renderMathJax(preview);
            }
        }

        analyzeFunction() {
            const functionInput = document.getElementById('functionInput');
            const func = functionInput ? functionInput.value.trim() : '';
            
            if (!func) {
                this.showMessage('Please enter a function first!', 'error');
                return;
            }

            // Reset state
            this.currentStep = 0;
            this.userAttempts = 0;
            this.revealedHints = 0;

            // Analyze function
            this.problem.setFunction(func);

            // Update UI
            this.updateTechniqueSelect(this.problem.technique);
            this.updateButtonStates({ hintBtn: true, stepBtn: true });
            this.showAnalysis();
            this.updateProgress(10, 'Function analyzed - Ready to solve!');
            this.showAnswerSection(true);
            this.setCheckButtonEnabled(true);
        }

        showAnalysis() {
            const solutionArea = document.getElementById('solutionArea');
            if (solutionArea) {
                const analysisHTML = `
                    <div class="analysis-result mb-4">
                        <div class="alert alert-info">
                            <h6><i class="bi bi-lightbulb-fill me-2"></i>Function Analysis</h6>
                            <p class="mb-2"><strong>Recommended Technique:</strong> ${this.getTechniqueName(this.problem.technique)}</p>
                            <p class="mb-2"><strong>Difficulty:</strong> 
                                <span class="badge ${this.getDifficultyColor(this.problem.difficulty)}">${this.problem.difficulty}</span>
                            </p>
                            <p class="mb-0"><strong>Approach:</strong> ${this.problem.description}</p>
                        </div>
                    </div>
                    <h6>Step-by-Step Solution:</h6>
                    <div id="steps" class="steps-container"></div>
                `;
                solutionArea.innerHTML = analysisHTML;
                solutionArea.style.display = 'block';
            }
        }

        showHint() {
            if (!this.problem.isValid()) {
                this.showMessage('Please analyze a function first!', 'error');
                return;
            }

            if (this.revealedHints >= this.problem.hints.length) {
                this.showMessage('No more hints available!', 'info');
                return;
            }

            const hintsArea = document.getElementById('hintsArea');
            const hintsAccordion = document.getElementById('hintsAccordion');
            
            if (hintsArea && hintsAccordion) {
                const hintNumber = this.revealedHints + 1;
                const hint = this.problem.hints[this.revealedHints];
                
                const hintHTML = `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="hint${hintNumber}Header">
                            <button class="accordion-button" type="button" 
                                    data-bs-toggle="collapse" data-bs-target="#hint${hintNumber}Collapse" 
                                    aria-expanded="true" aria-controls="hint${hintNumber}Collapse">
                                <i class="bi bi-lightbulb me-2"></i>Hint ${hintNumber}
                            </button>
                        </h2>
                        <div id="hint${hintNumber}Collapse" class="accordion-collapse collapse show" 
                             aria-labelledby="hint${hintNumber}Header" data-bs-parent="#hintsAccordion">
                            <div class="accordion-body">
                                ${hint}
                            </div>
                        </div>
                    </div>
                `;
                
                hintsAccordion.insertAdjacentHTML('beforeend', hintHTML);
                hintsArea.style.display = 'block';
                this.revealedHints++;
                
                // Update hint button
                const hintBtn = document.getElementById('hintBtn');
                if (hintBtn) {
                    if (this.revealedHints >= this.problem.hints.length) {
                        hintBtn.innerHTML = '<i class="bi bi-lightbulb-fill me-1"></i>All Hints Shown';
                        hintBtn.disabled = true;
                    } else {
                        hintBtn.innerHTML = `<i class="bi bi-lightbulb me-1"></i>Get Hint (${this.revealedHints}/${this.problem.hints.length})`;
                    }
                }
            }
        }

        nextStep() {
            if (!this.problem.isValid()) {
                this.showMessage('Please analyze a function first!', 'error');
                return;
            }

            if (this.currentStep < this.problem.steps.length) {
                const steps = document.getElementById('steps');
                if (steps) {
                    const stepHTML = `
                        <div class="step mb-3 p-3 border rounded">
                            <div class="step-header">
                                <strong>Step ${this.currentStep + 1}:</strong>
                            </div>
                            <div class="step-content mt-2">
                                ${this.problem.steps[this.currentStep]}
                            </div>
                        </div>
                    `;
                    steps.insertAdjacentHTML('beforeend', stepHTML);
                    this.currentStep++;
                    
                    // Update progress
                    const progressPercentage = Math.min(20 + (this.currentStep / this.problem.steps.length) * 40, 60);
                    this.updateProgress(progressPercentage, `Step ${this.currentStep}/${this.problem.steps.length} shown`);
                    
                    // Disable button if all steps shown
                    if (this.currentStep >= this.problem.steps.length) {
                        const stepBtn = document.getElementById('stepBtn');
                        if (stepBtn) {
                            stepBtn.disabled = true;
                        }
                        this.updateProgress(60, 'All steps shown - Enter your answer!');
                    }
                }
            }
        }

        validateAnswer() {
            const answerInput = document.getElementById('answerInput');
            const userAnswer = answerInput ? answerInput.value.trim() : '';
            
            if (!userAnswer) {
                this.showMessage('Please enter your answer first!', 'error');
                return;
            }

            this.userAttempts++;
            const result = this.validator.validateAnswer(userAnswer, this.problem.correctAnswer, this.userAttempts);
            
            this.showValidationResult(result);
            
            if (result.isCorrect) {
                this.updateProgress(100, 'Congratulations! Correct answer!');
                this.setCheckButtonEnabled(false);
                this.celebrateSuccess();
            } else if (this.userAttempts >= this.validator.maxAttempts) {
                this.showCorrectAnswer();
                this.setCheckButtonEnabled(false);
            } else {
                const progressPercentage = Math.min(60 + 15, 90);
                this.updateProgress(progressPercentage, `Attempt ${this.userAttempts}/${this.validator.maxAttempts} - Try again!`);
            }
        }

        showValidationResult(result) {
            const validationArea = document.getElementById('validationArea');
            const validationMessage = document.getElementById('validationMessage');
            
            if (validationArea && validationMessage) {
                validationArea.style.display = 'block';
                validationArea.className = 'answer-validation';
                
                if (result.isCorrect) {
                    validationArea.classList.add('correct');
                    validationMessage.innerHTML = `
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        <strong>Correct!</strong> ${result.message}
                    `;
                } else if (result.type === 'partial') {
                    validationArea.classList.add('partial');
                    validationMessage.innerHTML = `
                        <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        <strong>Partial Credit:</strong> ${result.message}
                    `;
                } else {
                    validationArea.classList.add('incorrect');
                    validationMessage.innerHTML = `
                        <i class="bi bi-x-circle-fill text-danger me-2"></i>
                        <strong>Try Again:</strong> ${result.message}
                    `;
                }
            }
        }

        showCorrectAnswer() {
            const validationArea = document.getElementById('validationArea');
            const validationMessage = document.getElementById('validationMessage');
            
            if (validationArea && validationMessage) {
                validationArea.style.display = 'block';
                validationArea.className = 'answer-validation incorrect';
                
                const correctAnswerLatex = MathUtils.convertToLatex(this.problem.correctAnswer);
                validationMessage.innerHTML = `
                    <i class="bi bi-info-circle-fill text-info me-2"></i>
                    <strong>Maximum attempts reached.</strong><br>
                    The correct answer is: <span class="math-inline">$${correctAnswerLatex} + C$</span>
                `;
                
                MathUtils.renderMathJax(validationMessage);
            }
        }

        celebrateSuccess() {
            // Simple celebration - add bounce animation
            const card = document.querySelector('.math-interface .card');
            if (card) {
                card.classList.add('bounce');
                setTimeout(() => {
                    card.classList.remove('bounce');
                }, 600);
            }
            
            // Show confetti
            this.showConfetti();
        }

        showConfetti() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
            
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.style.cssText = `
                        position: fixed;
                        top: -10px;
                        left: ${Math.random() * 100}vw;
                        width: 8px;
                        height: 8px;
                        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 9999;
                        animation: fall 2s linear forwards;
                    `;
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.remove();
                        }
                    }, 2000);
                }, i * 50);
            }
        }

        reset() {
            // Reset all state
            this.currentStep = 0;
            this.userAttempts = 0;
            this.revealedHints = 0;
            this.problem = new IntegrationProblem();
            
            // Reset UI
            const functionInput = document.getElementById('functionInput');
            if (functionInput) {
                functionInput.value = '';
            }
            
            const answerInput = document.getElementById('answerInput');
            if (answerInput) {
                answerInput.value = '';
            }
            
            this.updatePreview('');
            this.updateAnswerPreview('');
            this.updateProgress(0, 'Ready to start');
            this.showAnswerSection(false);
            this.updateButtonStates({ hintBtn: false, stepBtn: false });
            this.setCheckButtonEnabled(false);
            
            // Clear areas
            const solutionArea = document.getElementById('solutionArea');
            if (solutionArea) {
                solutionArea.style.display = 'none';
                solutionArea.innerHTML = '';
            }
            
            const hintsArea = document.getElementById('hintsArea');
            if (hintsArea) {
                hintsArea.style.display = 'none';
                const hintsAccordion = document.getElementById('hintsAccordion');
                if (hintsAccordion) {
                    hintsAccordion.innerHTML = '';
                }
            }
            
            const validationArea = document.getElementById('validationArea');
            if (validationArea) {
                validationArea.style.display = 'none';
                validationArea.className = 'answer-validation';
            }
        }

        // Helper methods
        updateProgress(percentage, text) {
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
            
            if (progressText) {
                progressText.textContent = text;
            }
        }

        updateButtonStates(states) {
            Object.keys(states).forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.disabled = !states[buttonId];
                }
            });
        }

        updateTechniqueSelect(technique) {
            const select = document.getElementById('techniqueSelect');
            if (select) {
                select.value = technique;
            }
        }

        showAnswerSection(show) {
            const answerSection = document.getElementById('answerSection');
            if (answerSection) {
                answerSection.style.display = show ? 'block' : 'none';
            }
        }

        setCheckButtonEnabled(enabled) {
            const checkBtn = document.getElementById('checkAnswerBtn');
            if (checkBtn) {
                checkBtn.disabled = !enabled;
            }
        }

        showMessage(message, type) {
            console.log(`${type.toUpperCase()}: ${message}`);
            // Could add a toast notification here
        }

        getTechniqueName(technique) {
            return AppConfig.techniques[technique]?.name || 'Unknown';
        }

        getDifficultyColor(difficulty) {
            const colors = {
                'Easy': 'bg-success',
                'Medium': 'bg-warning text-dark',
                'Hard': 'bg-danger'
            };
            return colors[difficulty] || 'bg-secondary';
        }
    }

    // =============================================================================
    // INITIALIZATION
    // =============================================================================
    
    // Add CSS animation for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize when ready
    function initializeApp() {
        try {
            console.log('🚀 Initializing Integral Explorer...');
            window.IntegrationAssistant = new IntegrationAssistant();
            console.log('✅ Integral Explorer initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Integral Explorer:', error);
            
            // Show user-friendly error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger m-3';
            errorDiv.innerHTML = `
                <h4>🚫 Initialization Error</h4>
                <p>Failed to initialize the Integration Assistant.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
            `;
            
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
