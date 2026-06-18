# Cheesemation - Complete Documentation

## Overview
**Cheesemation** is a web-based frame-by-frame animation creation tool with STEM educational integration. It allows users to create animations by drawing frames sequentially, then playing them back at variable frame rates.

---

## Core Features

### 1. **Drawing Canvas**
- **Main Canvas (paintCanvas)**: 640x480px interactive drawing surface where users create animation frames
- **Drawing Tools**:
  - 🖌️ **Brush Tool**: Freehand drawing with color selection
  - 🧽 **Eraser Tool**: Remove content using alpha compositing
- **Brush Controls**:
  - Adjustable size (1-50px)
  - 5-color palette: Black, Red, Orange, Green, Blue
  - Real-time brush configuration

### 2. **Onion Skinning**
- **Purpose**: Display previous frame as semi-transparent reference overlay
- **Canvas**: `onionSkinCanvas` (layered beneath paint canvas)
- **Function**: Helps animators maintain consistency between frames for smooth motion

### 3. **Grid Overlay**
- **Purpose**: Reference grid for alignment and spacing
- **Grid Spacing**: 32-pixel intervals
- **Toggle**: Checkbox control in inspector panel
- **Canvas**: `gridOverlayCanvas` (top layer)

### 4. **Keyframe System**
- **Animation Sequence**: Array of canvas data URLs (PNG format)
- **Frame Capture**: "+ Append Keyframe" button saves current canvas state
- **Frame Management**:
  - Edit existing frames by clicking timeline thumbnail
  - Delete frames with × button on timeline
  - Visual feedback of selected frame

### 5. **Timeline/Sequencer**
- **Frame Strip Display**: Horizontal timeline showing all animation frames
- **Features**:
  - Thumbnail previews of each frame
  - Frame numbering (padded to 2 digits: 01, 02, etc.)
  - Frame count display
  - Click to select/edit frame
  - Delete button on each frame

### 6. **Playback Engine**
- **FPS Control**: Adjustable frame rate (1-24 FPS)
- **Playback Loop**: Animations play repeatedly
- **Real-time FPS Display**: Shows current playback speed
- **Engine Cycle**: Uses `setInterval` with millisecond calculations
- **Frame Display**: Canvas cleared and redrawn for each frame

### 7. **Animation State Management**
- **Architecture Registers**:
  - `isPainting`: Track active brush strokes
  - `animationSequence[]`: Array storing all frame data
  - `selectedFrameIndex`: Currently edited frame
  - `activeTool`: Current tool (brush/eraser)
  - `currentBrushColor`: Active color hex value
  - `isSequencerPlaying`: Playback state flag
  - `currentFpsSetting`: Active frame rate

---

## Technical Architecture

### Canvas Rendering Hierarchy
```
Layer 1 (Top):     gridOverlayCanvas    → Grid reference (optional)
Layer 2 (Middle):  paintCanvas          → Active drawing surface
Layer 3 (Bottom):  onionSkinCanvas      → Previous frame reference
```

### Coordinate System
- Canvas resolution: 640×480 pixels
- Input coordinates scaled from browser viewport to canvas space via `getCanvasSpacePointerCoords()`

### Composite Operations
- **Brush Mode**: `source-over` (standard drawing)
- **Eraser Mode**: `destination-out` (transparent removal)

---

## User Workflow

1. **Create Animation**:
   - Draw on canvas using brush tool
   - Adjust brush size and select color
   - Click "+ Append Keyframe" to save frame
   - Repeat for each frame

2. **Edit Animation**:
   - Click any frame in timeline to load it
   - Modify existing frame content
   - Adjust FPS as needed

3. **Preview**:
   - Set desired playback speed with "Rate Speed Engine" slider
   - Click "▶ Play" to start animation
   - Press "⏹ Stop" to halt playback

4. **Reset**:
   - "Reset" button clears all frames and canvas

---

## UI Components

### Navigation Bar
- **NEXANIM STUDIO PRO**: Branding/title
- **ENGINE PLAYBACK RUNNING**: Badge that displays during playback

