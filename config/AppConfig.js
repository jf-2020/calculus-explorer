/**
 * Application Configuration
 * Central configuration file for the Integration Assistant
 */
const AppConfig = {
    // Application metadata
    name: 'Integral Explorer',
    version: '2.0.0',
    description: 'Interactive calculus integration practice assistant',

    // MathJax configuration
    mathJax: {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
        }
    },

    // Desmos calculator configuration
    desmos: {
        apiKey: 'dcb31709b452b1cf9dc26972add0fda6',
        defaultExpression: 'y=x^2',
        settings: {
            expressions: true,
            settingsMenu: false,
            zoomButtons: true,
            expressionsTopbar: true
        }
    },

    // Answer validation settings
    validation: {
        maxAttempts: 3,
        enablePartialCredit: true,
        enableEquivalentForms: true,
        caseSensitive: false
    },

    // UI settings
    ui: {
        animationDuration: 600,
        autoFocusInput: true,
        enableCelebrations: true,
        enableSounds: false, // For future implementation
        theme: 'light' // For future theme support
    },

    // Integration techniques configuration
    techniques: {
        power: {
            name: 'Power Rule',
            difficulty: 'Easy',
            color: 'success',
            description: 'For polynomial functions and basic powers of x'
        },
        substitution: {
            name: 'U-Substitution',
            difficulty: 'Medium',
            color: 'warning',
            description: 'For composite functions with recognizable derivatives'
        },
        parts: {
            name: 'Integration by Parts',
            difficulty: 'Hard',
            color: 'danger',
            description: 'For products of different function types'
        },
        trig: {
            name: 'Trigonometric Integration',
            difficulty: 'Medium',
            color: 'info',
            description: 'For trigonometric functions and identities'
        },
        partial: {
            name: 'Partial Fractions',
            difficulty: 'Hard',
            color: 'danger',
            description: 'For rational functions'
        }
    },

    // Progress tracking
    progress: {
        steps: {
            analysis: 10,
            hintRevealed: 5,
            stepShown: 15,
            correctAnswer: 100,
            incorrectAttempt: 15
        }
    },

    // Error messages
    messages: {
        errors: {
            noFunction: 'Please enter a function first!',
            noAnswer: 'Please enter your answer first!',
            invalidInput: 'Invalid mathematical expression',
            analysisError: 'Error analyzing function. Please try again.',
            validationError: 'Error validating answer. Please try again.',
            initializationError: 'Failed to initialize application'
        },
        success: {
            correct: '🎉 Excellent work! You solved it correctly!',
            analyzed: 'Function analyzed successfully!',
            hintRevealed: 'Hint revealed - Keep going!',
            stepShown: 'Step revealed - You\'re making progress!'
        },
        info: {
            ready: 'Ready to start',
            analyzing: 'Analyzing function...',
            maxHints: 'No more hints available!',
            maxAttempts: 'Maximum attempts reached',
            allStepsShown: 'All steps shown - Enter your answer!'
        }
    },

    // API endpoints (for future server integration)
    api: {
        baseUrl: '', // Local application for now
        endpoints: {
            analyze: '/api/analyze',
            validate: '/api/validate',
            hints: '/api/hints'
        }
    },

    // Feature flags
    features: {
        enableHints: true,
        enableStepByStep: true,
        enableValidation: true,
        enableGraphing: true,
        enableProgress: true,
        enableCelebrations: true,
        enableAnalytics: false // For future analytics integration
    },

    // Debug settings
    debug: {
        enabled: false, // Set to true for development
        logLevel: 'warn', // 'debug', 'info', 'warn', 'error'
        enableConsoleOutput: true
    }
};

// Freeze the config to prevent modifications
Object.freeze(AppConfig);

// Export for both ES6 modules and global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}

if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
}

export default AppConfig;
