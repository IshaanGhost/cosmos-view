# 🛰️ Cosmos View - Real-Time Satellite Tracker

<div align="center">

![Satellite Tracker](https://img.shields.io/badge/Satellite-Tracker-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A beautiful, feature-rich web application for tracking satellites in real-time, viewing comprehensive satellite catalogs, and calculating visible passes from any location on Earth.

🌐 **[Live Demo](https://cosmos-view.lovable.app)** • [Features](#-features) • [Quick Start](#-quick-start) • [API Setup](#-api-configuration) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technologies](#-technologies)
- [Quick Start](#-quick-start)
- [API Configuration](#-api-configuration)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits)

---

## 🌟 Overview

**Cosmos View** is a modern, real-time satellite tracking application that brings space exploration to your browser. Built with cutting-edge web technologies, it provides an intuitive interface for:

- **Real-Time Tracking**: Monitor multiple satellites simultaneously with live position updates
- **Interactive Maps**: Beautiful visualizations using Leaflet maps with multiple view modes
- **Satellite Catalog**: Browse popular satellites with up-to-date TLE (Two-Line Element) data
- **Pass Calculator**: Calculate when satellites will be visible from your location
- **Multi-Satellite Support**: Track up to 8 popular satellites including ISS, Hubble, Tiangong, and more

Perfect for astronomy enthusiasts, educators, students, or anyone curious about what's happening in Earth's orbit!

### 🌐 Try It Live

Visit the live deployment: **[https://cosmos-view.lovable.app](https://cosmos-view.lovable.app)**

The application is fully functional and includes all features described in this documentation.

---

## ✨ Features

### 🎯 Real-Time Satellite Tracking

- **Live Position Updates**: Satellite positions update every second for smooth tracking
- **Multi-Satellite Display**: Track multiple satellites simultaneously with unique color-coded markers
- **Trajectory Visualization**: 
  - Past trajectory (solid lines, 5 minutes)
  - Future trajectory (dashed lines, 5 minutes)
  - Smooth, continuous paths that wrap naturally around the globe
- **Interactive Map**: 
  - Minimal view (dark theme)
  - Satellite imagery view
  - Smooth zoom and pan controls
  - Click satellites for detailed information

### 📚 Satellite Catalog

- **Popular Satellites**: Pre-configured list of 7 popular satellites
- **Live TLE Data**: Real-time Two-Line Element sets from N2YO.com API
- **Detailed Information**: View satellite names, NORAD IDs, and TLE data
- **Auto-Refresh**: TLE data updates automatically
- **Error Handling**: Graceful fallback when API is unavailable

### 🧮 Pass Calculator

- **Visual Pass Predictions**: Calculate when satellites will be visible from your location
- **Detailed Information**: Each pass includes:
  - Start time, direction, and elevation
  - Maximum elevation and time
  - End time, direction, and elevation
  - Duration and magnitude (brightness)
- **Multiple Satellites**: Calculate passes for 8 popular satellites at once
- **10-Day Forecast**: Predict passes up to 10 days in advance
- **Real-Time API**: Uses N2YO.com visual passes endpoint

### 🎨 User Interface

- **Modern Design**: Clean, dark-themed interface built with shadcn/ui
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Three Main Views**: 
  - **Tracker**: Real-time satellite tracking map
  - **Catalog**: Satellite catalog with TLE data
  - **Calculator**: Pass visibility calculator
- **Intuitive Navigation**: Easy switching between views with highlighted active tab

---

## 🛠️ Technologies

### Core Framework

- **[Vite](https://vitejs.dev/)** (v5.4) - Next-generation frontend build tool
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Development proxy for CORS handling

- **[React](https://react.dev/)** (v18.3) - Modern UI library
  - Hooks-based architecture
  - Component reusability
  - Efficient rendering

- **[TypeScript](https://www.typescriptlang.org/)** (v5.8) - Type-safe JavaScript
  - Enhanced IDE support
  - Compile-time error checking
  - Better code documentation

### Mapping & Visualization

- **[Leaflet](https://leafletjs.com/)** (v1.9) - Open-source mapping library
  - Interactive maps with multiple tile layers
  - Custom markers and polylines
  - Smooth animations and transitions

- **[satellite.js](https://github.com/shashwatak/satellite-js)** (v6.0) - Orbital mechanics calculations
  - TLE parsing and propagation
  - ECI to geodetic coordinate conversion
  - Accurate orbital predictions

### UI Components & Styling

- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
  - Accessible components built on Radix UI
  - Customizable with Tailwind CSS
  - Dark mode support

- **[Tailwind CSS](https://tailwindcss.com/)** (v3.4) - Utility-first CSS framework
  - Rapid UI development
  - Responsive design utilities
  - Custom theme configuration

### Data & State Management

- **[TanStack Query](https://tanstack.com/query)** (v5.83) - Data fetching and caching
  - Automatic caching and refetching
  - Background updates
  - Optimistic updates support

- **[React Router](https://reactrouter.com/)** (v6.30) - Client-side routing
  - Declarative routing
  - Nested routes support

### API Integration

- **[N2YO.com REST API](https://www.n2yo.com/api)** - Real-time satellite data
  - TLE (Two-Line Element) data
  - Satellite positions
  - Visual pass predictions

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript-specific linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

**Recommended**: Use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) for easier Node.js version management.

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/IshaanGhost/cosmos-view.git
   cd cosmos-view
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages including React, TypeScript, Leaflet, and UI components.

3. **Configure API Key (Optional but Recommended)**

   Create a `.env` file in the project root:
   ```bash
   touch .env
   ```
   
   Add your N2YO.com API key:
   ```env
   VITE_N2YO_API_KEY=your_api_key_here
   ```
   
   **Note**: See [API Configuration](#-api-configuration) section for detailed instructions on obtaining an API key.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

5. **Open in your browser**
   
   Navigate to `http://localhost:8080` to see the application running.

### Verify Installation

After starting the dev server, you should see:

- ✅ Application loads without errors
- ✅ Header with "🛰️ Satellite Tracker" title
- ✅ Three navigation tabs (Tracker, Catalog, Calculator)
- ✅ Tracker view shows a world map with ISS marker (if API key is configured)
- ✅ No console errors in browser DevTools

---

## 🔑 API Configuration

### Getting a Free API Key

The application uses the [N2YO.com REST API](https://www.n2yo.com/api) for real-time satellite data. Follow these steps to get your free API key:

1. **Register an account**
   - Visit https://www.n2yo.com/login/
   - Click "Sign Up" and create a free account
   - Verify your email address if required

2. **Generate API key**
   - Log in to your N2YO.com account
   - Navigate to your profile page
   - Scroll down to the "API Key" section
   - Click "Generate API Key" or "View API Key"
   - Copy your API key (format: `XXXXX-XXXXX-XXXXX-XXXX`)

3. **Add to your project**
   - Create a `.env` file in the project root (if it doesn't exist)
   - Add your API key:
     ```env
     VITE_N2YO_API_KEY=XXXXX-XXXXX-XXXXX-XXXX
     ```
   - **Important**: Do NOT include quotes around the API key
   - Save the file

4. **Restart the development server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again
   - The API key will now be loaded

### Free Tier Limits

The N2YO.com free tier includes:

| Endpoint | Limit |
|----------|-------|
| Position Requests | 1,000 per hour |
| TLE Requests | 1,000 per hour |
| Visual Pass Calculations | 100 per hour |

**Note**: The application includes built-in rate limiting (200ms delay between requests) to help you stay within these limits.

### Using Without API Key

The application will work without an API key, but with limitations:

- ⚠️ Uses fallback/cached TLE data (less accurate)
- ⚠️ No real-time position updates
- ⚠️ Warning message displayed to users
- ✅ Basic tracking functionality still works
- ✅ Trajectory visualization available

### Environment Variables

The application uses the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_N2YO_API_KEY` | No | N2YO.com API key for real-time data |

**Security Note**: Since this is a client-side application, the API key will be visible in the browser's JavaScript bundle. This is normal for public APIs like N2YO.com that use rate limiting. If your key is compromised, you can regenerate it in your N2YO.com profile.

---

## 📖 Usage Guide

### Tracker View

The Tracker view provides real-time satellite tracking on an interactive world map.

#### Selecting Satellites

1. Click the **"Select Satellites"** button (top-right)
2. Check/uncheck satellites to track:
   - ISS (ZARYA) - International Space Station
   - HUBBLE SPACE TELESCOPE
   - TIANGONG SPACE STATION
   - NOAA 19
   - TERRA
   - SENTINEL-1A
   - STARLINK-1007
   - JAMES WEBB SPACE TELESCOPE
3. Each satellite appears with a unique color-coded marker
4. Close the panel by clicking the X or outside the panel

#### Viewing Satellite Details

- Click any satellite marker on the map
- View detailed information in the left sidebar:
  - Satellite name
  - Current latitude and longitude
  - Altitude (km)
  - Speed (km/s)
  - TLE data status

#### Map Controls

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag the map
- **Toggle View**: Click "Satellite View" / "Minimal View" button
  - Minimal View: Dark theme with country outlines
  - Satellite View: Satellite imagery with terrain

#### Trajectory Lines

- **Solid lines** (opaque): Past trajectory (5 minutes)
- **Dashed lines** (semi-transparent): Future trajectory (5 minutes)
- Lines automatically wrap around the globe
- Each satellite has a unique color

### Catalog View

The Catalog view displays a table of popular satellites with their TLE data.

#### Features

- **Live TLE Data**: Real-time Two-Line Element sets from N2YO.com
- **Satellite Information**:
  - NORAD ID (catalog number)
  - Satellite name
  - TLE Line 1 and Line 2
  - Epoch (data timestamp)
- **Status Indicators**:
  - Loading spinner while fetching
  - "Real-time TLE" badge when using API
  - Error message if fetch fails

#### Auto-Refresh

TLE data automatically refreshes when:
- You switch to the Catalog view
- Data becomes stale
- You manually refresh the page

### Calculator View

The Calculator view helps you determine when satellites will be visible from your location.

#### Using the Calculator

1. **Enter Your Location**
   - **Latitude**: Your latitude in decimal degrees (-90 to 90)
     - Example: `40.7128` for New York City
   - **Longitude**: Your longitude in decimal degrees (-180 to 180)
     - Example: `-74.0060` for New York City

2. **Click "Calculate Next Passes"**
   - The calculator fetches pass predictions for all 8 satellites
   - Processing may take 10-20 seconds

3. **View Results**
   - Each satellite shows its passes (if any)
   - Passes are sorted chronologically
   - Up to 3 passes are displayed in detail
   - Additional passes shown with "+X more passes"

#### Understanding Pass Information

Each pass includes:

- **Start**: When the satellite first appears
  - Date and time (local timezone)
  - Direction (compass bearing)
  - Elevation angle (degrees above horizon)
  
- **Maximum Elevation**: Highest point of the pass
  - Time of maximum elevation
  - Direction at maximum elevation
  - Elevation angle (higher = better visibility)
  
- **End**: When the satellite disappears
  - Date and time
  - Direction
  - Elevation angle
  
- **Duration**: How long the pass lasts
- **Magnitude**: Brightness (lower numbers = brighter)

#### Tips for Best Results

- **Higher elevation = better visibility**: Passes above 45° are ideal
- **Magnitude**: Passes with magnitude < 3.0 are easily visible to the naked eye
- **Time of day**: Some passes occur during daylight (not visible)
- **Location accuracy**: More precise coordinates = more accurate predictions

---

## 📁 Project Structure

```
cosmos-view/
├── public/                      # Static assets
│   ├── favicon.svg             # Website icon
│   ├── og-image.svg            # Open Graph image
│   └── robots.txt              # SEO robots file
│
├── src/
│   ├── components/             # React components
│   │   ├── TrackerView.tsx    # Main satellite tracking map
│   │   ├── CatalogView.tsx     # Satellite catalog table
│   │   ├── CalculatorView.tsx  # Pass calculator
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...             # More UI components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSatelliteTLE.ts       # TLE data fetching hook
│   │   └── useSatelliteCatalog.ts  # Catalog data hook
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── satellite-api.ts    # N2YO.com API client
│   │   ├── env-check.ts        # Environment variable checker
│   │   └── utils.ts            # General utilities
│   │
│   ├── pages/                  # Page components
│   │   ├── Index.tsx           # Main page with navigation
│   │   └── NotFound.tsx        # 404 error page
│   │
│   ├── App.tsx                  # Root component with routing
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
│
├── .env                         # Environment variables (not in git)
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── README.md                    # This file
├── SETUP.md                     # Detailed setup guide
└── DEPLOYMENT.md                # Deployment instructions
```

### Key Files Explained

- **`src/components/TrackerView.tsx`**: Main tracking component with Leaflet map integration
- **`src/components/CalculatorView.tsx`**: Pass calculator with API integration
- **`src/lib/satellite-api.ts`**: API client with functions for TLE, positions, and visual passes
- **`vite.config.ts`**: Vite configuration including proxy setup for CORS
- **`.env`**: Your API key (not committed to Git)

---

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:8080` |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Development Workflow

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Make changes**
   - Edit files in `src/`
   - Changes automatically reload (HMR)

3. **Check for errors**
   - Browser console (F12)
   - Terminal output
   - ESLint: `npm run lint`

4. **Test production build**
   ```bash
   npm run build
   npm run preview
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React and TypeScript rules
- **Formatting**: Prettier-compatible (if configured)
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions

### Adding New Satellites

To add a satellite to the tracker:

1. **Edit `src/components/TrackerView.tsx`**
   ```typescript
   const SATELLITE_OPTIONS: SatelliteOption[] = [
     // ... existing satellites
     {
       noradId: YOUR_NORAD_ID,
       name: 'SATELLITE NAME',
       fallbackTLE: {
         line1: 'TLE_LINE_1',
         line2: 'TLE_LINE_2'
       }
     }
   ];
   ```

2. **Add to Calculator** (`src/components/CalculatorView.tsx`)
   ```typescript
   const POPULAR_SATELLITES = [
     // ... existing satellites
     { noradId: YOUR_NORAD_ID, name: 'SATELLITE NAME' }
   ];
   ```

3. **Find NORAD ID**: Visit [N2YO.com](https://www.n2yo.com/) and search for your satellite

### Debugging

**Browser DevTools**:
- Console: Check for JavaScript errors
- Network: Monitor API requests
- React DevTools: Inspect component state

**Common Issues**:
- API key not loading: Check `.env` file location and format
- CORS errors: Ensure Vite proxy is configured (already set up)
- Map not loading: Check Leaflet CSS import
- Type errors: Run `npm run lint`

---

## 🚢 Deployment

### Live Deployment

The application is currently deployed and accessible at:

**🌐 [https://cosmos-view.lovable.app](https://cosmos-view.lovable.app)**

### Building for Production

1. **Create production build**
   ```bash
   npm run build
   ```
   
   This creates an optimized bundle in the `dist/` directory.

2. **Test the build locally**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` folder**
   - Upload contents of `dist/` to your hosting service
   - Ensure your hosting supports SPA routing

### Deploying to Lovable

If deploying through Lovable:

1. **Set environment variables in Lovable**
   - Go to Project → Settings → Environment Variables
   - Add `VITE_N2YO_API_KEY` with your API key value
   - Save changes

2. **Publish**
   - Go to Share → Publish
   - Lovable will build and deploy automatically
   - Environment variables are injected at build time

**See `DEPLOYMENT.md` for detailed Lovable deployment instructions.**

### Other Deployment Options

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_N2YO_API_KEY`

#### GitHub Pages

1. Build the project: `npm run build`
2. Configure `vite.config.ts` with correct `base` path
3. Deploy `dist/` folder to `gh-pages` branch

---

## 🔧 Troubleshooting

### Common Issues

#### API Key Not Working

**Symptoms**: Yellow warning banner, no real-time data

**Solutions**:
1. ✅ Check `.env` file exists in project root
2. ✅ Verify variable name: `VITE_N2YO_API_KEY` (exact spelling)
3. ✅ Remove quotes around API key value
4. ✅ Restart dev server after adding API key
5. ✅ Check browser console for specific errors

#### CORS Errors

**Symptoms**: Network errors in browser console when fetching API

**Solutions**:
- ✅ Vite proxy is already configured for development
- ✅ In production, N2YO.com API handles CORS
- ✅ Check `vite.config.ts` proxy settings if issues persist

#### Map Not Displaying

**Symptoms**: Blank map area

**Solutions**:
1. ✅ Check browser console for errors
2. ✅ Verify Leaflet CSS is imported (already in code)
3. ✅ Check internet connection (needed for map tiles)
4. ✅ Try different map view (minimal vs satellite)

#### Satellites Not Moving

**Symptoms**: Satellites stay in one position

**Solutions**:
1. ✅ Check API key is configured
2. ✅ Verify TLE data is loading (check Catalog view)
3. ✅ Check browser console for API errors
4. ✅ Ensure dev server is running

#### Rate Limit Errors

**Symptoms**: "API error: 429" or "Too many requests"

**Solutions**:
1. ✅ Wait 1 hour (free tier resets hourly)
2. ✅ The app includes rate limiting (200ms between requests)
3. ✅ Consider upgrading N2YO.com plan for higher limits

#### Calculator Shows Errors

**Symptoms**: "Failed to fetch passes" for some satellites

**Solutions**:
1. ✅ Some satellites may not have visible passes for your location
2. ✅ Check API key is valid
3. ✅ Verify coordinates are correct
4. ✅ Wait and try again (rate limiting)
5. ✅ Check N2YO.com API status

### Getting Help

- **Browser Console**: Check for detailed error messages
- **Network Tab**: Inspect API requests and responses
- **N2YO API Docs**: https://www.n2yo.com/api
- **GitHub Issues**: Open an issue with error details

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**
   - Open an issue on GitHub
   - Include steps to reproduce
   - Add browser/OS information

2. **Suggest Features**
   - Open an issue with feature description
   - Explain the use case
   - Discuss implementation approach

3. **Submit Pull Requests**
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Write/update tests if applicable
   - Submit a pull request

### Code Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Cosmos View

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Credits

### Data & APIs

- **[N2YO.com](https://www.n2yo.com/)** - Real-time satellite tracking data and API
  - TLE (Two-Line Element) data
  - Satellite positions
  - Visual pass predictions

### Libraries & Frameworks

- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Leaflet](https://leafletjs.com/)** - Mapping library
- **[satellite.js](https://github.com/shashwatak/satellite-js)** - Orbital mechanics
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework

### Development Platform

- **[Lovable](https://lovable.dev/)** - AI-powered development platform

### Map Tiles

- **CartoDB Dark Matter** - Minimal view map tiles
- **Esri World Imagery** - Satellite imagery tiles

---

## 📊 Project Status

**Current Version**: 1.0.0

**Status**: ✅ Active Development

**Features Completed**:
- ✅ Real-time satellite tracking
- ✅ Multi-satellite support (8 satellites)
- ✅ Interactive map with multiple views
- ✅ Satellite catalog with live TLE data
- ✅ Pass calculator with visual predictions
- ✅ API integration with N2YO.com
- ✅ Responsive design
- ✅ Error handling and fallbacks

**Future Enhancements** (Planned):
- [ ] User location detection (GPS/geolocation)
- [ ] Save favorite satellite lists
- [ ] Historical tracking data
- [ ] More detailed pass information
- [ ] Satellite search functionality
- [ ] Export pass predictions (CSV/PDF)
- [ ] Dark/light theme toggle
- [ ] Internationalization (i18n)

---

## 📞 Support

**Questions or Issues?**

- 📧 Open an issue on [GitHub](https://github.com/IshaanGhost/cosmos-view/issues)
- 📖 Check the [N2YO.com API Documentation](https://www.n2yo.com/api)
- 💬 Review existing issues and discussions

---

<div align="center">

**Made with ❤️ for space enthusiasts**

⭐ Star this repo if you find it helpful!

</div>
