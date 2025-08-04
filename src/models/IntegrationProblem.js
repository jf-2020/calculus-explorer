/**
 * Integration Problem Model
 * Represents an integration problem with its properties and validation logic
 */
class IntegrationProblem {
    constructor(functionString = '') {
        this.functionString = functionString;
        this.technique = '';
        this.difficulty = '';
        this.correctAnswer = '';
        this.description = '';
        this.steps = [];
        this.hints = [];
    }

    /**
     * Set the function to integrate
     * @param {string} func - The function string
     */
    setFunction(func) {
        this.functionString = func;
        this.analyze();
    }

    /**
     * Analyze the function and determine the best integration technique
     */
    analyze() {
        const analysis = this.determineTechnique(this.functionString);
        this.technique = analysis.technique;
        this.difficulty = analysis.difficulty;
        this.description = analysis.description;
        this.correctAnswer = this.calculateCorrectAnswer(this.functionString, this.technique);
        this.generateHints();
        this.generateSteps();
    }

    /**
     * Determine the best integration technique for the given function
     * @param {string} func - The function string
     * @returns {Object} Analysis result with technique, description, and difficulty
     */
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
        } else if (f.includes('/') || f.includes('1/(')) {
            return {
                technique: 'partial',
                description: 'This rational function may need partial fractions.',
                difficulty: 'Hard'
            };
        } else {
            return {
                technique: 'substitution',
                description: 'Try u-substitution or analyze the function structure.',
                difficulty: 'Medium'
            };
        }
    }

    /**
     * Calculate the correct answer for the integration problem
     * @param {string} func - The function string
     * @param {string} technique - The integration technique
     * @returns {string} The correct answer
     */
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

    /**
     * Generate hints for the current problem
     */
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

    /**
     * Generate step-by-step solution steps
     */
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
            case 'partial':
                this.steps = [
                    `Factor the denominator of: ${this.functionString}`,
                    "Set up partial fraction decomposition",
                    "Solve for unknown coefficients",
                    "Integrate each partial fraction",
                    "Combine results"
                ];
                break;
        }
    }

    /**
     * Get the technique name in a readable format
     * @returns {string} Human-readable technique name
     */
    getTechniqueName() {
        const names = {
            'power': 'Power Rule',
            'substitution': 'U-Substitution',
            'parts': 'Integration by Parts',
            'trig': 'Trigonometric Integration',
            'partial': 'Partial Fractions'
        };
        return names[this.technique] || 'Unknown';
    }

    /**
     * Check if the problem is valid (has a function)
     * @returns {boolean} True if valid
     */
    isValid() {
        return this.functionString && this.functionString.trim() !== '';
    }
}

export default IntegrationProblem;
