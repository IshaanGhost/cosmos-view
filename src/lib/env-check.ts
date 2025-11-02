/**
 * Environment variable diagnostic helper
 * Use this to debug API key issues
 */

export const checkEnvironment = () => {
  const apiKey = import.meta.env.VITE_N2YO_API_KEY;
  
  console.log('=== Environment Variable Check ===');
  console.log('VITE_N2YO_API_KEY exists:', !!apiKey);
  console.log('VITE_N2YO_API_KEY value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('All VITE_ env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
  console.log('===============================');
  
  return {
    hasApiKey: !!apiKey,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : null,
    allViteVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  };
};

