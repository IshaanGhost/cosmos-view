# API Setup Guide

## N2YO.com API Integration

This application uses the [N2YO.com REST API v1](https://www.n2yo.com/api) for real-time satellite tracking data.

### Getting Your Free API Key

1. **Register at N2YO.com**
   - Visit https://www.n2yo.com/login/
   - Create a free account

2. **Generate API Key**
   - Log in to your account
   - Navigate to your profile page
   - Scroll down to the "API Key" section
   - Click "Generate API Key"
   - Copy your API key

3. **Configure in Your Project**
   - Create a `.env` file in the project root directory
   - Add your API key:
     ```
     VITE_N2YO_API_KEY=your_api_key_here
     ```
   - Restart your development server if it's running

### Free Tier Limits

The free tier includes:
- ✅ 1000 position requests per hour
- ✅ 1000 TLE requests per hour  
- ✅ 100 visual pass calculations per hour

For most use cases, this is more than sufficient.

### Testing Your API Key

Once configured, you should see:
- ✅ "Real-time TLE" indicator in the Tracker view
- ✅ Live TLE data loading in the Catalog view
- ✅ No yellow warning alerts about missing API key

### Fallback Mode

If no API key is configured, the app will:
- Use cached/fallback TLE data
- Still display satellite tracking (less accurate)
- Show a warning alert with a link to get an API key

### Alternative: Aviation Edge API

If you prefer to use [Aviation Edge Satellite Tracker API](https://aviation-edge.com/satellite-tracking-api) instead:

1. You'll need a Premium plan (paid)
2. Modify `src/lib/satellite-api.ts` to use Aviation Edge endpoints
3. Update environment variable to `VITE_AVIATION_EDGE_API_KEY`

**Note**: N2YO.com is recommended for free tier usage.

## Troubleshooting

### "API key not configured" Warning

- Ensure your `.env` file is in the project root (same level as `package.json`)
- Check that the variable name is exactly `VITE_N2YO_API_KEY`
- Restart your dev server after adding the API key
- Make sure there are no quotes around the API key value

### API Rate Limit Errors

- Free tier has hourly limits
- The app includes rate limiting protection
- Wait an hour if you hit the limit, or consider upgrading

### CORS Errors

If you see CORS errors in the browser console:
- N2YO.com API should handle CORS properly
- Ensure you're using the correct API endpoint format
- Check browser console for specific error messages

## Need Help?

- N2YO API Documentation: https://www.n2yo.com/api
- Contact N2YO Support: https://www.n2yo.com/about/?a=feedback

