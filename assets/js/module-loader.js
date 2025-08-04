/**
 * Module Loader
 * Loads all MVC components in the correct order for browser compatibility
 */

(function() {
    'use strict';

    /**
     * Script loader utility
     */
    class ScriptLoader {
        constructor() {
            this.loadedScripts = new Set();
            this.loadingPromises = new Map();
        }

        /**
         * Load a script and return a promise
         */
        loadScript(src, id = null) {
            if (this.loadedScripts.has(src)) {
                return Promise.resolve();
            }

            if (this.loadingPromises.has(src)) {
                return this.loadingPromises.get(src);
            }

            const promise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                if (id) script.id = id;
                
                script.onload = () => {
                    this.loadedScripts.add(src);
                    this.loadingPromises.delete(src);
                    resolve();
                };
                
                script.onerror = () => {
                    this.loadingPromises.delete(src);
                    reject(new Error(`Failed to load script: ${src}`));
                };
                
                document.head.appendChild(script);
            });

            this.loadingPromises.set(src, promise);
            return promise;
        }

        /**
         * Load multiple scripts in sequence
         */
        async loadSequence(scripts) {
            for (const script of scripts) {
                if (typeof script === 'string') {
                    await this.loadScript(script);
                } else {
                    await this.loadScript(script.src, script.id);
                }
            }
        }

        /**
         * Load multiple scripts in parallel
         */
        async loadParallel(scripts) {
            const promises = scripts.map(script => {
                if (typeof script === 'string') {
                    return this.loadScript(script);
                } else {
                    return this.loadScript(script.src, script.id);
                }
            });
            
            await Promise.all(promises);
        }
    }

    /**
     * Module definitions with dependencies
     */
    const modules = [
        // Configuration (no dependencies)
        {
            src: 'config/AppConfig.js',
            id: 'app-config',
            name: 'AppConfig'
        },
        
        // Models (no dependencies between them)
        {
            src: 'src/models/MathUtils.js',
            id: 'math-utils',
            name: 'MathUtils'
        },
        {
            src: 'src/models/IntegrationProblem.js',
            id: 'integration-problem',
            name: 'IntegrationProblem'
        },
        {
            src: 'src/models/AnswerValidator.js',
            id: 'answer-validator',
            name: 'AnswerValidator'
        },
        
        // Views (no dependencies between them)
        {
            src: 'src/views/InterfaceView.js',
            id: 'interface-view',
            name: 'InterfaceView'
        },
        {
            src: 'src/views/SolutionView.js',
            id: 'solution-view',
            name: 'SolutionView'
        },
        {
            src: 'src/views/AnswerView.js',
            id: 'answer-view',
            name: 'AnswerView'
        },
        {
            src: 'src/views/HintsView.js',
            id: 'hints-view',
            name: 'HintsView'
        },
        
        // Controller (depends on models and views)
        {
            src: 'src/controllers/IntegrationController.js',
            id: 'integration-controller',
            name: 'IntegrationController'
        },
        
        // Main application (depends on everything)
        {
            src: 'assets/js/app.js',
            id: 'main-app',
            name: 'IntegrationAssistant'
        }
    ];

    /**
     * Convert ES6 modules to global variables for browser compatibility
     */
    function exposeModuleGlobally(moduleContent, moduleName) {
        try {
            // Remove export statements and make class global
            let content = moduleContent;
            content = content.replace(/export\s+default\s+/g, `window.${moduleName} = `);
            content = content.replace(/export\s*{\s*\w+\s*}/g, '');
            
            // Create and execute script
            const script = document.createElement('script');
            script.textContent = content;
            document.head.appendChild(script);
            
            return true;
        } catch (error) {
            console.error(`Failed to expose module ${moduleName}:`, error);
            return false;
        }
    }

    /**
     * Load a module and make it globally available
     */
    async function loadModule(module) {
        try {
            // Fetch the module content
            const response = await fetch(module.src);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            // Make module globally available
            exposeModuleGlobally(content, module.name);
            
            console.log(`✅ Loaded ${module.name} from ${module.src}`);
            
        } catch (error) {
            console.error(`❌ Failed to load ${module.name} from ${module.src}:`, error);
            throw error;
        }
    }

    /**
     * Initialize the module loading process
     */
    async function initializeModules() {
        console.log('🚀 Loading Integral Explorer modules...');
        
        try {
            // Load modules in groups
            const configModules = modules.slice(0, 1);    // AppConfig
            const modelModules = modules.slice(1, 4);     // Models
            const viewModules = modules.slice(4, 8);      // Views
            const controllerModules = modules.slice(8, 9); // Controller
            const appModules = modules.slice(9);          // Main app
            
            // Load configuration first
            console.log('📦 Loading configuration...');
            for (const module of configModules) {
                await loadModule(module);
            }
            
            // Load models in parallel
            console.log('🧮 Loading models...');
            await Promise.all(modelModules.map(loadModule));
            
            // Load views in parallel
            console.log('👁️ Loading views...');
            await Promise.all(viewModules.map(loadModule));
            
            // Load controller
            console.log('🎮 Loading controller...');
            for (const module of controllerModules) {
                await loadModule(module);
            }
            
            // Load main application
            console.log('🎯 Loading main application...');
            for (const module of appModules) {
                await loadModule(module);
            }
            
            console.log('✅ All modules loaded successfully!');
            
        } catch (error) {
            console.error('❌ Failed to load modules:', error);
            
            // Show user-friendly error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger m-3';
            errorDiv.innerHTML = `
                <h4>🚫 Loading Error</h4>
                <p>Failed to load application modules. Please check the console for details.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
            `;
            
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }

    /**
     * Start loading when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModules);
    } else {
        // DOM is already ready, start immediately
        setTimeout(initializeModules, 100);
    }

    // Global reference for debugging
    window.ModuleLoader = {
        loadedScripts: new Set(),
        modules: modules,
        reload: initializeModules
    };

})();
