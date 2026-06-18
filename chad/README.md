# Cheesemation 🧀
**An Interactive Animation Studio with STEM Learning Integration**

Cheesemation is a web-based animation tool that combines creative drawing with educational STEM challenges. Students can create frame-by-frame animations while learning about mathematics, physics, engineering, and technology through practical challenges.

---

## 📁 Project Files Overview

### **index.html**
The main HTML structure of the application.

**Key Sections:**
- **Navigation Bar** (`<nav>`): Contains the studio logo, theme selector buttons, and playback status badge
- **Theme Selector**: 5 buttons for switching between visual themes (saved to browser storage)
  - 🌙 Dark (default)
  - 🧀 Cheese Dark / Cheese Light
  - 🌊 Blue Dark / Blue Light
- **Workspace Grid** (main layout):
  - **Left Sidebar** (`.toolbar-sidebar`): Tool icons for Brush, Eraser, and STEM Learning Mode
  - **Center Canvas** (`.stage-viewport`): The drawing canvas with 3 layered canvases:
    - `onionSkinCanvas`: Shows previous frame at reduced opacity
    - `gridOverlayCanvas`: Optional grid for precise positioning
    - `paintCanvas`: Main drawing surface (interactive)
  - **Right Sidebar** (`.inspector-sidebar`): Controls for brush size, colors, FPS, and STEM mode interface

**STEM Panel Features:**
- Real-time coordinate display showing canvas X/Y position
- Challenge selector with difficulty ratings
- Challenge details with formula, step-by-step instructions, and hints
- Toggle button to show/hide helpful guiding questions

---

### **app.js**
The core application logic handling user interactions, animation sequencing, and state management.

**Major Components:**

#### **1. Canvas Setup & Initialization**
- Gets references to all canvas elements and their 2D contexts
- Initializes UI element references (buttons, sliders, input fields)
- Sets up initial brush configuration

#### **2. Theme System** (Lines ~24-46)
```javascript
// Loads saved theme from browser storage, applies it, and updates on button clicks
// Themes persist across page reloads using localStorage
```
- Gets 5 theme buttons from DOM
- Loads previously saved theme (or defaults to 'dark')
- Applies theme via `data-theme` attribute on `<html>` element
- Updates active theme button on click
- Saves selection to `localStorage`

#### **3. STEM Learning System Integration** (Lines ~48-71)
- Creates instance of STEMLearningSystem if available
- Handles STEM button clicks to toggle educational mode
- Manages mutual exclusivity between tools (only one tool active at a time)
- Deactivates brush/eraser when STEM mode is activated and vice versa

#### **4. Painting System** (Lines ~95-180)
- **`configureBrushEnvironment()`**: Sets up canvas drawing properties (line width, color, composite operation)
- **`getCanvasSpacePointerCoords(e)`**: Converts mouse screen coordinates to canvas coordinates (accounting for scaling)
- **Mouse Event Handlers**:
  - `mousedown`: Starts drawing stroke
  - `mousemove`: Continues stroke while drawing OR displays coordinates in STEM mode
  - `mouseup`: Ends drawing stroke
  - `mouseleave`: Hides coordinates when leaving canvas

#### **5. Grid Display System** (Lines ~182-196)
- `renderPerspectiveTelemetryGrid()`: Draws optional grid overlay on canvas
- Grid is 32 pixels per cell, helps with precise positioning for STEM challenges
- Toggled via "Developer Grid" checkbox

#### **6. Onion Skin (Previous Frame) System** (Lines ~198-207)
- `updateOnionSkinRaster()`: Shows semi-transparent previous frame for reference
- Helps animators maintain consistency between frames
- Only shows when a frame is selected or at the last frame

#### **7. Frame Sequencer Timeline** (Lines ~209-255)
- `syncSequencerTimelineDeck()`: Updates the bottom frame strip UI
- Creates frame thumbnails with frame numbers and delete buttons
- Manages frame selection and rendering
- Updates frame counter display

#### **8. Playback Engine** (Lines ~257-311)
- `executeStudioClockSequence()`: Plays animation at set FPS
- Cycles through frames continuously
- Updates FPS readout and play badge
- Manages interval-based frame advancement

#### **9. Animation Controls** (Lines ~313+)
- **Play/Stop Button**: Toggles playback
  - Shows playback badge when playing
  - Updates button text and styling
  - Clears onion skin during playback
