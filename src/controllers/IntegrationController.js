/**
 * Integration Assistant Controller
 * Main controller that coordinates between models and views
 */
class IntegrationController {
    constructor() {
        // Import and initialize models and views
        this.problem = null;
        this.validator = null;
        this.interfaceView = null;
        this.solutionView = null;
        this.answerView = null;
        this.hintsView = null;
        
        // State management
        this.currentStep = 0;
        this.userAttempts = 0;
        this.isInitialized = false;
    }

    /**
     * Initialize the controller with all dependencies
     * @param {Object} dependencies - Object containing all model and view instances
     */
    async initialize(dependencies) {
        try {
            this.problem = dependencies.problem;
            this.validator = dependencies.validator;
            this.interfaceView = dependencies.interfaceView;
            this.solutionView = dependencies.solutionView;
            this.answerView = dependencies.answerView;
            this.hintsView = dependencies.hintsView;
            
            // Validate all dependencies
            if (!this.validateDependencies()) {
                throw new Error('Missing required dependencies');
            }

            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize views
            this.initializeViews();
            
            this.isInitialized = true;
            console.log('Integration Assistant Controller initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Integration Controller:', error);
            throw error;
        }
    }

    /**
     * Validate that all required dependencies are present
     * @returns {boolean} True if all dependencies are valid
     */
    validateDependencies() {
        const required = ['problem', 'validator', 'interfaceView', 'solutionView', 'answerView', 'hintsView'];
        
        return required.every(dep => {
            const exists = !!this[dep];
            if (!exists) {
                console.error(`Missing dependency: ${dep}`);
            }
            return exists;
        });
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Function input events
        const functionInput = document.getElementById('functionInput');
        if (functionInput) {
            functionInput.addEventListener('input', (e) => this.handleFunctionInput(e.target.value));
        }

        // Button events
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.handleAnalyzeFunction());
        }

        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.handleShowHint());
        }

        const stepBtn = document.getElementById('stepBtn');
        if (stepBtn) {
            stepBtn.addEventListener('click', () => this.handleNextStep());
        }

        const checkAnswerBtn = document.getElementById('checkAnswerBtn');
        if (checkAnswerBtn) {
            checkAnswerBtn.addEventListener('click', () => this.handleValidateAnswer());
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        const techniqueSelect = document.getElementById('techniqueSelect');
        if (techniqueSelect) {
            techniqueSelect.addEventListener('change', (e) => this.handleTechniqueChange(e.target.value));
        }

        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.addEventListener('input', (e) => this.handleAnswerInput(e.target.value));
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleValidateAnswer();
                }
            });
        }
    }

    /**
     * Initialize views to their default state
     */
    initializeViews() {
        this.interfaceView.updateProgress(0, 'Ready to start');
        this.interfaceView.updateButtonStates({
            hintBtn: false,
            stepBtn: false
        });
        
        this.answerView.setCheckButtonEnabled(false);
        this.hintsView.updateHintButton(false);
    }

    /**
     * Handle function input changes
     * @param {string} input - The function input
     */
    handleFunctionInput(input) {
        // Update preview using MathUtils
        const latexExpression = window.MathUtils ? 
            window.MathUtils.formatAsIntegral(input) : 
            `\\int ${input || 'f(x)'} \\, dx`;
        
        this.interfaceView.updateFunctionPreview(latexExpression);
        
        // Re-render MathJax
        if (window.MathUtils && window.MathUtils.isMathJaxReady()) {
            const preview = document.getElementById('functionPreview');
            if (preview) {
                window.MathUtils.renderMathJax(preview);
            }
        }
    }

    /**
     * Handle function analysis
     */
    async handleAnalyzeFunction() {
        const functionInput = this.interfaceView.getFunctionInput();
        
        if (!functionInput.trim()) {
            this.interfaceView.showValidationMessage('Please enter a function first!', 'error');
            this.interfaceView.focusFunctionInput();
            return;
        }

        try {
            // Reset state
            this.resetState();
            
            // Set function and analyze
            this.problem.setFunction(functionInput);
            
            // Update UI with analysis results
            this.interfaceView.updateTechniqueSelect(this.problem.technique);
            this.interfaceView.updateButtonStates({
                hintBtn: true,
                stepBtn: true
            });
            
            // Show analysis
            this.solutionView.showAnalysis({
                technique: this.problem.technique,
                description: this.problem.description,
                difficulty: this.problem.difficulty
            });
            
            // Initialize hints
            this.hintsView.initializeHints(this.problem.hints);
            this.hintsView.updateHintButton(true);
            
            // Show answer section
            this.interfaceView.toggleAnswerSection(true);
            this.answerView.setCheckButtonEnabled(true);
            this.answerView.showFormatHint(this.problem.technique);
            
            // Update progress
            this.interfaceView.updateProgress(10, 'Function analyzed - Ready to solve!');
            
        } catch (error) {
            console.error('Error analyzing function:', error);
            this.interfaceView.showValidationMessage('Error analyzing function. Please try again.', 'error');
        }
    }

    /**
     * Handle showing next hint
     */
    handleShowHint() {
        if (!this.problem || !this.problem.isValid()) {
            this.interfaceView.showValidationMessage('Please analyze a function first!', 'error');
            return;
        }

        const hintRevealed = this.hintsView.revealNextHint();
        
        if (hintRevealed) {
            this.hintsView.updateHintButton(this.hintsView.hasMoreHints());
            
            // Update progress slightly
            const currentProgress = Math.min(this.interfaceView.elements.progressBar?.style.width?.replace('%', '') || 10, 30);
            this.interfaceView.updateProgress(currentProgress + 5, 'Hint revealed - Keep going!');
        } else {
            this.interfaceView.showValidationMessage('No more hints available!', 'info');
        }
    }

    /**
     * Handle showing next solution step
     */
    handleNextStep() {
        if (!this.problem || !this.problem.isValid()) {
            this.interfaceView.showValidationMessage('Please analyze a function first!', 'error');
            return;
        }

        if (this.currentStep < this.problem.steps.length) {
            this.solutionView.addStep(this.problem.steps[this.currentStep], this.currentStep + 1);
            this.currentStep++;
            
            // Update progress
            const progressPercentage = Math.min(20 + (this.currentStep / this.problem.steps.length) * 40, 60);
            this.interfaceView.updateProgress(progressPercentage, `Step ${this.currentStep}/${this.problem.steps.length} shown`);
            
            // Disable step button if all steps shown
            if (this.currentStep >= this.problem.steps.length) {
                this.interfaceView.updateButtonStates({ stepBtn: false });
                this.interfaceView.updateProgress(60, 'All steps shown - Enter your answer!');
            }
        }
    }

    /**
     * Handle answer input changes
     * @param {string} input - The answer input
     */
    handleAnswerInput(input) {
        // Update answer preview
        const latexExpression = window.MathUtils ? 
            window.MathUtils.formatAnswerWithConstant(input) : 
            (input ? `${input} + C` : 'Your answer will appear here...');
        
        this.answerView.updateAnswerPreview(`$$${latexExpression}$$`);
        
        // Re-render MathJax
        if (window.MathUtils && window.MathUtils.isMathJaxReady()) {
            const preview = document.getElementById('answerPreview');
            if (preview) {
                window.MathUtils.renderMathJax(preview);
            }
        }
    }

    /**
     * Handle answer validation
     */
    async handleValidateAnswer() {
        if (!this.problem || !this.problem.isValid()) {
            this.interfaceView.showValidationMessage('Please analyze a function first!', 'error');
            return;
        }

        const userAnswer = this.answerView.getAnswerInput();
        
        if (!userAnswer.trim()) {
            this.interfaceView.showValidationMessage('Please enter your answer first!', 'error');
            this.answerView.focusAnswerInput();
            return;
        }

        try {
            this.userAttempts++;
            
            // Validate answer
            const result = this.validator.validateAnswer(
                userAnswer, 
                this.problem.correctAnswer, 
                this.userAttempts
            );
            
            // Show validation result
            this.answerView.showValidation(result);
            
            if (result.isCorrect) {
                // Correct answer
                this.handleCorrectAnswer();
            } else if (this.userAttempts >= this.validator.maxAttempts) {
                // Max attempts reached
                this.handleMaxAttemptsReached();
            } else {
                // Incorrect, but more attempts available
                this.handleIncorrectAnswer(result);
            }

        } catch (error) {
            console.error('Error validating answer:', error);
            this.interfaceView.showValidationMessage('Error validating answer. Please try again.', 'error');
        }
    }

    /**
     * Handle correct answer scenario
     */
    handleCorrectAnswer() {
        this.interfaceView.updateProgress(100, 'Congratulations! Correct answer!');
        this.answerView.setCheckButtonEnabled(false);
        this.answerView.celebrateSuccess();
        
        // Add celebration animation to interface
        this.interfaceView.addAnimation('functionInput', 'bounce');
        
        this.interfaceView.showValidationMessage('🎉 Excellent work! You solved it correctly!', 'success');
    }

    /**
     * Handle maximum attempts reached
     */
    handleMaxAttemptsReached() {
        const correctAnswerLatex = window.MathUtils ? 
            window.MathUtils.convertToLatex(this.problem.correctAnswer) : 
            this.problem.correctAnswer;
            
        this.answerView.showCorrectAnswer(correctAnswerLatex);
        this.answerView.setCheckButtonEnabled(false);
        
        // Re-render MathJax for the correct answer
        if (window.MathUtils && window.MathUtils.isMathJaxReady()) {
            const validationMessage = document.getElementById('validationMessage');
            if (validationMessage) {
                window.MathUtils.renderMathJax(validationMessage);
            }
        }
        
        this.interfaceView.updateProgress(75, 'Solution revealed - Study the approach!');
    }

    /**
     * Handle incorrect answer with more attempts available
     * @param {Object} result - Validation result
     */
    handleIncorrectAnswer(result) {
        const progressPercentage = this.validator.calculateProgress(
            this.userAttempts, 
            false, 
            parseInt(this.interfaceView.elements.progressBar?.style.width?.replace('%', '') || '60')
        );
        
        const progressMessage = this.validator.getProgressMessage(this.userAttempts, false);
        this.interfaceView.updateProgress(progressPercentage, progressMessage);
        
        // Add shake animation to answer input
        this.answerView.addShakeAnimation();
    }

    /**
     * Handle technique selection change
     * @param {string} technique - The selected technique
     */
    handleTechniqueChange(technique) {
        if (this.problem && technique && technique !== this.problem.technique) {
            // Update problem technique (this would regenerate hints and steps)
            this.problem.technique = technique;
            this.problem.generateHints();
            this.problem.generateSteps();
            
            // Reset current progress
            this.currentStep = 0;
            this.solutionView.clearSteps();
            this.hintsView.reset();
            this.hintsView.initializeHints(this.problem.hints);
            this.hintsView.updateHintButton(true);
            
            // Update button states
            this.interfaceView.updateButtonStates({
                stepBtn: true
            });
        }
    }

    /**
     * Handle reset functionality
     */
    handleReset() {
        this.resetState();
        this.resetViews();
        this.interfaceView.focusFunctionInput();
    }

    /**
     * Reset internal state
     */
    resetState() {
        this.currentStep = 0;
        this.userAttempts = 0;
        
        if (this.problem) {
            this.problem.setFunction('');
        }
    }

    /**
     * Reset all views to initial state
     */
    resetViews() {
        this.interfaceView.clearContent();
        this.interfaceView.updateButtonStates({
            hintBtn: false,
            stepBtn: false
        });
        
        this.solutionView.hide();
        this.solutionView.clearSteps();
        
        this.answerView.clearAnswerInput();
        this.answerView.setCheckButtonEnabled(false);
        this.answerView.toggle(false);
        
        this.hintsView.reset();
        
        // Clear function input and preview
        const functionInput = document.getElementById('functionInput');
        if (functionInput) {
            functionInput.value = '';
        }
        
        this.interfaceView.updateFunctionPreview('\\int f(x) \\, dx');
        
        // Re-render MathJax
        if (window.MathUtils && window.MathUtils.isMathJaxReady()) {
            const preview = document.getElementById('functionPreview');
            if (preview) {
                window.MathUtils.renderMathJax(preview);
            }
        }
    }

    /**
     * Get current application state
     * @returns {Object} Current state object
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            currentFunction: this.problem?.functionString || '',
            currentTechnique: this.problem?.technique || '',
            currentStep: this.currentStep,
            userAttempts: this.userAttempts,
            hintsRevealed: this.hintsView?.getRevealedHints() || 0
        };
    }

    /**
     * Check if the controller is ready to use
     * @returns {boolean} True if initialized and ready
     */
    isReady() {
        return this.isInitialized && 
               this.validateDependencies() && 
               this.interfaceView?.validateElements() &&
               this.answerView?.validateElements();
    }
}

export default IntegrationController;
