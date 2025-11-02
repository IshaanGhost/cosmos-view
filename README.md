# 🛰️ Cosmos View - Real-Time Satellite Tracker

A beautiful, real-time satellite tracking web application built with React, TypeScript, and Leaflet. Track satellites like the ISS, view comprehensive satellite catalogs, and calculate visible passes from your location.

## Features

- **Real-Time Tracking**: Live satellite position tracking with beautiful map visualizations
- **Satellite Catalog**: Browse popular satellites with up-to-date TLE (Two-Line Element) data
- **Pass Calculator**: Calculate when satellites will be visible from your location (Phase 2)
- **Multiple Map Views**: Toggle between minimal and satellite imagery views
- **Trajectory Visualization**: See past and future orbital paths

## Technologies

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Leaflet** - Interactive maps
- **satellite.js** - Orbital mechanics calculations
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Styling
- **N2YO.com API** - Real-time satellite data

## Setup

### Prerequisites

- Node.js 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm))

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd cosmos-view-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key (Optional but Recommended)**

   For real-time satellite data, you'll need a free API key from [N2YO.com](https://www.n2yo.com/login/):
   
   - Register at https://www.n2yo.com/login/
   - Log in and visit your profile page
   - Scroll down to generate your API key
   - Create a `.env` file in the root directory:
     ```bash
     VITE_N2YO_API_KEY=your_api_key_here
     ```
   
   **Note**: The app will work without an API key using fallback cached data, but for live updates, the API key is required.

   Free tier limits:
   - 1000 positions/hour
   - 1000 TLE/hour  
   - 100 visual passes/hour

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## API Integration

This project integrates with the [N2YO.com REST API v1](https://www.n2yo.com/api) for real-time satellite tracking data.

### Available Endpoints

- **TLE Data**: Fetches Two-Line Element sets for satellite orbit calculation
- **Position Data**: Gets current satellite positions
- **Visual Passes**: Calculates when satellites will be visible (for Phase 2)

### API Service

The API integration is handled in:
- `src/lib/satellite-api.ts` - API client functions
- `src/hooks/useSatelliteTLE.ts` - React hook for TLE data
- `src/hooks/useSatelliteCatalog.ts` - React hook for catalog data

## Project Structure

```
src/
├── components/
│   ├── TrackerView.tsx      # Real-time satellite tracking map
│   ├── CatalogView.tsx     # Satellite catalog with TLE data
│   ├── CalculatorView.tsx  # Pass calculator (Phase 2)
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useSatelliteTLE.ts        # TLE data fetching hook
│   └── useSatelliteCatalog.ts    # Catalog data hook
├── lib/
│   ├── satellite-api.ts    # N2YO API client
│   └── utils.ts            # Utility functions
└── pages/
    ├── Index.tsx           # Main page
    └── NotFound.tsx       # 404 page
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Setting Up Environment Variables in Lovable

Before publishing your site, you need to configure the API key in Lovable's settings:

1. **Open your Lovable project**
   - Visit [Lovable](https://lovable.dev/projects/d36c5b90-106f-45f7-9f46-669a8cb1ade1)

2. **Navigate to Settings**
   - Click on **Project** → **Settings** (or use the gear icon)
   - Look for **Environment Variables** or **Build Variables** section

3. **Add Your API Key**
   - Click **Add Variable** or **Add Environment Variable**
   - Variable Name: `VITE_N2YO_API_KEY`
   - Variable Value: `TE8ZZD-2N75SZ-QC6VU4-5LHA` (your API key)
   - Make sure to click **Save**

4. **Publish Your Site**
   - Go to **Share** → **Publish**
   - The API key will be injected during the build process
   - Your published site will have access to the real-time satellite API

### Important Notes

- ✅ Your local `.env` file stays private (never pushed to Git)
- ✅ Lovable environment variables are separate from your Git repo
- ✅ The API key in Lovable settings is secure and won't be exposed in the code
- ✅ Each deployment will use the environment variables configured in Lovable

### Without API Key

If you publish without setting the API key in Lovable:
- The site will still work using fallback cached TLE data
- Users will see a warning message about missing API key
- Real-time updates won't be available

### Custom Domain

For custom domain setup, navigate to Project > Settings > Domains and click Connect Domain.

## Contributing

Changes made via Lovable will be committed automatically to this repo. You can also work locally using your preferred IDE and push changes.

## License

MIT License

## Credits

- Satellite data provided by [N2YO.com](https://www.n2yo.com/)
- Built with [Lovable](https://lovable.dev/)