- **Capture Button**: Saves current canvas as a frame
  - Replaces selected frame or appends new frame
  - Automatically clears canvas after capture
- **Wipe Button**: Resets animation sequence entirely
- **FPS Slider**: Adjusts animation speed (1-24 FPS)

#### **10. Tool Selection System** (Lines ~220-282)
- **Brush Tool**: Sets color and eraser mode off
  - Clicking color swatches also activates brush tool
- **Eraser Tool**: Uses "destination-out" composite operation to remove pixels
- **STEM Tool**: Toggles educational challenge mode
- Tools are mutually exclusive (one active at a time)

#### **11. STEM Event Listeners** (Lines ~354+)
- `setupSTEMEventListeners()`: Attaches handlers to STEM UI buttons
- **Exit Button**: Leaves STEM mode, hides panel
- **Start Challenge**: Begins challenge timer (placeholder implementation)
- **Back Button**: Returns from challenge details to challenge list
- Properly resets UI state when navigating

---

### **stem.js**
The STEM (Science, Technology, Engineering, Mathematics) learning system with educational challenges.

**Class Structure:**

#### **STEMChallenge Class** (Lines ~1-15)
Data structure for each educational challenge with properties:
- `title`: Challenge name
- `category`: Subject area (math, science, technology, engineering)
- `difficulty`: Star rating (1-4)
- `description`: Brief explanation
- `frames`: Total frames needed for animation
- `formula`: Mathematical/physical equation
- `instructions`: Step-by-step guide with coordinate hints
- `validator`: Function to check if animation is correct
- `hints`: Guiding questions to help students think through the problem

#### **STEMLearningSystem Class** (Lines ~18+)

**Constructor:**
- Initializes challenge library using `initializeChallenges()`
- Sets up STEM UI elements

**`initializeChallenges()` Method:** (Lines ~28+)
Defines 8 built-in challenges:

1. **Growing Circle** (Math, ⭐):
   - Create circle growing from radius 10 to 120
   - Demonstrates linear scaling
   - Formula: `radius = frame * (120 / 12)`
   - Includes detailed coordinate positioning guides and hints about center points

2. **Rotating Square** (Math, ⭐⭐):
   - Rotate square 360° in 24 frames
   - Formula: `θ = frame * (360° / 24)`

3. **Sine Wave Motion** (Math, ⭐⭐):
   - Ball moving in sinusoidal path across screen
   - Formula: `y = 240 + 100*sin(frame * π/12), x = frame * (640/48)`

4. **Bouncing Ball (Gravity)** (Science, ⭐⭐⭐):
   - Simulate gravity physics with energy loss
   - Formula: `y = y₀ + v₀t + ½gt²`

5. **Orbiting Planet** (Science, ⭐⭐⭐):
   - Planetary motion around a sun
   - Formula: `x = x₀ + r*cos(θ), y = y₀ + r*sin(θ)`

6. **Interlocking Gears** (Engineering, ⭐⭐⭐):
   - Show gear transmission with opposite rotation
   - Formula: `Gear1: θ = frame * 3.75°, Gear2: θ = -frame * 3.75°`

7. **Binary Counter** (Technology, ⭐⭐):
   - Visualize binary counting from 0 to 31
   - Show bit changes visually

8. **Projectile Motion** (Physics, ⭐⭐):
   - Launch object with gravity and trajectory
   - Formula: `x = v₀t*cos(θ), y = v₀t*sin(θ) - ½gt²`

**`setupSTEMUI()` Method:** (Lines ~210+)
Creates the HTML template for the STEM panel that gets inserted into the right sidebar.

**`toggleSTEMMode()` Method:** (Lines ~227+)
Switches STEM mode on/off:
- Shows/hides STEM panel in sidebar
- Populates challenge list when entering STEM mode

**`createSTEMPanel()` Method:** (Lines ~237+)
Dynamically inserts STEM UI into the DOM if not already present.

**`populateChallengeSelector()` Method:** (Lines ~246+)
Creates clickable challenge buttons:
- Shows difficulty stars, title, and category
- Adds hover effects for interactivity
- Links to `selectChallenge()` method

**`selectChallenge()` Method:** (Lines ~271+)
Displays challenge details:
- Shows title with star rating
- Displays description, formula, and step-by-step instructions
- Populates hints section (if available)
- Adds toggle button to show/hide hints
- Updates UI panel layout

**`startChallenge()` Method:** (Lines ~310+)
Begins challenge (currently shows alert with frame count and instructions).

