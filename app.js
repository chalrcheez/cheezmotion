document.addEventListener("DOMContentLoaded", () => {
    // === TRAILER MODAL ===
    const trailerModal = document.getElementById('trailerModal');
    const trailerVideo = document.getElementById('trailerVideo');
    const skipTrailerBtn = document.getElementById('skipTrailerBtn');

    const closeTrailer = () => {
        trailerModal.classList.add('hidden');
        // Optional: pause the video
        trailerVideo.pause();
    };

    // Skip button click
    skipTrailerBtn.addEventListener('click', closeTrailer);

    // Close trailer when video ends
    trailerVideo.addEventListener('ended', closeTrailer);

    // Auto-play the video
    trailerVideo.play().catch(err => {
        console.log('Auto-play prevented:', err);
    });

    // Canvas Connections
    const paintCanvas = document.getElementById('paintCanvas');
    const pCtx = paintCanvas.getContext('2d');
    const onionCanvas = document.getElementById('onionSkinCanvas');
    const oCtx = onionCanvas.getContext('2d');
    const gridCanvas = document.getElementById('gridOverlayCanvas');
    const gCtx = gridCanvas.getContext('2d');

    // UI Hook Assignments
    const frameStripDeck = document.getElementById('frameStripDeck');
    const gridToggle = document.getElementById('gridToggle');
    const brushSizeInput = document.getElementById('brushSize');
    const fpsEngineSlider = document.getElementById('fpsEngineSlider');
    const fpsReadout = document.getElementById('fpsReadout');
    const btnRunAnimation = document.getElementById('btnRunAnimation');
    const playBadge = document.getElementById('playBadge');
    const btnCapture = document.getElementById('btnCapture');
    const btnWipe = document.getElementById('btnWipe');
    const toolBrush = document.getElementById('toolBrush');
    const toolEraser = document.getElementById('toolEraser');
    const toolSTEM = document.getElementById('toolSTEM');

    // === THEME SYSTEM ===
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('cheesemation-theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('cheesemation-theme', theme);
            
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // STEM Learning System Initialization
    let stemLearningSystem = null;
    if (typeof STEMLearningSystem !== 'undefined') {
        stemLearningSystem = new STEMLearningSystem();
        
        // STEM Mode Toggle
        toolSTEM.addEventListener('click', () => {
            const wasActive = toolSTEM.classList.contains('active');
            stemLearningSystem.toggleSTEMMode();
            
            if (stemLearningSystem.isSTEMMode) {
                toolSTEM.classList.add('active');
                toolBrush.classList.remove('active');
                toolEraser.classList.remove('active');
                setupSTEMEventListeners();
            } else {
                toolSTEM.classList.remove('active');
            }
        });
    }

    // Architecture Registers
    let isPainting = false;
    let animationSequence = []; 
    let selectedFrameIndex = null;
    let activeTool = 'brush'; 
    let currentBrushColor = '#141419';
    let playbackIntervalId = null;
    let isSequencerPlaying = false;
    let currentFpsSetting = 12;

    function configureBrushEnvironment() {
        pCtx.lineCap = 'round';
        pCtx.lineJoin = 'round';
        pCtx.lineWidth = brushSizeInput.value;
        
        if (activeTool === 'eraser') {
            pCtx.strokeStyle = 'rgba(0,0,0,1)'; 
            pCtx.globalCompositeOperation = 'destination-out'; 
        } else {
            pCtx.strokeStyle = currentBrushColor;
            pCtx.globalCompositeOperation = 'source-over'; 
        }
    }
    configureBrushEnvironment();

    function getCanvasSpacePointerCoords(e) {
        const boundaryBox = paintCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - boundaryBox.left) * (paintCanvas.width / boundaryBox.width),
            y: (e.clientY - boundaryBox.top) * (paintCanvas.height / boundaryBox.height)
        };
    }

    // --- Interaction Input Listeners ---
    paintCanvas.addEventListener('mousedown', (e) => {
        if (isSequencerPlaying) return;
        isPainting = true;
        configureBrushEnvironment();
        const p = getCanvasSpacePointerCoords(e);
        pCtx.beginPath();
        pCtx.moveTo(p.x, p.y);
        pCtx.lineTo(p.x, p.y);
        pCtx.stroke();
    });

    paintCanvas.addEventListener('mousemove', (e) => {
        const p = getCanvasSpacePointerCoords(e);
        
        // Update STEM coordinates display (always track in STEM mode)
        if (stemLearningSystem && stemLearningSystem.isSTEMMode) {
            const coordsDisplay = document.getElementById('stemCoords');
            if (coordsDisplay) {
                coordsDisplay.textContent = `X: ${Math.round(p.x)} Y: ${Math.round(p.y)}`;
            }
        }
        
        // Handle painting when not playing animation
        if (!isPainting || isSequencerPlaying) return;
        pCtx.lineTo(p.x, p.y);
        pCtx.stroke();
    });

    window.addEventListener('mouseup', () => {
        isPainting = false;
        pCtx.beginPath();
    });

    paintCanvas.addEventListener('mouseleave', () => {
        const coordsDisplay = document.getElementById('stemCoords');
        if (coordsDisplay && stemLearningSystem && stemLearningSystem.isSTEMMode) {
            coordsDisplay.textContent = `X: — Y: —`;
        }
    });

    // --- Dynamic Background Grid Overlay ---
    function renderPerspectiveTelemetryGrid() {
        gCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        if (!gridToggle.checked) return;

        const gridStepInterval = 32; 
        gCtx.strokeStyle = '#000000';
        gCtx.lineWidth = 1;

        for(let x = 0; x < gridCanvas.width; x += gridStepInterval) {
            gCtx.beginPath(); gCtx.moveTo(x, 0); gCtx.lineTo(x, gridCanvas.height); gCtx.stroke();
        }
        for(let y = 0; y < gridCanvas.height; y += gridStepInterval) {
            gCtx.beginPath(); gCtx.moveTo(0, y); gCtx.lineTo(gridCanvas.width, y); gCtx.stroke();
        }
    }
    gridToggle.addEventListener('change', renderPerspectiveTelemetryGrid);

    // --- Onion Skin Renderer ---
    function updateOnionSkinRaster() {
        oCtx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);
        if (animationSequence.length === 0) return;

        const referenceFrameIndex = selectedFrameIndex !== null ? selectedFrameIndex - 1 : animationSequence.length - 1;
        if (referenceFrameIndex < 0 || !animationSequence[referenceFrameIndex]) return;

        const frameImageAsset = new Image();
        frameImageAsset.src = animationSequence[referenceFrameIndex];
        frameImageAsset.onload = () => oCtx.drawImage(frameImageAsset, 0, 0);
    }

    // --- Sequencer Timeline Management ---
    function syncSequencerTimelineDeck() {
        frameStripDeck.innerHTML = '';
        document.getElementById('frameStats').textContent = `Total Assets: ${animationSequence.length}`;

        animationSequence.forEach((frameStringData, idx) => {
            const cellElement = document.createElement('div');
            cellElement.className = `frame-cell ${idx === selectedFrameIndex ? 'selected' : ''}`;
            cellElement.style.backgroundImage = `url(${frameStringData})`;
            
            const indexMarker = document.createElement('span');
            indexMarker.className = 'index-tag';
            indexMarker.textContent = String(idx + 1).padStart(2, '0');

            const killNode = document.createElement('div');
            killNode.className = 'kill-btn';
            killNode.textContent = '×';
            killNode.onclick = (e) => {
                e.stopPropagation();
                destructivelyPurgeKeyframe(idx);
            };

            cellElement.onclick = () => mountTargetKeyframeToActiveStage(idx);

            cellElement.appendChild(indexMarker);
            cellElement.appendChild(killNode);
            frameStripDeck.appendChild(cellElement);
        });

        updateOnionSkinRaster();
    }

    btnCapture.addEventListener('click', () => {
        const runtimeStringData = paintCanvas.toDataURL('image/png');
        
        if (selectedFrameIndex !== null) {
            animationSequence[selectedFrameIndex] = runtimeStringData;
            selectedFrameIndex = null; 
        } else {
            animationSequence.push(runtimeStringData);
        }

        pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        syncSequencerTimelineDeck();
    });

    function mountTargetKeyframeToActiveStage(targetIndex) {
        if (isSequencerPlaying) return;
        selectedFrameIndex = targetIndex;
        
        pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        const activeImageLayer = new Image();
        activeImageLayer.src = animationSequence[targetIndex];
        activeImageLayer.onload = () => {
            pCtx.globalCompositeOperation = 'source-over';
            pCtx.drawImage(activeImageLayer, 0, 0);
            configureBrushEnvironment(); 
        };

        syncSequencerTimelineDeck();
    }

    function destructivelyPurgeKeyframe(targetIndex) {
        animationSequence.splice(targetIndex, 1);
        if (selectedFrameIndex === targetIndex) selectedFrameIndex = null;
        pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        syncSequencerTimelineDeck();
    }

    // --- Toolbar Accessories ---
    brushSizeInput.addEventListener('input', configureBrushEnvironment);
    
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
            currentBrushColor = e.target.getAttribute('data-color');
            activeTool = 'brush';
            toolBrush.classList.add('active');
            toolEraser.classList.remove('active');
            toolSTEM.classList.remove('active');
            if (stemLearningSystem) stemLearningSystem.toggleSTEMMode(false);
            document.getElementById('stemModePanel').style.display = 'none';
            configureBrushEnvironment();
        });
    });

    toolBrush.addEventListener('click', () => {
        activeTool = 'brush';
        toolBrush.classList.add('active');
        toolEraser.classList.remove('active');
        toolSTEM.classList.remove('active');
        if (stemLearningSystem) stemLearningSystem.toggleSTEMMode(false);
        const stemPanel = document.getElementById('stemModePanel');
        if (stemPanel) stemPanel.style.display = 'none';
        configureBrushEnvironment();
    });

    toolEraser.addEventListener('click', () => {
        activeTool = 'eraser';
        toolEraser.classList.add('active');
        toolBrush.classList.remove('active');
        toolSTEM.classList.remove('active');
        if (stemLearningSystem) stemLearningSystem.toggleSTEMMode(false);
        const stemPanel = document.getElementById('stemModePanel');
        if (stemPanel) stemPanel.style.display = 'none';
        configureBrushEnvironment();
    });

    // --- Playback Engine ---
    fpsEngineSlider.addEventListener('input', (e) => {
        currentFpsSetting = e.target.value;
        fpsReadout.textContent = `${currentFpsSetting} FPS`;
        if (isSequencerPlaying) {
            clearInterval(playbackIntervalId);
            executeStudioClockSequence();
        }
    });

    function executeStudioClockSequence() {
        let playbackFrameIndex = 0;
        const clockCycleMs = 1000 / currentFpsSetting;

        playbackIntervalId = setInterval(() => {
            if (playbackFrameIndex < animationSequence.length) {
                pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                
                const frameImg = new Image();
                frameImg.src = animationSequence[playbackFrameIndex];
                frameImg.onload = () => {
                    pCtx.globalCompositeOperation = 'source-over';
                    pCtx.drawImage(frameImg, 0, 0);
                };

                const uiTrackCells = document.querySelectorAll('.frame-cell');
                uiTrackCells.forEach(cell => cell.classList.remove('selected'));
                if (uiTrackCells[playbackFrameIndex]) uiTrackCells[playbackFrameIndex].classList.add('selected');

                playbackFrameIndex++;
            } else {
                playbackFrameIndex = 0; 
            }
        }, clockCycleMs);
    }

    btnRunAnimation.addEventListener('click', () => {
        if (animationSequence.length === 0) return;

        if (!isSequencerPlaying) {
            isSequencerPlaying = true;
            btnRunAnimation.textContent = "⏹ Stop";
            btnRunAnimation.className = "action-btn danger";
            playBadge.style.display = "block";
            oCtx.clearRect(0, 0, onionCanvas.width, onionCanvas.height); 
            executeStudioClockSequence();
        } else {
            clearInterval(playbackIntervalId);
            isSequencerPlaying = false;
            btnRunAnimation.textContent = "▶ Play";
            btnRunAnimation.className = "action-btn success";
            playBadge.style.display = "none";
            pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
            configureBrushEnvironment();
            syncSequencerTimelineDeck();
        }
    });

    btnWipe.addEventListener('click', () => {
        clearInterval(playbackIntervalId);
        isSequencerPlaying = false;
        animationSequence = [];
        selectedFrameIndex = null;
        btnRunAnimation.textContent = "▶ Play";
        btnRunAnimation.className = "action-btn success";
        playBadge.style.display = "none";
        pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        oCtx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);
        configureBrushEnvironment();
        syncSequencerTimelineDeck();
    });

    // ===== STEM LEARNING SYSTEM EVENT HANDLERS =====
    function setupSTEMEventListeners() {
        const exitBtn = document.getElementById('exitSTEMMode');
        const startBtn = document.getElementById('startChallenge');
        const backBtn = document.getElementById('backToChallenges');

        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                stemLearningSystem.toggleSTEMMode(false);
                toolSTEM.classList.remove('active');
                const stemPanel = document.getElementById('stemModePanel');
                if (stemPanel) stemPanel.style.display = 'none';
                document.getElementById('stemChallengeInfo').style.display = 'none';
                document.getElementById('stemChallengeSelector').style.display = 'grid';
                document.getElementById('stemHintsContainer').style.display = 'none';
                document.getElementById('toggleHints').style.display = 'none';
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                stemLearningSystem.startChallenge();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.getElementById('stemChallengeInfo').style.display = 'none';
                document.getElementById('stemChallengeSelector').style.display = 'grid';
                document.getElementById('stemHintsContainer').style.display = 'none';
                document.getElementById('toggleHints').style.display = 'none';
            });
        }
    }
});