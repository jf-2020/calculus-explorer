/**
 * Main Application Entry Point
 * Initializes and coordinates all MVC components
 */

// Import all modules (this will work when modules are properly loaded)
let IntegrationProblem, AnswerValidator, MathUtils;
let InterfaceView, SolutionView, AnswerView, HintsView;
let IntegrationController;
let AppConfig;

/**
 * Application class that manages the entire integration assistant
 */
class IntegrationAssistant {
    constructor() {
        this.controller = null;
        this.isInitialized = false;
        this.desmosCalculator = null;
    }

    /**
     * Initialize the entire application
     */
    async initialize() {
        try {
            console.log('Initializing Integral Explorer...');

            // Wait for dependencies to load
            await this.waitForDependencies();

            // Initialize MathJax if not already configured
            this.initializeMathJax();

            // Initialize Desmos calculator
            await this.initializeDesmosCalculator();

            // Create model instances
            const problem = new IntegrationProblem();
            const validator = new AnswerValidator();

            // Create view instances
            const interfaceView = new InterfaceView();
            const solutionView = new SolutionView();
            const answerView = new AnswerView();
            const hintsView = new HintsView();

            // Validate views
            if (!this.validateViews(interfaceView, answerView)) {
                throw new Error('Required DOM elements not found');
            }

            // Create and initialize controller
            this.controller = new IntegrationController();
            await this.controller.initialize({
                problem,
                validator,
                interfaceView,
                solutionView,
                answerView,
                hintsView
            });

            // Make utilities globally available
            window.MathUtils = MathUtils;

            this.isInitialized = true;
            console.log('✅ Integral Explorer initialized successfully!');

            // Show welcome message if debug enabled
            if (AppConfig?.debug?.enabled) {
                this.showWelcomeMessage();
            }

        } catch (error) {
            console.error('❌ Failed to initialize Integral Explorer:', error);
            this.showErrorMessage(error.message);
            throw error;
        }
    }

    /**
     * Wait for all dependencies to be loaded
     */
    async waitForDependencies() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds maximum wait
            