**Validator Methods** (Lines ~314+):
Placeholder validation functions that would check if student animations match challenge requirements:
- `validateGrowingCircle()`
- `validateRotatingSquare()`
- `validateSineWave()`
- `validateBouncingBall()`
- `validateOrbitingPlanet()`
- `validateGearRotation()`
- `validateBinaryCounter()`
- `validateProjectileMotion()`

---

### **style.css**
All visual styling and layout for the application.

**Major Sections:**

#### **1. Theme Definitions** (Lines ~1-68)
Five complete color schemes using CSS custom properties:

**Default Dark** (`:root, [data-theme="default"]`):
- Background: `#141419` (very dark gray)
- Accents: Blue (`#2f80ed`), Green (`#27ae60`), Red (`#eb5757`)

**Cheese Dark** (`[data-theme="cheese-dark"]`):
- Warm brown tones: `#1a1510` background
- Gold accents: `#f4c430`
- Perfect for warm, cozy theme

**Cheese Light** (`[data-theme="cheese-light"]`):
- Cream background: `#fffdf9`
- Dark brown text: `#3d2b1f`
- Soft, readable light theme

**Blue Dark** (`[data-theme="blue-dark"]`):
- Deep navy: `#0a0f1a`
- Cyan accents: `#4a9eff`
- Modern, cool appearance

**Blue Light** (`[data-theme="blue-light"]`):
- Light sky: `#f0f5ff`
- Dark blue text: `#0f1628`
- Professional light theme

#### **2. Global Styles** (Lines ~67+)
- Box sizing: `border-box` (padding included in width)
- Flexbox layout for full-screen app

#### **3. Navigation Bar** (Lines ~81+)
- Fixed 48px height at top
- Displays logo and theme buttons horizontally
- Theme buttons have hover scale and glow effects

#### **4. Workspace Grid** (Lines ~111+)
- Main flex container with three sections
- Left/right sidebars fixed width, center takes remaining space

#### **5. Toolbar Sidebar** (Lines ~121+)
- Tool icons (brush, eraser, STEM)
- 40x40px buttons with hover states
- Active tool highlighted in accent color

#### **6. Canvas Stack** (Lines ~142+)
- 640x480px white canvas area
- Three overlaid canvases for layers:
  - onionSkin: 35% opacity (previous frame reference)
  - gridOverlay: 15% opacity (positioning guide)
  - paintCanvas: 100% opacity (main drawing layer)
- Shadow and rounded corners for depth

#### **7. Inspector Sidebar** (Lines ~165+)
- 280px fixed width on right
- Flexbox column layout
- Contains controls for brush, colors, grid, frames, and animation

#### **8. Color Palette** (Lines ~215+)
- 5 color swatches
- Click to select color for brush
- Active swatch has blue glow effect

#### **9. Animation Controls** (Lines ~235+)
- FPS slider with green accent color
- Play/Stop button styling
- Frame deck (timeline) styling at bottom

#### **10. Responsive Adjustments** (Lines ~178+)
- Light themes adjust background gradient
- Canvas visibility rules for layered effects

---

## 🎨 How the App Works Together

### **Drawing Workflow:**
1. User selects a tool (Brush/Eraser) from left sidebar
2. Clicks color swatch to set brush color
3. Draws on canvas
4. Clicks "Append Keyframe" to save current canvas as a frame
5. Canvas clears, ready for next frame
6. Repeats for each frame needed
7. Adjusts FPS slider
8. Clicks "Play" to preview animation

### **STEM Learning Workflow:**
1. User clicks 🧬 STEM button
2. STEM panel appears on right sidebar
3. User clicks a challenge to see details
4. Reads instructions and sees coordinates display while hovering over canvas
5. Clicks "Show Hints" for guiding questions
6. Creates animation following instructions with real-time coordinate feedback
7. Animation plays on canvas

### **Theme Application:**
1. User clicks theme button in navbar
2. JavaScript applies `data-theme` attribute to `<html>`
3. CSS custom properties update throughout entire app
4. Selection saved to browser's localStorage
5. Theme persists on page reload

---

## 🎯 Key Features

