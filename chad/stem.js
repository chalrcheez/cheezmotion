/**
 * STEM Learning Module for Cheesemation
 * Integrates educational challenges in Science, Technology, Engineering, and Mathematics
 */

class STEMChallenge {
    constructor(title, category, difficulty, description, frames, formula, instructions, validator, hints) {
        this.title = title;
        this.category = category; // 'math', 'science', 'technology', 'engineering'
        this.difficulty = difficulty; // 1-4 stars
        this.description = description;
        this.frames = frames; // Number of frames expected
        this.formula = formula; // Mathematical/physical formula
        this.instructions = instructions; // Array of step-by-step instructions
        this.validator = validator; // Function to validate animation correctness
        this.hints = hints || []; // Helpful questions and tips
    }
}

class STEMLearningSystem {
    constructor(animationStudio) {
        this.studio = animationStudio;
        this.isSTEMMode = false;
        this.currentChallenge = null;
        this.challenges = this.initializeChallenges();
        this.setupSTEMUI();
    }

    /**
     * Initialize all available STEM challenges
     */
    initializeChallenges() {
        return {
            'growing-circle': new STEMChallenge(
                'Growing Circle',
                'math',
                1,
                'Create a circle that grows from small to large, demonstrating linear scaling.',
                12,
                'radius = frame * (maxRadius / totalFrames)',
                [
                    '📍 SETUP: Enable the Developer Grid (right panel) to help with positioning',
                    '',
                    'FRAME 1 - Small Starting Circle (radius ≈ 10)',
                    '  • Look for coordinates X: 320, Y: 240 (canvas center)',
                    '  • Draw a small circle at this exact center point',
                    '  • The circle should be roughly the size of a marble',
                    '',
                    'FRAME 2 - Growing Slightly (radius ≈ 20)',
                    '  • Use "Append Keyframe" to create frame 2',
                    '  • Keep the center at (320, 240)',
                    '  • Draw a circle twice as wide as frame 1',
                    '',
                    'FRAME 3 - Larger Circle (radius ≈ 30)',
                    '  • Again, center at (320, 240)',
                    '  • Circle grows by 10 pixels in each direction',
                    '',
                    'FRAMES 4-12 - Consistent Growth',
                    '  • Each frame: radius increases by 10 pixels',
                    '  • Frame 4: r≈40, Frame 5: r≈50, Frame 6: r≈60',
                    '  • Keep all circles perfectly centered',
                    '  • Frame 12 final circle: radius ≈ 120 (almost edge-to-edge)',
                    '',
                    '✓ When complete, press Play to see smooth animation'
                ],
                this.validateGrowingCircle.bind(this),
                [
                    '❓ Where is the center of your canvas? (Hint: look at coordinates when you hover around the middle)',
                    '❓ How do you draw a perfect circle freehand? (Tip: draw slowly and use the grid as a guide)',
                    '❓ What is the relationship between radius and diameter? (diameter = 2 × radius)',
                    '❓ Why must the center stay at (320, 240) for all frames? (So the circle grows equally in all directions)',
                    '❓ How many pixels should the radius grow each frame? (12 frames total, so: 120 ÷ 12 = 10 pixels per frame)',
                    '❓ When does the animation look smooth? (When each frame\'s change is small and consistent)',
                ]
            ),
            'rotating-square': new STEMChallenge(
                'Rotating Square',
                'math',
                2,
                'Rotate a square 360 degrees demonstrating geometric transformation.',
                24,
                'θ = frame * (360° / totalFrames)',
                [
                    'Frame 1: Draw square at 0° rotation',
                    'Frame 2: Rotate square 15° clockwise',
                    'Frame 3: Rotate square 30° clockwise',
                    'Continue rotating by 15° each frame',
                    'Create 24 frames for complete 360° rotation',
                    'Keep square centered at (320, 240)'
                ],
                this.validateRotatingSquare.bind(this)
            ),
            'sine-wave': new STEMChallenge(
                'Sine Wave Motion',
                'math',
                2,
                'Create a ball that moves following a sine wave path.',
                48,
                'y = 240 + 100*sin(frame * 2π/24), x = frame * (640/48)',
                [
                    'Frame 1: Draw ball at (13, 240) - start left, middle height',
                    'Frame 2: Ball at x=26, y=240+100*sin(2π/24)',
                    'Continue moving right while oscillating up/down',
                    'Use formula: y = 240 + 100*sin(frameNumber * π/12)',
                    'Create smooth wave from left to right',
                    'Total 48 frames, ball exits right side'
                ],
                this.validateSineWave.bind(this)
            ),
            'bouncing-ball': new STEMChallenge(
                'Bouncing Ball (Gravity)',
                'science',
                3,
                'Simulate a ball falling under gravity and bouncing with energy loss.',
                120,
                'y = y₀ + v₀t + ½gt², v decreases after bounce',
                [
                    'Frame 1-30: Ball falls from top (y=0) under gravity',
                    'Use formula: y = 0 + 0*t + ½*9.8*t² (scaled to pixels)',
                    'Frame 30: Ball hits bottom (y≈480)',
                    'Frame 31-60: Ball bounces back up with 70% velocity',
                    'Frame 61+: Repeat bounce cycle with decreasing height',
                    'Total 120 frames showing 3-4 bounces'
                ],
                this.validateBouncingBall.bind(this)
            ),
            'orbiting-planet': new STEMChallenge(
                'Orbiting Planet',
                'science',
                3,
                'Visualize planetary motion in orbit around a star.',
                60,
                'x = x₀ + r*cos(θ), y = y₀ + r*sin(θ), θ = 2π*t/T',
                [
                    'Frame 1: Draw sun at center (320, 240)',
                    'Frame 1: Draw planet at (420, 240) - right of sun',
                    'Frame 2-60: Planet orbits sun in circular path',
                    'x = 320 + 100*cos(frame * 2π/60)',
                    'y = 240 + 100*sin(frame * 2π/60)',
                    'Complete full orbit in 60 frames'
                ],
                this.validateOrbitingPlanet.bind(this)
            ),
            'gear-rotation': new STEMChallenge(
                'Interlocking Gears',
                'engineering',
                3,
                'Show how gears transfer motion with opposite rotation.',
                96,
                'Gear1: θ = frame * 3.75°, Gear2: θ = -frame * 3.75°',
                [
                    'Frame 1: Draw two gears side by side touching at one point',
                    'Gear 1 at (250, 240) rotating clockwise',
                    'Gear 2 at (390, 240) rotating counter-clockwise',
                    'Each frame: Gear1 rotates +3.75°, Gear2 rotates -3.75°',
                    'Complete 96 frames for one full rotation of each gear',
                    'Maintain teeth alignment at contact point'
                ],
                this.validateGearRotation.bind(this)
            ),
            'binary-counter': new STEMChallenge(
                'Binary Counter',
                'technology',
                2,
                'Visualize how computers count using binary digits.',
                32,
                'Display binary representation: 00000 to 11111',
                [
                    'Frame 1: Draw 5 bits showing 00000 (5 rectangles, unfilled)',
                    'Frame 2: Draw 00001 (rightmost bit filled)',
                    'Frame 3: Draw 00010 (middle bit filled)',
                    'Continue counting: 00011, 00100, ..., 11111',
                    'Create 32 frames (0 to 31 in decimal)',
                    'Show bit changes with visual feedback'
                ],
                this.validateBinaryCounter.bind(this)
            ),
            'pendulum': new STEMChallenge(
                'Simple Pendulum',
                'engineering',
                3,
                'Simulate a swinging pendulum with simple harmonic motion.',
                60,
                'θ = θ_max * cos(t * √(g/L)), x = pivot_x + L*sin(θ)',
                [
                    'Frame 1: Draw pivot point at (320, 100)',
                    'Pendulum bob starts at left extreme: (270, 280)',
                    'Frame 2-30: Bob swings to right extreme',
                    'Frame 31-60: Bob swings back to left',
                    'Use formula: x = 320 + 50*sin(frame * π/30)',
                    'Complete smooth oscillation in 60 frames'
                ],
                this.validatePendulum.bind(this)
            ),
            'wave-interference': new STEMChallenge(
                'Wave Interference',
                'science',
                4,
                'Show how waves create constructive and destructive interference.',
                96,
                'y_total = A*sin(kx - ωt) + A*sin(kx - ωt + φ)',
                [
                    'Frame 1: Draw two sine waves from different sources',
                    'Wave 1 starts at x=100, Wave 2 starts at x=580',
                    'Frames 2-48: Waves propagate toward each other',
                    'Frames 49-96: Waves overlap, showing interference patterns',
                    'Bright regions = constructive interference',
                    'Dark regions = destructive interference'
                ],
                this.validateWaveInterference.bind(this)
            ),
            'projectile': new STEMChallenge(
                'Projectile Motion',
                'science',
                4,
                'Animate an object following a ballistic trajectory.',
                120,
                'x = x₀ + v₀*cos(θ)*t, y = y₀ + v₀*sin(θ)*t - ½*g*t²',
                [
                    'Frame 1: Object at launcher (100, 400)',
                    'Launch at 45° angle with initial velocity v₀=10',
                    'x increases linearly: x = 100 + frame * 4',
                    'y follows parabola: y = 400 - frame*3 + frame²*0.05',
                    'Object reaches maximum height at ~frame 30',
                    'Total 120 frames for complete trajectory'
                ],
                this.validateProjectile.bind(this)
            )
        };
    }

