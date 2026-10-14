# Sepang Grand Prix: 3D Circuit Racer

A high-performance 3D racing simulation and championship experience faithfully modeled after Malaysia's world-renowned Sepang International Circuit. Players pilot Formula 1 open-wheelers and GT3 endurance cars across Sepang's 15 iconic turns against intelligent AI rivals with dynamic cameras, real-time telemetry, and procedural audio synthesis.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following core design directions were confirmed during initial clarification and are locked into the system architecture:

- **Confirmed Camera & Visual Engine**: Full 3D simulation powered by Three.js featuring both an agile 3rd-person chase camera with dynamic FOV/damping and an immersive 1st-person cockpit view with active digital dashboard gauges.
- **Confirmed Race Format**: Multi-car Championship Race against a grid of AI competitors, featuring authentic 5-red-light starting gantry countdowns, live sector timing, position tracking, and podium celebrations.
- **Confirmed Vehicle Roster**: Multi-class selection featuring high-downforce Formula 1 single-seaters (with DRS boost on Sepang's twin 900m+ straights) and balanced GT3 endurance sports cars with realistic drift physics and mechanical grip.
- **Circuit Fidelity**: Accurate procedural recreation of Sepang's 5.543 km layout including Turn 1/2 downhill hairpin, high-speed Turn 5/6 sweeps, Turn 9 uphill braking zone, the massive Back Straight, Turn 15 final hairpin, and the signature Hibiscus dual-canopy grandstands.

---

### 1. Overview & Core Concept

- **What It Does**: Puts the player in the driver's seat at the Sepang International Circuit. Players configure their machine (F1 or GT3), choose race distance and weather conditions (Dry Tropical, Sunset, or Wet Monsoon), line up on the grid, and battle AI opponents across multiple laps with realistic acceleration, slipstreaming, braking, and cornering physics.
- **Target Audience / Persona**: Racing enthusiasts, F1/motorsport fans, and casual gamers who enjoy responsive arcade-sim handling, high-speed circuit mastery, and authentic track landmarks.
- **Key Value**: Delivers console-inspired circuit racing directly in the browser with zero load screens or external asset 404s, combining smooth 60fps Three.js WebGL graphics with procedural audio and telemetry HUDs.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Paddock & Garage Setup**:
   - Inspect 3D car models in a minimalist showroom with 360-degree rotation.
   - Select vehicle class: **Formula 1 Apex-26** (345 km/h top speed, instant DRS, knife-edge braking) vs. **Sepang GT3 Thunder** (295 km/h, forgiving slip angle, deep mechanical rumble).
   - Choose race settings: Lap count (1, 3, or 5 laps), AI difficulty (Rookie, Pro, Master), and weather/lighting (Dry Daylight, Golden Hour Sunset, Monsoon Wet with wet asphalt reflections).
2. **The Grid & Starting Sequence**:
   - Cars line up in grid slots along the Sepang main straight facing the pedestrian gantry.
   - Five red lights illuminate sequentially with authentic audio tones, followed by "LIGHTS OUT AND AWAY WE GO!".
   - Launch control sprint toward the tight Turn 1 braking zone.
3. **Lap Navigation & On-Track Racing**:
   - Master the 15 distinct turns with apex kerb rumble, tire smoke, and distance markers (150m / 100m / 50m).
   - Activate DRS on the 927m Main Straight and Back Straight when within 1 second of an opponent.
   - Toggle camera views on the fly between 3rd-person chase and in-cockpit dash view.
4. **Checkered Flag & Post-Race Telemetry**:
   - Race completion screen showing final classification (P1–P8), fastest lap time, sector splits (S1, S2, S3), top speed recorded, and option to restart or enter Time Trial mode.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-energy motorsport minimalism inspired by official Formula 1 broadcast graphics and modern sim-racing cockpits.
- **Color Palette**:
  - Deep Asphalt Canvas: `#0F172A` (Midnight Slate) and `#1E293B`
  - Sepang Racing Red: `#EF4444` (Curbs, brake markers, warning revs)
  - Petronas Circuit Green / Cyan: `#00A19B` / `#06B6D4` (DRS active, optimal shift indicators, timing delta)
  - Trophy Amber: `#F59E0B` (Yellow flags, podium badge)
  - Pure White: `#FFFFFF` (Timing digits, sector intervals)
- **Typography & Hierarchy**:
  - Headers & Telemetry: `Chakra Petch` / `Oxanium` / `monospace` with `tabular-nums` for speeds, lap timers, and gear indicators.
  - Body & UI Controls: `Plus Jakarta Sans` for clean, unboxed race settings and menus.
- **Component Styling & Layout**:
  - Full-bleed 3D canvas filling the entire screen.
  - Floating broadcast-style HUD: Sector delta in top-left, interactive track mini-map in top-right, F1-style rev bar + digital gear/speedometer pinned in bottom-center, and race position tower on mid-left.
  - Collapsible HUD options and on-screen touch controls for mobile/tablet racers.

---

### 3. Key Product Decisions & Trade-Offs

- **Procedural 3D Geometry vs. External Model Files**:
  - *Chosen Approach*: Procedurally construct high-fidelity 3D car models (chassis, front wings, rear wings, halo, sidepods, suspension arms, tires with brake discs) and circuit landmarks (canopy grandstand, pit garages, marshals, kerbs) directly using Three.js buffer geometries and canvas textures.
  - *Why*: Guarantees zero 404 network errors, lightning-fast instant loading, customizable liveries, and zero external dependency fragility.
- **Procedural Web Audio Engine**:
  - *Chosen Approach*: Synthesize multi-harmonic engine RPM tones, tire squeal friction white-noise filters, wind slipstream whoosh, and curb thumps using the browser's Web Audio API (`AudioContext`).
  - *Why*: Responsive pitch-shifting mapped directly to real engine RPM and gear shifts without audio buffer lag or missing sound files.
- **Physics Model Balance (Sim-Cade)**:
  - *Chosen Approach*: Accessible yet rewarding sim-cade physics model incorporating acceleration curves, gear ratios, downforce-assisted grip, lateral slip/drift friction, brake locking, and curb vibration.
  - *Why*: Pure simulation is unforgiving on keyboards/touchscreens, while pure arcade feels weightless. Sim-cade delivers thrilling cornering speeds while rewarding clean racing lines.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              APP ROOT                                  │
│               GameState (Menu / Paddock / Racing / Results)            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌────────────────────────────────────┐
│      3D THREE.JS WORLD VIEW      │        │       BROADCAST TELEMETRY HUD      │
│  - WebGLRenderer (ACES Filmic)   │        │  - Race Position Tower (P1-P8)     │
│  - RoomEnvironment Reflection    │        │  - Digital Speedometer & Tach Bar  │
│  - TrackSpline (15 Sepang Turns) │        │  - Real-Time Sepang Mini-Map       │
│  - Procedural Grandstands/Trees  │        │  - Lap Times & Sector 1/2/3 Splits │
│  - Player & AI Vehicle Entities  │        │  - DRS Status & Camera Toggle      │
│  - Dynamic Weather & Rain Spray  │        │  - Touch Racing Controls (Mobile)  │
└────────────────┬─────────────────┘        └─────────────────┬──────────────────┘
                 │                                            │
                 └───────────────────────┬────────────────────┘
                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       CIRCUIT SIMULATION ENGINE                        │
│  - Physics & Handling (Acceleration, Braking, Steering, Aerodynamics)  │
│  - AI Rival Pathfinding & Slipstream Drafting Logic                    │
│  - Lap Timing, Checkpoint Validation & Waypoint Navigation             │
│  - Procedural Web Audio Engine (RPM Oscillation, Tires, Curb Thump)    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Circuit Layout Specifications (Sepang 5.543km)
- **Turn 1 & 2**: Hard braking hairpin into tight downhill chicane.
- **Turn 3**: Sweeping full-throttle right bend.
- **Turn 4**: 90-degree technical right.
- **Turns 5 & 6**: Fast high-G sweeping left-right chicane.
- **Turns 7 & 8**: Medium-speed double right-handers.
- **Turn 9**: 1st-gear uphill left hairpin.
- **Turn 10**: Right-hand flick towards back section.
- **Turn 11**: Fast downhill right-hander.
- **Turns 12 & 13**: High-speed sweeping left-right complex.
- **Turn 14**: Medium right turn opening onto the Back Straight.
- **Back Straight & Turn 15**: 927m straightaway leading to wide final hairpin connecting back to the Main Straight flanked by the iconic Sepang double-sided Hibiscus grandstand.

#### State Management & Interactive Handlers
- **Vehicle Store**: Selected vehicle class (F1 / GT3), livery color, tuning preset (Downforce vs Top Speed).
- **Session Store**: Mode (Championship Grid Race / Time Trial), lap count (1/3/5), weather (Day / Sunset / Wet).
- **Live Race State**: Lap count, sector timestamps, current position, gap to leader, AI positions, car speed, RPM, gear, DRS availability, steering angle.
- **Input System**: Multi-input handler supporting keyboard (WASD / Arrow Keys, Space for handbrake/brake, Shift/B for DRS boost, C for camera switch, R for reset) and intuitive on-screen touch pedals/steering buttons.