✅ **Multi-layer Canvas System** - Onion skin, grid, and paint layers  
✅ **Real-time Coordinate Display** - Know exact canvas positions  
✅ **8 STEM Challenges** - Learn physics, math, engineering, and computer science  
✅ **5 Visual Themes** - Dark, light, cheese, blue options  
✅ **Theme Persistence** - Your theme choice is saved automatically  
✅ **FPS Control** - Animate at 1-24 frames per second  
✅ **Frame-by-Frame Editing** - Full control over each animation frame  
✅ **Persistent Storage** - Theme preference saved in browser  
✅ **Educational Hints** - Guiding questions to promote critical thinking  

---

## 🚀 Future Enhancements

- [ ] Animation validation system (check if student meets challenge requirements)
- [ ] Challenge progress tracking
- [ ] Export animations as GIF or video
- [ ] Undo/Redo functionality
- [ ] Keyboard shortcuts
- [ ] More STEM challenges (chemistry, biology, etc.)
- [ ] Multiplayer/classroom mode
- [ ] Sound effects and music integration

| Switch Tools | Click tool icon (Brush/Eraser) |
| Save Frame | Click "+ Append Keyframe" |
| Edit Frame | Click frame thumbnail |
| Delete Frame | Click × on frame thumbnail |
| Adjust Brush Size | Move "Brush Dimension" slider |
| Toggle Grid | Check "Enable View Grid Mapping" |
| Set Playback Speed | Move "Rate Speed Engine" slider |
| Play/Stop | Click "▶ Play" / "⏹ Stop" |
| Reset All | Click "Reset" |
| STEM Mode | Click 🧬 icon |

### Canvas Settings
- **Resolution**: 640×480 pixels
- **Background**: Pure white
- **Drawing Area**: Centered in viewport
- **Coordinate System**: (0,0) at top-left

## 🎓 STEM Challenges

### Beginner Level ⭐
- **Growing Circle**: Linear scaling demonstration
- **Rotating Line**: Basic rotation and angles
- **Binary Counter**: Digital number systems

### Intermediate Level ⭐⭐
- **Sine Wave Motion**: Trigonometric functions
- **Orbiting Planet**: Parametric equations
- **Rotating Square**: Geometric transformations

### Advanced Level ⭐⭐⭐
- **Bouncing Ball**: Gravity and physics
- **Gear Rotation**: Mechanical systems
- **Pendulum Motion**: Simple harmonic motion

### Expert Level ⭐⭐⭐⭐
- **Wave Interference**: Wave superposition
- **Projectile Motion**: Complex trajectories

## 🛠️ File Structure

```
Multimedia/cheesemation/
├── index.html           # HTML structure and UI layout
├── app.js              # Main animation logic
├── stem.js             # STEM learning system
├── style.css           # Styling and layout
├── DOCUMENTATION.md    # Technical documentation
├── STEM_GUIDE.md      # Learning modules and challenges
└── README.md          # This file
```

## 🎯 Use Cases

### Educational
- **Teach Animation Principles**: Understand frame-by-frame basics
- **STEM Learning**: Visualize mathematical and physics concepts
- **Computer Science**: Learn algorithms through animation
- **Art & Design**: Explore motion and composition

### Professional
- **Storyboarding**: Quick visual planning
- **Motion Studies**: Analyze movement patterns
- **Presentations**: Create engaging animations
- **Prototyping**: Test animation concepts

## 💡 Pro Tips

### For Smooth Animations
- Use more frames (48+) for complex motion
- Maintain consistent spacing between frames
- Use grid for alignment precision
- Preview frequently to catch issues
- Start with 12 FPS, increase for smoothness

### For STEM Challenges
- Study the provided formula carefully
- Draw with grid enabled for accuracy
- Use consistent positioning
- Test calculations in separate frames
- Document your mathematical patterns

### Performance Optimization
- Limit animations to 1000+ frames for browser stability
- Clear unused frames to free memory
- Use 12-16 FPS for smooth playback
- Close other browser tabs for better performance

## 🔧 Technical Details

### Canvas Layers (Bottom to Top)
1. **onionSkinCanvas**: Previous frame reference (35% opacity)
2. **paintCanvas**: Active drawing surface
3. **gridOverlayCanvas**: Reference grid (15% opacity)

### Color Reference
| Color | Hex | Usage |
|-------|-----|-------|
| Black | #141419 | Primary background |
| Dark Gray | #1f1f26 | Panel background |
| Light Gray | #2d2d38 | Surface background |
| Blue | #2f80ed | Primary accent |
| Green | #27ae60 | Success state |
| Red | #eb5757 | Danger/Error state |

