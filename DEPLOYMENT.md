# Deployment Guide for Lovable

## Environment Variables in Production

When deploying through Lovable, environment variables must be configured in **Lovable's settings**, not in your Git repository.

## Step-by-Step: Adding API Key to Lovable

### Option 1: Through Lovable UI

1. **Open Your Project**
   - Go to https://lovable.dev/projects/d36c5b90-106f-45f7-9f46-669a8cb1ade1
   - Or navigate to your project in Lovable

2. **Access Settings**
   - Click on **Project** (left sidebar)
   - Click on **Settings** or look for ⚙️ icon
   - Scroll to find **Environment Variables** or **Build Variables**

3. **Add Environment Variable**
   ```
   Variable Name:  VITE_N2YO_API_KEY
   Variable Value: TE8ZZD-2N75SZ-QC6VU4-5LHA
   ```
   - Click **Add** or **Save**
   - The variable is now available for all deployments

4. **Publish**
   - Go to **Share** → **Publish**
   - Lovable will rebuild with your environment variables

### Option 2: Through Lovable API/CLI (if available)

Check Lovable's documentation for CLI or API methods to set environment variables programmatically.

## How It Works

### During Build
- Vite reads `import.meta.env.VITE_N2YO_API_KEY` at build time
- Lovable injects your configured environment variables
- The value is embedded in the built JavaScript bundle
- **Note**: This means the API key will be visible in the client-side JavaScript

### Security Considerations

⚠️ **Important**: Since this is a client-side app (runs in the browser), the API key will be visible in the browser's JavaScript bundle. This is normal for public APIs like N2YO.com that use rate limiting.

**However**:
- ✅ The API key is rate-limited (1000 requests/hour free tier)
- ✅ N2YO.com API is designed for client-side use
- ✅ If your key is compromised, you can regenerate it at https://www.n2yo.com/login/
- ✅ Consider using a different key for production vs development

### For Sensitive APIs

If you need to use a sensitive API key in the future:
- Consider using a backend proxy server
- The proxy would hold the secret key
- Your frontend calls your proxy, which calls the API

## Testing Your Deployment

After publishing:

1. **Check Browser Console**
   - Open your published site
   - Open browser DevTools (F12)
   - Go to Console tab
   - You should NOT see "API key not configured" warnings

2. **Verify API Works**
   - Go to the Tracker view
   - Check for "Real-time TLE" indicator
   - Satellite position should update in real-time

3. **Check Network Tab**
   - Open DevTools → Network tab
   - Look for requests to `api.n2yo.com`
   - Verify they're successful (200 status)

## Troubleshooting

### API Still Not Working After Deployment

1. **Verify Environment Variable**
   - Go back to Lovable Settings
   - Check that `VITE_N2YO_API_KEY` is exactly spelled (case-sensitive)
   - Ensure no extra spaces or quotes

2. **Rebuild**
   - After adding/changing env vars, you may need to:
   - Unpublish and republish, or
   - Trigger a new deployment

3. **Check Build Logs**
   - In Lovable, check deployment/build logs
   - Look for any errors related to environment variables

4. **Test Locally First**
   - Ensure `.env` works locally
   - This confirms the key itself is valid

### Rate Limit Issues

If you see rate limit errors:
- Free tier: 1000 requests/hour
- The app includes rate limiting (100ms between catalog requests)
- Wait an hour or consider upgrading N2YO.com plan

## Best Practices

1. **Use Different Keys for Dev/Prod** (if needed)
   - Development: Use your personal key
   - Production: Create a separate key if possible

2. **Monitor Usage**
   - Check N2YO.com dashboard for API usage
   - Set up alerts if you approach limits

3. **Document for Team**
   - Add this deployment guide to your project
   - Document where to find environment variable settings

## Alternative: Environment-Specific Keys

If Lovable supports multiple environments (staging, production):

```
Production:  VITE_N2YO_API_KEY = prod_key_here
Staging:     VITE_N2YO_API_KEY = staging_key_here
```

Configure each environment separately in Lovable settings.