### Toolbar Sidebar
- **Tool Selection**: Brush/Eraser toggle (40×40px icons)
- **Active Indicator**: Blue highlight on selected tool

### Inspector Panel
- **Brush Dimension**: Size range slider (1-50)
- **Swatch Matrices**: 5-color palette selector
- **Developer Grid**: Toggle checkbox
- **Keyframe Control**: Capture button
- **Sequencer Execution**: FPS slider + Play/Stop/Reset buttons

### Timeline Dock
- **Frame Counter**: "Linear Keyframe Sequencer Tracking Track"
- **Asset Stats**: Total frame count
- **Frame Strip**: Interactive timeline with thumbnails

---

## Color Scheme
- **Primary Background**: #141419 (Near black)
- **Panel Background**: #1f1f26 (Dark gray)
- **Surface Color**: #2d2d38 (Lighter gray)
- **Accent Blue**: #2f80ed
- **Accent Green**: #27ae60
- **Accent Red**: #eb5757
- **Text Primary**: #f2f2f2 (Off-white)
- **Text Muted**: #aaaaaa (Gray)

---

## File Structure

```
Multimedia/chad/
├── index.html       → HTML structure and canvas setup
├── app.js          → Core animation logic and event handlers
├── style.css       → Styling and layout
├── DOCUMENTATION.md → This file
├── stem.js         → STEM educational modules (NEW)
└── STEM_GUIDE.md   → STEM learning resources (NEW)
```

---

## API Reference

### Key Functions

#### `configureBrushEnvironment()`
Applies current brush settings (size, color, tool mode) to canvas context.

#### `getCanvasSpacePointerCoords(e)`
Converts mouse coordinates from viewport space to canvas space.
**Returns**: `{x: number, y: number}`

#### `renderPerspectiveTelemetryGrid()`
Draws reference grid on grid canvas with 32px spacing.

#### `updateOnionSkinRaster()`
Updates onion skin reference with previous frame image.

#### `syncSequencerTimelineDeck()`
Rebuilds timeline UI with all frames and updates frame count.

#### `mountTargetKeyframeToActiveStage(targetIndex)`
Loads specified frame for editing.

#### `destructivelyPurgeKeyframe(targetIndex)`
Removes frame at specified index.

#### `executeStudioClockSequence()`
Initiates playback loop with current FPS setting.

---

## Event Listeners

| Element | Event | Action |
|---------|-------|--------|
| paintCanvas | mousedown | Begin stroke |
| paintCanvas | mousemove | Continue stroke |
| window | mouseup | End stroke |
| gridToggle | change | Update grid display |
| brushSizeInput | input | Reconfigure brush |
| .color-swatch | click | Change active color |
| toolBrush | click | Switch to brush mode |
| toolEraser | click | Switch to eraser mode |
| fpsEngineSlider | input | Update playback speed |
| btnCapture | click | Save current frame |
| btnRunAnimation | click | Toggle playback |
| btnWipe | click | Reset all frames |
| .frame-cell | click | Load frame for editing |
| .kill-btn | click | Delete frame |

---

## Performance Considerations

- **Canvas Rendering**: Uses requestAnimationFrame indirectly via setInterval
- **Memory Usage**: Each frame stored as data URL (PNG format) in memory
- **Optimization**: Onion skin only loads one previous frame
- **Playback**: Dynamic interval calculation prevents frame skipping

---

## Browser Compatibility

- Requires HTML5 Canvas API support
- Mouse input (no touch support in current version)
- Data URL / toDataURL() support for frame capture
- Modern browser with ES6+ JavaScript support

---

## Future Enhancement Opportunities

1. Touch/tablet support with stylus pressure
2. Layer system for complex animations
3. Export to GIF/MP4 formats
4. Undo/redo system
5. Animation templates and guides
6. STEM educational challenges
7. Shape primitives (circles, rectangles, lines)
8. Color picker and gradients
9. Frame interpolation
10. Animation library/templates

---

## STEM Integration Guide

See `STEM_GUIDE.md` for educational features and learning modules.