### Browser Requirements
- Modern browser with HTML5 Canvas support
- JavaScript ES6+ capabilities
- Mouse input device
- Minimum 1024×768 resolution recommended

## 🎬 Creating Your First Animation

### Example: Bouncing Ball

**Step 1**: Set up (Frames 1-3)
- Frame 1: Draw ball at top (320, 100)
- Frame 2: Move ball down (320, 150)
- Frame 3: Move ball down (320, 200)

**Step 2**: Fall (Frames 4-10)
- Continue moving down with increasing speed
- Each frame move 10-20 pixels lower
- Frame 10: Ball at bottom (320, 450)

**Step 3**: Bounce (Frames 11-20)
- Reverse direction, move upward
- Decrease speed (smaller movements)
- Start next bounce cycle

**Step 4**: Playback
- Set FPS to 12
- Click Play
- Watch your ball bounce!

## 📊 Animation Statistics

| Metric | Value |
|--------|-------|
| Maximum Frames | Limited by browser memory |
| Canvas Resolution | 640×480 pixels |
| Min Brush Size | 1 pixel |
| Max Brush Size | 50 pixels |
| Min FPS | 1 frames/second |
| Max FPS | 24 frames/second |
| Color Palette | 5 colors |
| Grid Spacing | 32 pixels |

## 🎨 Color Palette

```
┌─────────────┬──────────┬─────────────────┐
│ Black       │ #141419  │ ███████████████ │
│ Red         │ #eb5757  │ ███████████████ │
│ Orange      │ #f2994a  │ ███████████████ │
│ Green       │ #27ae60  │ ███████████████ │
│ Blue        │ #2f80ed  │ ███████████████ │
└─────────────┴──────────┴─────────────────┘
```

## 🔗 Learning Resources

### Mathematics & Physics
- [3Blue1Brown Essence of Trigonometry](https://www.youtube.com/watch?v=PFDu9oVAE-g)
- [Crash Course Physics](https://www.youtube.com/playlist?list=PL8dPuuaLjXtPAJr1ysd5yGIyiV5_8EsxQ)
- [Khan Academy - Trigonometry](https://www.khanacademy.org/math/trigonometry)

### Animation & Principles
- [12 Principles of Animation](https://en.wikipedia.org/wiki/12_basic_principles_of_animation)
- [Animation Reference Library](https://www.animationresources.org/)

### STEM Visualization
- [Desmos Graphing Calculator](https://www.desmos.com/calculator)
- [PhET Interactive Simulations](https://phet.colorado.edu/)

## ❓ Frequently Asked Questions

**Q: Can I save my animations?**
A: Currently, animations are stored in browser memory. Use browser export features or screenshot the playback.

**Q: How many frames can I create?**
A: Limited by available browser memory. Typically 1000+ frames on modern systems.

**Q: Can I import images?**
A: Currently, only drawing is supported. You can trace over images by using browser tools.

**Q: Is there undo/redo?**
A: Currently not available. Use caution when editing frames.

**Q: Can I export animations?**
A: Yes, through browser screenshot tools or by recording screen capture.

**Q: Works on mobile/tablet?**
A: Mouse input required. Touch support coming in future versions.

## 🐛 Troubleshooting

### Animation plays too fast/slow
- Adjust FPS slider (1-24)
- Lower FPS = slower playback
- Higher FPS = faster playback

### Drawing feels laggy
- Close other browser tabs
- Reduce animation frame count
- Try different brush sizes

### Grid not visible
- Check "Enable View Grid Mapping" checkbox
- Grid opacity is low (15%) by default

### Frames not saving
- Ensure "+ Append Keyframe" button is clicked
- Check frame count in "Total Assets" display

## 📝 Version Info

**NexAnim Studio Pro v1.0**
- Release Date: 2026
- Status: Production Ready
- Browser Support: Chrome, Firefox, Safari, Edge (latest)

## 📄 License & Attribution

**Educational Software** - Free for educational use

## 🤝 Contributing & Feedback

Have ideas for improvements? Found a bug?
- Document clearly what you found
- Include steps to reproduce issues
- Suggest specific enhancements

## 🎊 Getting Started

1. Open `index.html` in a modern web browser
2. Start drawing on the canvas
3. Explore the toolbar and inspector panel
4. Create your first animation
5. Try a STEM challenge when ready

**Happy animating! 🎬✨**

---

*NexAnim Studio Pro - Where Art Meets Science Through Animation*