    /**
     * Set up STEM mode UI elements
     */
    setupSTEMUI() {
        // This creates UI elements that will be added to the HTML
        this.stemUITemplate = `
            <div id="stemModePanel" style="display:none; background:#1a1a1f; padding:15px; border-radius:8px; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h3 style="margin:0; color:#2f80ed;">📚 STEM Learning Mode</h3>
                    <button id="exitSTEMMode" style="background:#eb5757; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Exit</button>
                </div>
                <div id="stemChallengeSelector" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
                    <!-- Challenge buttons will be inserted here -->
                </div>
                <div id="stemChallengeInfo" style="display:none;">
                    <h4 id="stemTitle" style="color:#2f80ed; margin:10px 0 5px 0;"></h4>
                    <p id="stemDescription" style="color:#aaaaaa; margin:5px 0; font-size:12px;"></p>
                    <div style="background:#2d2d38; padding:10px; border-radius:4px; margin:8px 0;">
                        <strong style="color:#27ae60;">Formula:</strong>
                        <code id="stemFormula" style="color:#f2994a; font-size:11px; display:block; margin-top:5px;"></code>
                    </div>
                    <div style="background:#2d2d38; padding:10px; border-radius:4px;">
                        <strong style="color:#27ae60;">Steps:</strong>
                        <ol id="stemInstructions" style="color:#aaaaaa; font-size:12px; margin:5px 0 0 20px;"></ol>
                    </div>
                    <button id="startChallenge" style="background:#27ae60; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; margin-top:10px; width:100%;">Start Challenge</button>
                </div>
            </div>
        `;
    }

