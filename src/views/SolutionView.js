/**
 * Solution Display View
 * Handles the display of step-by-step solutions and analysis
 */
class SolutionView {
    constructor() {
        this.stepsContainer = document.getElementById('steps');
        this.solutionArea = document.getElementById('solutionArea');
    }

    /**
     * Display the initial analysis of a function
     * @param {Object} analysis - Analysis result with technique, description, difficulty
     */
    showAnalysis(analysis) {
        if (!this.solutionArea) return;

        const analysisHTML = `
            <div class="analysis-result mb-4">
                <div class="alert alert-info">
                    <h6><i class="bi bi-lightbulb-fill me-2"></i>Function Analysis</h6>
                    <p class="mb-2"><strong>Recommended Technique:</strong> ${this.getTechniqueName(analysis.technique)}</p>
                    <p class="mb-2"><strong>Difficulty:</strong> 
                        <span class="badge ${this.getDifficultyColor(analysis.difficulty)}">${analysis.difficulty}</span>
                    </p>
                    <p class="mb-0"><strong>Approach:</strong> ${analysis.description}</p>
                </div>
            </div>
        `;

        this.solutionArea.innerHTML = analysisHTML + '<h6>Step-by-Step Solution:</h6><div id="steps" class="steps-container"></div>';
        this.solutionArea.style.display = 'block';
        
        // Update steps container reference
        this.stepsContainer = document.getElementById('steps');
    }

    /**
     * Add a solution step
     * @param {string} stepText - The step text to add
     * @param {number} stepNumber - The step number
     */
    addStep(stepText, stepNumber) {
        if (!this.stepsContainer) return;

        const stepElement = document.createElement('div');
        stepElement.className = 'step mb-3 p-3 border rounded';
        stepElement.innerHTML = `
            <div class="step-header">
                <strong>Step ${stepNumber}:</strong>
            </div>
            <div class="step-content mt-2">
                ${stepText}
            </div>
        `;

        this.stepsContainer.appendChild(stepElement);
        
        // Add slide-in animation
        stepElement.style.opacity = '0';
        stepElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            stepElement.style.transition = 'all 0.3s ease-in';
            stepElement.style.opacity = '1';
            stepElement.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Clear all solution steps
     */
    clearSteps() {
        if (this.stepsContainer) {
            this.stepsContainer.innerHTML = '';
        }
    }

    /**
     * Show the complete solution at once
     * @param {Array} steps - Array of solution steps
     */
    showCompleteSolution(steps) {
        this.clearSteps();
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                this.addStep(step, index + 1);
            }, index * 500); // Stagger the animation
        });
    }

    /**
     * Get human-readable technique name
     * @param {string} technique - The technique code
     * @returns {string} Human-readable name
     */
    getTechniqueName(technique) {
        const names = {
            'power': 'Power Rule',
            'substitution': 'U-Substitution',
            'parts': 'Integration by Parts',
            'trig': 'Trigonometric Integration',
            'partial': 'Partial Fractions'
        };
        return names[technique] || 'Unknown Technique';
    }

    /**
     * Get CSS class for difficulty badge
     * @param {string} difficulty - The difficulty level
     * @returns {string} Bootstrap badge class
     */
    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': 'bg-success',
            'Medium': 'bg-warning text-dark',
            'Hard': 'bg-danger'
        };
        return colors[difficulty] || 'bg-secondary';
    }

    /**
     * Show a working indicator while generating solution
     */
    showWorkingIndicator() {
        if (!this.stepsContainer) return;

        this.stepsContainer.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Generating solution...</span>
                </div>
                <div class="mt-2">
                    <small class="text-muted">Generating step-by-step solution...</small>
                </div>
            </div>
        `;
    }

    /**
     * Hide the solution area
     */
    hide() {
        if (this.solutionArea) {
            this.solutionArea.style.display = 'none';
        }
    }

    /**
     * Show the solution area
     */
    show() {
        if (this.solutionArea) {
            this.solutionArea.style.display = 'block';
        }
    }

    /**
     * Check if solution area is visible
     * @returns {boolean} True if visible
     */
    isVisible() {
        return this.solutionArea && 
               this.solutionArea.style.display !== 'none';
    }

    /**
     * Scroll to the solution area
     */
    scrollToSolution() {
        if (this.solutionArea && this.isVisible()) {
            this.solutionArea.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    /**
     * Add interactive elements to steps
     * @param {number} stepNumber - The step number to make interactive
     * @param {Function} callback - Callback function for interaction
     */
    makeStepInteractive(stepNumber, callback) {
        const steps = this.stepsContainer?.querySelectorAll('.step');
        if (steps && steps[stepNumber - 1]) {
            const step = steps[stepNumber - 1];
            step.style.cursor = 'pointer';
            step.classList.add('interactive-step');
            
            step.addEventListener('click', () => callback(stepNumber));
            
            // Add hover effect
            step.addEventListener('mouseenter', () => {
                step.style.backgroundColor = '#f8f9fa';
            });
            
            step.addEventListener('mouseleave', () => {
                step.style.backgroundColor = '';
            });
        }
    }

    /**
     * Highlight a specific step
     * @param {number} stepNumber - The step number to highlight
     */
    highlightStep(stepNumber) {
        const steps = this.stepsContainer?.querySelectorAll('.step');
        if (steps) {
            // Remove highlight from all steps
            steps.forEach(step => step.classList.remove('highlighted'));
            
            // Add highlight to specific step
            if (steps[stepNumber - 1]) {
                steps[stepNumber - 1].classList.add('highlighted');
            }
        }
    }
}

export default SolutionView;
