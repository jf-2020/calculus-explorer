/**
 * Hints View
 * Handles the display of progressive hints in an accordion format
 */
class HintsView {
    constructor() {
        this.hintsArea = document.getElementById('hintsArea');
        this.hintsAccordion = document.getElementById('hintsAccordion');
        this.currentHints = [];
        this.revealedHints = 0;
    }

    /**
     * Initialize hints for a specific technique
     * @param {Array} hints - Array of hint strings
     */
    initializeHints(hints) {
        this.currentHints = hints;
        this.revealedHints = 0;
        this.clearHints();
        this.setupHintsAccordion();
    }

    /**
     * Setup the hints accordion structure
     */
    setupHintsAccordion() {
        if (!this.hintsAccordion) return;

        this.hintsAccordion.innerHTML = '';
        
        // Create accordion items for each hint (initially hidden)
        this.currentHints.forEach((hint, index) => {
            const hintItem = this.createHintItem(hint, index + 1);
            this.hintsAccordion.appendChild(hintItem);
        });
    }

    /**
     * Create a single hint accordion item
     * @param {string} hint - The hint text
     * @param {number} hintNumber - The hint number
     * @returns {HTMLElement} The hint accordion item
     */
    createHintItem(hint, hintNumber) {
        const hintItem = document.createElement('div');
        hintItem.className = 'accordion-item';
        hintItem.style.display = 'none'; // Initially hidden
        
        hintItem.innerHTML = `
            <h2 class="accordion-header" id="hint${hintNumber}Header">
                <button class="accordion-button collapsed" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#hint${hintNumber}Collapse" 
                        aria-expanded="false" aria-controls="hint${hintNumber}Collapse">
                    <i class="bi bi-lightbulb me-2"></i>Hint ${hintNumber}
                </button>
            </h2>
            <div id="hint${hintNumber}Collapse" class="accordion-collapse collapse" 
                 aria-labelledby="hint${hintNumber}Header" data-bs-parent="#hintsAccordion">
                <div class="accordion-body">
                    ${hint}
                </div>
            </div>
        `;
        
        return hintItem;
    }

    /**
     * Reveal the next hint
     * @returns {boolean} True if a hint was revealed, false if no more hints
     */
    revealNextHint() {
        if (this.revealedHints >= this.currentHints.length) {
            return false;
        }

        const hintItem = this.hintsAccordion?.children[this.revealedHints];
        if (hintItem) {
            // Show the hint with animation
            hintItem.style.display = 'block';
            hintItem.style.opacity = '0';
            hintItem.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                hintItem.style.transition = 'all 0.3s ease-in';
                hintItem.style.opacity = '1';
                hintItem.style.transform = 'translateY(0)';
            }, 100);

            this.revealedHints++;
            this.showHintsArea();
            
            // Auto-expand the newly revealed hint
            setTimeout(() => {
                const collapseElement = hintItem.querySelector('.accordion-collapse');
                const button = hintItem.querySelector('.accordion-button');
                
                if (collapseElement && button) {
                    collapseElement.classList.add('show');
                    button.classList.remove('collapsed');
                    button.setAttribute('aria-expanded', 'true');
                }
            }, 400);

            return true;
        }

        return false;
    }

    /**
     * Show all hints at once
     */
    revealAllHints() {
        while (this.revealNextHint()) {
            // Keep revealing until no more hints
        }
    }

    /**
     * Clear all hints
     */
    clearHints() {
        if (this.hintsAccordion) {
            this.hintsAccordion.innerHTML = '';
        }
        
        this.revealedHints = 0;
        this.hideHintsArea();
    }

    /**
     * Show the hints area
     */
    showHintsArea() {
        if (this.hintsArea) {
            this.hintsArea.style.display = 'block';
        }
    }

    /**
     * Hide the hints area
     */
    hideHintsArea() {
        if (this.hintsArea) {
            this.hintsArea.style.display = 'none';
        }
    }

    /**
     * Check if there are more hints to reveal
     * @returns {boolean} True if more hints available
     */
    hasMoreHints() {
        return this.revealedHints < this.currentHints.length;
    }

    /**
     * Get the number of available hints
     * @returns {number} Total number of hints
     */
    getTotalHints() {
        return this.currentHints.length;
    }

    /**
     * Get the number of revealed hints
     * @returns {number} Number of revealed hints
     */
    getRevealedHints() {
        return this.revealedHints;
    }

    /**
     * Add a custom hint dynamically
     * @param {string} hint - The hint text
     * @param {boolean} reveal - Whether to reveal immediately
     */
    addCustomHint(hint, reveal = false) {
        this.currentHints.push(hint);
        
        const hintNumber = this.currentHints.length;
        const hintItem = this.createHintItem(hint, hintNumber);
        
        if (this.hintsAccordion) {
            this.hintsAccordion.appendChild(hintItem);
        }

        if (reveal) {
            this.revealNextHint();
        }
    }

    /**
     * Update hint button state
     * @param {boolean} enabled - Whether the hint button should be enabled
     * @param {string} text - Button text
     */
    updateHintButton(enabled, text = 'Get Hint') {
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            hintBtn.disabled = !enabled;
            
            // Update button text to show progress
            if (this.hasMoreHints()) {
                hintBtn.innerHTML = `<i class="bi bi-lightbulb me-1"></i>${text} (${this.revealedHints}/${this.getTotalHints()})`;
            } else {
                hintBtn.innerHTML = `<i class="bi bi-lightbulb-fill me-1"></i>All Hints Shown`;
            }
        }
    }

    /**
     * Highlight important parts of hints
     * @param {number} hintNumber - The hint to highlight (1-based)
     * @param {string} keyword - The keyword to highlight
     */
    highlightHintKeyword(hintNumber, keyword) {
        const hintItem = this.hintsAccordion?.children[hintNumber - 1];
        if (hintItem) {
            const accordionBody = hintItem.querySelector('.accordion-body');
            if (accordionBody) {
                const highlightedText = accordionBody.innerHTML.replace(
                    new RegExp(keyword, 'gi'),
                    `<mark>$&</mark>`
                );
                accordionBody.innerHTML = highlightedText;
            }
        }
    }

    /**
     * Add interactive elements to hints
     * @param {number} hintNumber - The hint number (1-based)
     * @param {Function} callback - Callback for interaction
     */
    makeHintInteractive(hintNumber, callback) {
        const hintItem = this.hintsAccordion?.children[hintNumber - 1];
        if (hintItem) {
            const accordionBody = hintItem.querySelector('.accordion-body');
            if (accordionBody) {
                const interactiveElement = document.createElement('button');
                interactiveElement.className = 'btn btn-sm btn-outline-primary mt-2';
                interactiveElement.innerHTML = '<i class="bi bi-question-circle me-1"></i>Need more help?';
                interactiveElement.onclick = () => callback(hintNumber);
                
                accordionBody.appendChild(interactiveElement);
            }
        }
    }

    /**
     * Reset the hints view
     */
    reset() {
        this.clearHints();
        this.currentHints = [];
        this.revealedHints = 0;
        this.updateHintButton(false, 'Get Hint');
    }

    /**
     * Validate that required elements exist
     * @returns {boolean} True if valid
     */
    validateElements() {
        const requiredElements = [this.hintsArea, this.hintsAccordion];
        
        return requiredElements.every(element => {
            const exists = !!element;
            if (!exists) {
                console.warn('Required hints element not found');
            }
            return exists;
        });
    }
}

export default HintsView;