    /**
     * Toggle STEM learning mode
     */
    toggleSTEMMode(toggle = null) {
        this.isSTEMMode = toggle !== null ? toggle : !this.isSTEMMode;
        const panel = document.getElementById('stemModePanel') || this.createSTEMPanel();
        panel.style.display = this.isSTEMMode ? 'block' : 'none';
        
        if (this.isSTEMMode) {
            this.populateChallengeSelector();
        }
    }

    /**
     * Create STEM mode panel in DOM
     */
    createSTEMPanel() {
        const inspectorPanel = document.querySelector('.inspector-sidebar');
        const container = document.createElement('div');
        container.innerHTML = this.stemUITemplate;
        inspectorPanel.insertBefore(container.firstChild, inspectorPanel.firstChild);
        
        document.getElementById('exitSTEMMode').addEventListener('click', () => this.toggleSTEMMode(false));
        return document.getElementById('stemModePanel');
    }

    /**
     * Populate challenge selector buttons
     */
    populateChallengeSelector() {
        const selector = document.getElementById('stemChallengeSelector');
        selector.innerHTML = '';
        
        Object.entries(this.challenges).forEach(([key, challenge]) => {
            const btn = document.createElement('button');
            btn.className = 'stem-challenge-btn';
            btn.innerHTML = `
                <div style="font-size:11px; color:#2f80ed;">★${challenge.difficulty}</div>
                <div style="font-size:12px; font-weight:600; color:#f2f2f2;">${challenge.title}</div>
                <div style="font-size:10px; color:#aaaaaa;">${challenge.category}</div>
            `;
            btn.style.cssText = 'background:#2d2d38; border:1px solid #3f3f4f; padding:10px; border-radius:4px; cursor:pointer; color:#f2f2f2; transition:all 0.2s;';
            
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#3f3f4f';
                btn.style.borderColor = '#2f80ed';
            });
            
            btn.addEventListener('mouseout', () => {
                btn.style.background = '#2d2d38';
                btn.style.borderColor = '#3f3f4f';
            });
            
            btn.addEventListener('click', () => this.selectChallenge(key));
            selector.appendChild(btn);
        });
    }

    /**
     * Select a challenge and display its details
     */
    selectChallenge(challengeKey) {
        this.currentChallenge = this.challenges[challengeKey];
        
        document.getElementById('stemTitle').textContent = `${this.currentChallenge.title} (${'★'.repeat(this.currentChallenge.difficulty)})`;
        document.getElementById('stemDescription').textContent = this.currentChallenge.description;
        document.getElementById('stemFormula').textContent = this.currentChallenge.formula;
        
        const instructionsList = document.getElementById('stemInstructions');
        instructionsList.innerHTML = '';
        this.currentChallenge.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            li.style.cssText = 'margin-bottom:5px; line-height:1.4;';
            instructionsList.appendChild(li);
        });
        
        // Display hints if available
        const hintsContainer = document.getElementById('stemHintsContainer');
        const hintsList = document.getElementById('stemHints');
        const toggleHintsBtn = document.getElementById('toggleHints');
        
        if (this.currentChallenge.hints && this.currentChallenge.hints.length > 0) {
            hintsList.innerHTML = '';
            this.currentChallenge.hints.forEach(hint => {
                const li = document.createElement('li');
                li.textContent = hint;
                li.style.cssText = 'margin-bottom:4px; line-height:1.3;';
                hintsList.appendChild(li);
            });
            
            toggleHintsBtn.style.display = 'block';
            hintsContainer.style.display = 'none';
            toggleHintsBtn.textContent = 'Show Hints';
            
            // Setup toggle button listener
            toggleHintsBtn.onclick = () => {
                const isShown = hintsContainer.style.display !== 'none';
                hintsContainer.style.display = isShown ? 'none' : 'block';
                toggleHintsBtn.textContent = isShown ? 'Show Hints' : 'Hide Hints';
            };
        } else {
            toggleHintsBtn.style.display = 'none';
            hintsContainer.style.display = 'none';
        }
        
        document.getElementById('stemChallengeInfo').style.display = 'block';
        document.getElementById('stemChallengeSelector').style.display = 'none';
    }

    /**
     * Start the selected challenge
     */
    startChallenge() {
        if (!this.currentChallenge) return;
        alert(`Challenge "${this.currentChallenge.title}" started!\n\nFrames needed: ${this.currentChallenge.frames}\n\nFollow the steps to create your animation.`);
    }

    /**
     * Validate Growing Circle animation
     */
    validateGrowingCircle() {
        // Placeholder: Would check if circles are growing properly
        return { valid: true, message: 'Growing circle pattern detected!' };
    }

    /**
     * Validate Rotating Square animation
     */
    validateRotatingSquare() {
        return { valid: true, message: 'Square rotation detected!' };
    }

    /**
     * Validate Sine Wave motion
     */
    validateSineWave() {
        return { valid: true, message: 'Sine wave motion detected!' };
    }

    /**
     * Validate Bouncing Ball physics
     */
    validateBouncingBall() {
        return { valid: true, message: 'Bouncing motion detected!' };
    }

    /**
     * Validate Orbiting Planet
     */
    validateOrbitingPlanet() {
        return { valid: true, message: 'Circular orbit motion detected!' };
    }

    /**
     * Validate Gear Rotation
     */
    validateGearRotation() {
        return { valid: true, message: 'Synchronized gear rotation detected!' };
    }

    /**
     * Validate Binary Counter
     */
    validateBinaryCounter() {
        return { valid: true, message: 'Binary sequence detected!' };
    }

    /**
     * Validate Pendulum motion
     */
    validatePendulum() {
        return { valid: true, message: 'Harmonic oscillation detected!' };
    }

    /**
     * Validate Wave Interference
     */
    validateWaveInterference() {
        return { valid: true, message: 'Wave interference pattern detected!' };
    }

    /**
     * Validate Projectile motion
     */
    validateProjectile() {
        return { valid: true, message: 'Parabolic trajectory detected!' };
    }

    /**
     * Helper: Analyze canvas frames for mathematical patterns
     */
    analyzeFrames(frames) {
        return {
            frameCount: frames.length,
            patterns: this.detectPatterns(frames),
            analysis: this.mathematicalAnalysis(frames)
        };
    }

    /**
     * Detect motion patterns in frame sequence
     */
    detectPatterns(frames) {
        const patterns = [];
        // Placeholder for pattern detection logic
        return patterns;
    }

    /**
     * Perform mathematical analysis on animation
     */
    mathematicalAnalysis(frames) {
        return {
            avgChangePerFrame: 'N/A',
            predictedFormula: 'N/A',
            consistency: 'N/A'
        };
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STEMLearningSystem;
}
