/**
 * Main Interface View
 * Handles the main UI components and their updates
 */
class InterfaceView {
    constructor() {
        this.elements = this.initializeElements();
        this.setupEventDelegation();
    }

    /**
     * Initialize and cache DOM elements
     * @returns {Object} Object containing cached DOM elements
     */
    initializeElements() {
        return {
            functionInput: document.getElementById('functionInput'),
            functionPreview: document.getElementById('functionPreview'),
            techniqueSelect: document.getElementById('techniqueSelect'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            hintBtn: document.getElementById('hintBtn'),
            stepBtn: document.getElementById('stepBtn'),
            progressBar: document.getElementById('progressBar'),
            progressText: document.getElementById('progressText'),
            solutionArea: document.getElementById('solutionArea'),
            steps: document.getElementById('steps'),
            answerSection: document.getElementById('answerSection'),
            hintsArea: document.getElementById('hintsArea'),
            hintsAccordion: document.getElementById('hintsAccordion')
        };
    }

    /**
     * Setup event delegation for dynamic content
     */
    setupEventDelegation() {
        // Event delegation will be handled by the controller
        // This method is here for future enhancements
    }

    /**
     * Update the function preview
     * @param {string} latexExpression - The LaTeX expression to display
     */
    updateFunctionPreview(latexExpression) {
        if (this.elements.functionPreview) {
            this.elements.functionPreview.innerHTML = `$$${latexExpression}$$`;
        }
    }

    /**
     * Update the progress bar and text
     * @param {number} percentage - Progress percentage (0-100)
     * @param {string} text - Progress text
     */
    updateProgress(percentage, text) {
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percentage}%`;
            this.elements.progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = text;
        }
    }

    /**
     * Show or hide the solution area
     * @param {boolean} show - Whether to show the area
     */
    toggleSolutionArea(show) {
        if (this.elements.solutionArea) {
            this.elements.solutionArea.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Show or hide the answer section
     * @param {boolean} show - Whether to show the section
     */
    toggleAnswerSection(show) {
        if (this.elements.answerSection) {
            this.elements.answerSection.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Show or hide the hints area
     * @param {boolean} show - Whether to show the area
     */
    toggleHintsArea(show) {
        if (this.elements.hintsArea) {
            this.elements.hintsArea.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Enable or disable buttons
     * @param {Object} buttonStates - Object with button names and their enabled states
     */
    updateButtonStates(buttonStates) {
        Object.keys(buttonStates).forEach(buttonName => {
            const element = this.elements[buttonName];
            if (element) {
                element.disabled = !buttonStates[buttonName];
            }
        });
    }

    /**
     * Update the technique selector
     * @param {string} technique - The selected technique
     */
    updateTechniqueSelect(technique) {
        if (this.elements.techniqueSelect) {
            this.elements.techniqueSelect.value = technique;
        }
    }

    /**
     * Clear all dynamic content
     */
    clearContent() {
        if (this.elements.steps) {
            this.elements.steps.innerHTML = '';
        }
        
        if (this.elements.hintsAccordion) {
            this.elements.hintsAccordion.innerHTML = '';
        }
        
        this.updateProgress(0, 'Ready to start');
        this.toggleSolutionArea(false);
        this.toggleAnswerSection(false);
        this.toggleHintsArea(false);
    }

    /**
     * Show a validation message
     * @param {string} message - The message to show
     * @param {string} type - Message type (success, error, warning, info)
     */
    showValidationMessage(message, type = 'info') {
        // Create or update validation message element
        let messageElement = document.getElementById('validationMessage');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'validationMessage';
            messageElement.className = 'validation-feedback';
            
            // Insert after the function input
            const functionInputGroup = this.elements.functionInput?.closest('.mb-4');
            if (functionInputGroup) {
                functionInputGroup.appendChild(messageElement);
            }
        }

        // Update message and styling
        messageElement.textContent = message;
        messageElement.className = `validation-feedback ${type}`;
        
        // Auto-hide after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    /**
     * Get the current function input value
     * @returns {string} The current function input
     */
    getFunctionInput() {
        return this.elements.functionInput?.value || '';
    }

    /**
     * Get the current technique selection
     * @returns {string} The selected technique
     */
    getTechniqueSelection() {
        return this.elements.techniqueSelect?.value || '';
    }

    /**
     * Focus on the function input
     */
    focusFunctionInput() {
        if (this.elements.functionInput) {
            this.elements.functionInput.focus();
        }
    }

    /**
     * Add CSS animation class to an element
     * @param {string} elementId - The element ID
     * @param {string} animationClass - The CSS animation class
     * @param {number} duration - Duration in milliseconds
     */
    addAnimation(elementId, animationClass, duration = 600) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(animationClass);
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, duration);
        }
    }

    /**
     * Check if all required elements are present
     * @returns {boolean} True if all elements are found
     */
    validateElements() {
        const requiredElements = [
            'functionInput', 'functionPreview', 'analyzeBtn', 
            'progressBar', 'progressText'
        ];
        
        return requiredElements.every(elementName => {
            const exists = !!this.elements[elementName];
            if (!exists) {
                console.warn(`Required element not found: ${elementName}`);
            }
            return exists;
        });
    }

    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} The element or null if not found
     */
    safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element not found: ${id}`);
        }
        return element;
    }
}

export default InterfaceView;
