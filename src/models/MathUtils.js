/**
 * Math Utilities Model
 * Handles mathematical expression formatting and LaTeX conversion
 */
class MathUtils {
    /**
     * Convert mathematical input to LaTeX format
     * @param {string} input - The mathematical input string
     * @returns {string} LaTeX formatted string
     */
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
        latex = latex.replace(/\^{([^}]*)}/g, '^{$1}');
        
        // Handle multiplication
        latex = latex.replace(/\*/g, '\\cdot ');
        
        // Handle functions
        latex = latex.replace(/sin/g, '\\sin');
        latex = latex.replace(/cos/g, '\\cos');
        latex = latex.replace(/tan/g, '\\tan');
        latex = latex.replace(/sec/g, '\\sec');
        latex = latex.replace(/csc/g, '\\csc');
        latex = latex.replace(/cot/g, '\\cot');
        latex = latex.replace(/ln/g, '\\ln');
        latex = latex.replace(/log/g, '\\log');
        latex = latex.replace(/sqrt/g, '\\sqrt');
        latex = latex.replace(/pi/g, '\\pi');
        
        // Handle e^x
        latex = latex.replace(/e\^/g, 'e^');
        
        // Clean up extra spaces
        latex = latex.replace(/\s+/g, ' ').trim();
        
        return latex;
    }

    /**
     * Format a function as an integral expression
     * @param {string} func - The function to integrate
     * @returns {string} LaTeX integral expression
     */
    static formatAsIntegral(func) {
        if (!func || func.trim() === '') {
            return '\\int f(x) \\, dx';
        }
        
        const latexFunction = this.convertToLatex(func);
        return `\\int ${latexFunction} \\, dx`;
    }

    /**
     * Format an answer with the constant of integration
     * @param {string} answer - The answer to format
     * @returns {string} LaTeX answer with +C
     */
    static formatAnswerWithConstant(answer) {
        if (!answer || answer.trim() === '') {
            return 'Your answer will appear here...';
        }
        
        const latexAnswer = this.convertToLatex(answer);
        return `${latexAnswer} + C`;
    }

    /**
     * Validate mathematical input format
     * @param {string} input - The input to validate
     * @returns {Object} Validation result
     */
    static validateInput(input) {
        if (!input || input.trim() === '') {
            return {
                isValid: false,
                message: 'Input cannot be empty',
                suggestions: ['Try entering a simple function like x^2 or sin(x)']
            };
        }

        // Check for balanced parentheses
        const openParens = (input.match(/\(/g) || []).length;
        const closeParens = (input.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
            return {
                isValid: false,
                message: 'Unbalanced parentheses',
                suggestions: ['Make sure every opening parenthesis has a closing one']
            };
        }

        // Check for valid characters
        const validChars = /^[a-zA-Z0-9+\-*/^().\s,|]+$/;
        if (!validChars.test(input)) {
            return {
                isValid: false,
                message: 'Invalid characters detected',
                suggestions: ['Use only letters, numbers, and basic mathematical operators']
            };
        }

        return {
            isValid: true,
            message: 'Valid input'
        };
    }

    /**
     * Get common mathematical function examples
     * @returns {Array} Array of example functions with descriptions
     */
    static getExamples() {
        return [
            { func: 'x^2', description: 'Simple polynomial (Power Rule)', difficulty: 'Easy' },
            { func: 'sin(x)', description: 'Trigonometric function', difficulty: 'Easy' },
            { func: '2x + 3', description: 'Linear function', difficulty: 'Easy' },
            { func: 'x*sin(x)', description: 'Product requiring integration by parts', difficulty: 'Hard' },
            { func: 'e^x', description: 'Exponential function', difficulty: 'Medium' },
            { func: '1/x', description: 'Reciprocal function (natural log)', difficulty: 'Medium' },
            { func: 'x/(x^2+1)', description: 'Rational function (u-substitution)', difficulty: 'Medium' },
            { func: 'cos(2x)', description: 'Trigonometric with coefficient', difficulty: 'Medium' }
        ];
    }

    /**
     * Get LaTeX symbols and their meanings
     * @returns {Object} Object mapping symbols to descriptions
     */
    static getLatexReference() {
        return {
            '\\int': 'Integral symbol',
            '\\frac{a}{b}': 'Fraction a/b',
            'x^{n}': 'x to the power of n',
            '\\sin': 'Sine function',
            '\\cos': 'Cosine function',
            '\\tan': 'Tangent function',
            '\\ln': 'Natural logarithm',
            '\\cdot': 'Multiplication dot',
            '\\pi': 'Pi constant',
            'e^{x}': 'e to the power of x',
            '\\sqrt{x}': 'Square root of x'
        };
    }

    /**
     * Render MathJax in specified elements
     * @param {Array|HTMLElement} elements - Elements to render
     */
    static renderMathJax(elements) {
        if (window.MathJax && MathJax.typesetPromise) {
            const elementsArray = Array.isArray(elements) ? elements : [elements];
            MathJax.typesetPromise(elementsArray).catch((err) => {
                console.warn('MathJax rendering error:', err.message);
            });
        }
    }

    /**
     * Check if MathJax is loaded and ready
     * @returns {boolean} True if MathJax is available
     */
    static isMathJaxReady() {
        return typeof window !== 'undefined' && 
               window.MathJax && 
               typeof MathJax.typesetPromise === 'function';
    }
}

export default MathUtils;