            const checkDependencies = () => {
                attempts++;
                
                // Check if all classes are available globally
                if (window.IntegrationProblem && 
                    window.AnswerValidator && 
                    window.MathUtils &&
                    window.InterfaceView && 
                    window.SolutionView && 
                    window.AnswerView && 
                    window.HintsView &&
                    window.IntegrationController &&
                    window.AppConfig) {
                    
                    // Assign to local variables
                    IntegrationProblem = window.IntegrationProblem;
                    AnswerValidator = window.AnswerValidator;
                    MathUtils = window.MathUtils;
                    InterfaceView = window.InterfaceView;
                    SolutionView = window.SolutionView;
                    AnswerView = window.AnswerView;
                    HintsView = window.HintsView;
                    IntegrationController = window.IntegrationController;
                    AppConfig = window.AppConfig;
                    
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Dependencies failed to load within timeout'));
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            
            checkDependencies();
        });
    }

    /**
     * Initialize MathJax with application configuration
     */
    initializeMathJax() {
        if (window.MathJax && AppConfig) {
            // Apply configuration
            Object.assign(window.MathJax, AppConfig.mathJax);
            
            // Trigger re-initialization if MathJax is already loaded
            if (MathJax.startup && MathJax.startup.ready) {
                MathJax.startup.ready();
            }
        }
    }

    /**
     * Initialize Desmos graphing calculator
     */
    async initializeDesmosCalculator() {
        return new Promise((resolve) => {
            const initDesmos = () => {
                if (window.Desmos && window.Desmos.GraphingCalculator) {
                    const calculatorElement = document.getElementById('calculator');
                    if (calculatorElement) {
                        const options = AppConfig?.desmos?.settings || {};
                        this.desmosCalculator = Desmos.GraphingCalculator(calculatorElement, options);
                        
                        // Add default expression
                        const defaultExpr = AppConfig?.desmos?.defaultExpression || 'y=x^2';
                        this.desmosCalculator.setExpression({ 
                            id: 'graph1', 
                            latex: defaultExpr 
                        });
                        
                        console.log('✅ Desmos calculator initialized');
                    }
                }
                resolve();
            };

            // Wait for Desmos to be available
            if (window.Desmos) {
                initDesmos();
            } else {
                // Poll for Desmos availability
                const checkDesmos = () => {
                    if (window.Desmos) {
                        initDesmos();
                    } else {
                        setTimeout(checkDesmos, 100);
                    }
                };
                checkDesmos();
            }
        });
    }

    /**
     * Validate that required view elements exist
     */
    validateViews(interfaceView, answerView) {
        const isInterfaceValid = interfaceView.validateElements();
        const isAnswerValid = answerView.validateElements();
        
        if (!isInterfaceValid) {
            console.error('Interface view validation failed');
        }
        
        if (!isAnswerValid) {
            console.error('Answer view validation failed');
        }
        
        return isInterfaceValid && isAnswerValid;
    }

    /**
     * Show welcome message for debug mode
     */
    showWelcomeMessage() {
        console.log(`
🧮 Welcome to ${AppConfig.name} v${AppConfig.version}!
${AppConfig.description}

🚀 Debug mode is enabled
📊 Current state: ${JSON.stringify(this.controller.getState(), null, 2)}
        `);
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
        errorMessage.style.zIndex = '9999';
        errorMessage.innerHTML = `
            <h6><i class="bi bi-exclamation-triangle-fill me-2"></i>Initialization Error</h6>
            <p class="mb-0">${message}</p>
            <button type="button" class="btn-close float-end" aria-label="Close"></button>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 10000);
        
        // Manual close
        const closeBtn = errorMessage.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => errorMessage.remove());
        }
    }

    /**
     * Update graph with current function
     */
    updateGraph(functionString) {
        if (this.desmosCalculator && functionString) {
            try {
                // Convert function to Desmos format
                const desmosExpression = this.convertToDesmosFormat(functionString);
                
                this.desmosCalculator.setExpression({ 
                    id: 'currentFunction', 
                    latex: `y=${desmosExpression}`,
                    color: '#2563eb'
                });
            } catch (error) {
                console.warn('Failed to update graph:', error);
            }
        }
    }

    /**
     * Convert mathematical function to Desmos format
     */
    convertToDesmosFormat(func) {
        let desmosFunc = func;
        
        // Basic conversions
        desmosFunc = desmosFunc.replace(/\^/g, '^');
        desmosFunc = desmosFunc.replace(/\*/g, '');
        desmosFunc = desmosFunc.replace(/sin/g, '\\sin');
        desmosFunc = desmosFunc.replace(/cos/g, '\\cos');
        desmosFunc = desmosFunc.replace(/tan/g, '\\tan');
        desmosFunc = desmosFunc.replace(/ln/g, '\\ln');
        desmosFunc = desmosFunc.replace(/e\^/g, 'e^');
        
        return desmosFunc;
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            controllerReady: this.controller?.isReady() || false,
            desmosReady: !!this.desmosCalculator,
            mathJaxReady: !!(window.MathJax && MathJax.typesetPromise),
            currentState: this.controller?.getState() || null
        };
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        if (this.controller) {
            this.controller = null;
        }
        
        if (this.desmosCalculator) {
            // Desmos doesn't have a destroy method, but we can clear it
            this.desmosCalculator = null;
        }
        
        this.isInitialized = false;
        console.log('Integral Explorer destroyed');
    }
}

// Global application instance
let app = null;

/**
 * Initialize the application when DOM is ready
 */
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
        return;
    }

    // Wait a bit for all scripts to load
    setTimeout(async () => {
        try {
            app = new IntegrationAssistant();
            await app.initialize();
            
            // Make app globally available for debugging
            window.IntegralExplorer = app;
            
        } catch (error) {
            console.error('Failed to start application:', error);
        }
    }, 500);
}

// Auto-initialize
initializeApp();

// Export for module systems
export default IntegrationAssistant;
