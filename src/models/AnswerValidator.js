/**
 * Answer Validator Model
 * Handles answer validation logic and comparison
 */
class AnswerValidator {
    constructor() {
        this.maxAttempts = 3;
    }

    /**
     * Validate a user's answer against the correct answer
     * @param {string} userAnswer - The user's answer
     * @param {string} correctAnswer - The correct answer
     * @param {number} attempts - Current attempt number
     * @returns {Object} Validation result with feedback
     */
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

    /**
     * Check if the user's answer is correct
     * @param {string} userAnswer - The user's answer
     * @param {string} correctAnswer - The correct answer
     * @returns {Object} Check result
     */
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
        
        // Check for common variations
        if (this.isEquivalentAnswer(normalizedUser, normalizedCorrect)) {
            return {
                isValid: true,
                isCorrect: true,
                type: 'equivalent',
                message: 'Correct! Your answer is mathematically equivalent.',
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
        
        // Completely wrong
        return {
            isValid: true,
            isCorrect: false,
            type: 'incorrect',
            message: 'Not quite right. Check your work and try again!',
            feedback: 'error'
        };
    }

    /**
     * Normalize an answer string for comparison
     * @param {string} answer - The answer to normalize
     * @returns {string} Normalized answer
     */
    normalizeAnswer(answer) {
        return answer.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\+c$/, '')
            .replace(/\+constant$/, '')
            .replace(/\*/g, '')
            .replace(/\^1/g, '');
    }

    /**
     * Check if two answers are mathematically equivalent
     * @param {string} user - User's normalized answer
     * @param {string} correct - Correct normalized answer
     * @returns {boolean} True if equivalent
     */
    isEquivalentAnswer(user, correct) {
        const equivalents = [
            [user, correct],
            [user.replace(/x\^2\/2/, 'x^2/2'), correct],
            [user.replace(/\/2\*x\^2/, 'x^2/2'), correct],
            [user.replace(/0\.5x\^2/, 'x^2/2'), correct]
        ];
        
        return equivalents.some(([a, b]) => a === b);
    }

    /**
     * Check for partial credit scenarios
     * @param {string} user - User's normalized answer
     * @param {string} correct - Correct normalized answer
     * @returns {Object} Partial credit result
     */
    checkPartialCredit(user, correct) {
        // Missing constant of integration
        if (user + 'c' === correct || user === correct + 'c') {
            return {
                hasPartialCredit: true,
                message: "Almost! Don't forget the constant of integration (+C)."
            };
        }
        
        // Sign error
        if (user === correct.replace(/^-/, '') || user === '-' + correct) {
            return {
                hasPartialCredit: true,
                message: 'Close! Check your signs - there might be a sign error.'
            };
        }
        
        // Wrong coefficient
        if (user.replace(/\d+/, '1') === correct.replace(/\d+/, '1')) {
            return {
                hasPartialCredit: true,
                message: 'The form is right, but check your coefficient.'
            };
        }
        
        return { hasPartialCredit: false };
    }

    /**
     * Get feedback message based on attempts
     * @param {number} attempts - Current attempt number
     * @param {boolean} isCorrect - Whether the answer is correct
     * @returns {string} Progress message
     */
    getProgressMessage(attempts, isCorrect) {
        if (isCorrect) {
            return 'Congratulations! Correct answer!';
        }
        
        if (attempts >= this.maxAttempts) {
            return 'Maximum attempts reached';
        }
        
        return `Attempt ${attempts}/${this.maxAttempts} - Try again!`;
    }

    /**
     * Calculate progress percentage based on attempts and correctness
     * @param {number} attempts - Current attempt number
     * @param {boolean} isCorrect - Whether the answer is correct
     * @param {number} currentProgress - Current progress percentage
     * @returns {number} New progress percentage
     */
    calculateProgress(attempts, isCorrect, currentProgress = 0) {
        if (isCorrect) {
            return 100;
        }
        
        return Math.min(currentProgress + 15, 90);
    }
}

export default AnswerValidator;
