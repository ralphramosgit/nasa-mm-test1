# Asteroid Impact Simulator

An interactive 3D asteroid impact simulator built with Next.js, Three.js, React Three Fiber, and Machine Learning. This application integrates real asteroid data from NASA's Near-Earth Object (NEO) API and geological data from USGS APIs to predict and visualize asteroid impact consequences.

## Features

### 🚀 Real-Time Asteroid Data
- Integration with NASA NEO API for real asteroid tracking
- Browse near-Earth objects with detailed orbital information
- Filter potentially hazardous asteroids
- Real-time close approach data

### 🌍 3D Visualization
- Interactive 3D solar system with orbital paths
- Realistic asteroid models with orbital mechanics
- Enhanced Earth visualization with:
  - Procedural land/ocean textures with realistic continents
  - Surface normal mapping for terrain detail
  - Atmospheric glow effect
  - Dynamic rotation animation
- Advanced impact zone visualization with:
  - Crater formation and deformation effects
  - Tsunami wave propagation for ocean impacts
  - Seismic wave visualization for earthquake effects
  - Blast radius and destruction zones
  - Dust cloud atmospheric disturbance
- Animated asteroid impact sequence:
  - Asteroid approach trajectory
  - Impact flash and explosion
  - Progressive crater formation
- Enhanced camera controls:
  - Zoom capability (7-50 units range)
  - Pan and rotate with smooth controls
  - Close-up view for detailed impact inspection

### 🤖 ML-Powered Impact Prediction
- Neural network model for impact consequence prediction
- Predictions based on historical impact patterns
- Analysis of secondary effects including:
  - Infrastructure damage (roads, buildings, utilities)
  - Economic impact (direct/indirect damage, recovery time)
  - Population impact (casualties, displacement, affected area)
  - Environmental impact (crater size, dust cloud, seismic activity)
  - Tsunami generation for ocean impacts (wave height, propagation, affected coastlines)
  - Earthquake effects (magnitude, epicenter depth, shake intensity)

### 📊 Data Analysis & Comparison
- Interactive data tables for asteroid comparison
- Detailed impact prediction reports
- Mitigation scenario analysis with cost-benefit comparison
- Real-time simulation parameter adjustments

### 🛡️ Mitigation Strategies
- Kinetic Impactor deflection
- Gravity Tractor technology
- Nuclear deflection options
- Mass evacuation planning

## Technology Stack

- **Frontend Framework**: Next.js 15 with TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Machine Learning**: TensorFlow.js
- **Styling**: Tailwind CSS
- **APIs**: 
  - NASA NEO (Near-Earth Object) API
  - USGS Earthquake API
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- NASA API Key (optional, DEMO_KEY provided with rate limits)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ralphramosgit/nasa-mm-test1.git
cd nasa-mm-test1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your NASA API key (optional):
```
NEXT_PUBLIC_NASA_API_KEY=your_api_key_here
```

Get a free NASA API key at: https://api.nasa.gov/

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Selecting an Asteroid
1. Browse the list of near-Earth objects in the main table
2. Click on any asteroid to select it
3. View the asteroid in the 3D visualization with its orbital path

### Running Impact Simulations
1. Select an asteroid from the table
2. Adjust simulation parameters in the right panel:
   - Asteroid diameter (km)
   - Impact velocity (km/s)
   - Impact angle (degrees)
   - Target location (latitude/longitude)
3. Click "Run Simulation"
4. View the predicted impact consequences and mitigation options

### Viewing Impact Zones
1. After running a simulation, click "Show Impact" to visualize the impact zone on Earth
2. Click "Animate Impact" to see the full impact sequence:
   - Watch the asteroid approach Earth
   - See the impact flash and explosion
   - Observe crater formation
   - View tsunami wave propagation (for ocean impacts)
   - See seismic wave expansion (earthquake effects)
3. Toggle "Show Orbits" to view or hide asteroid orbital paths
4. Use mouse controls to interact with the 3D scene:
   - **Rotate**: Left-click and drag
   - **Zoom**: Scroll wheel (zoom range: 7-50 units)
   - **Pan**: Right-click and drag
   - Zoom in close to see detailed crater and wave effects

## Project Structure

```
nasa-mm-test1/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main application page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── 3d/                  # 3D visualization components
│   │   ├── ImpactScene.tsx          # Main 3D scene container
│   │   ├── EnhancedEarth.tsx        # Enhanced Earth with realistic textures
│   │   ├── ImpactAsteroid.tsx       # Animated asteroid impact
│   │   ├── Asteroid.tsx             # Asteroid model
│   │   ├── OrbitalPath.tsx          # Orbital path visualization
│   │   └── EarthWithImpactZone.tsx  # Legacy Earth component
│   ├── tables/              # Data table components
│   │   ├── AsteroidDataTable.tsx
│   │   ├── ImpactPredictionTable.tsx
│   │   └── MitigationTable.tsx
│   └── ui/                  # UI components
│       └── SimulationControls.tsx
├── lib/                     # Core libraries
│   ├── services/            # API services
│   │   ├── nasa-neo-service.ts
│   │   └── usgs-service.ts
│   └── ml/                  # Machine learning models
│       └── impact-predictor.ts
├── types/                   # TypeScript type definitions
│   └── asteroid.ts
└── public/                  # Static assets
```

## API Integration

### NASA NEO API
The application uses NASA's Near-Earth Object Web Service to fetch real asteroid data:
- Asteroid physical characteristics
- Orbital parameters
- Close approach data
- Potentially hazardous classification

### USGS API
Integration with USGS Earthquake API for geological assessment:
- Historical earthquake data
- Seismic activity patterns
- Geological risk assessment

## Machine Learning Model

The impact prediction model uses TensorFlow.js to analyze:
- Asteroid size and velocity
- Impact angle and location
- Geological characteristics
- Population density
- Historical impact patterns

The model outputs predictions for:
- Kinetic energy (megatons TNT equivalent)
- Impact radius and crater size
- Casualty estimates
- Economic damage
- Infrastructure destruction
- Environmental effects

## Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- NASA's Near-Earth Object Program for providing comprehensive asteroid data
- USGS for earthquake and geological data
- The Three.js and React Three Fiber communities
- TensorFlow.js team for browser-based machine learning

## Disclaimer

This simulator is for educational and research purposes only. Impact predictions are based on simplified models and should not be used for actual planetary defense planning. For real asteroid threat assessment, consult NASA's Planetary Defense Coordination Office.
