# API Key Troubleshooting Guide

## Common Issues and Solutions

### Issue: "API key not configured" but you have it in `.env`

### ✅ Solution 1: Check .env File Format

Your `.env` file must be **exactly** in this format (no spaces, no quotes):

```env
VITE_N2YO_API_KEY=TE8ZZD-2N75SZ-QC6VU4-5LHA
```

**Common Mistakes:**
- ❌ `VITE_N2YO_API_KEY = TE8ZZD-2N75SZ-QC6VU4-5LHA` (spaces around =)
- ❌ `VITE_N2YO_API_KEY="TE8ZZD-2N75SZ-QC6VU4-5LHA"` (quotes)
- ❌ `VITE_N2YO_API_KEY='TE8ZZD-2N75SZ-QC6VU4-5LHA'` (single quotes)
- ✅ `VITE_N2YO_API_KEY=TE8ZZD-2N75SZ-QC6VU4-5LHA` (correct)

### ✅ Solution 2: Restart Dev Server

**Vite only reads `.env` files when the server starts!**

1. **Stop** your dev server (Ctrl+C in the terminal)
2. **Start** it again: `npm run dev`
3. The API key should now be loaded

### ✅ Solution 3: Verify File Location

The `.env` file must be in the **root directory** (same folder as `package.json`):

```
cosmos-view-main/
├── .env              ← Must be here!
├── package.json
├── vite.config.ts
└── src/
```

### ✅ Solution 4: Check Browser Console

1. Open your browser DevTools (F12)
2. Go to the Console tab
3. Look for environment check logs when you open the Catalog view
4. It will show if VITE_N2YO_API_KEY is detected

### ✅ Solution 5: Verify File Encoding

The `.env` file should be:
- UTF-8 encoding (most text editors default to this)
- Unix line endings (LF) or Windows (CRLF) - both work
- No BOM (Byte Order Mark)

### ✅ Solution 6: Manual Verification

Create/update your `.env` file manually:

1. Open a text editor (VS Code, Notepad++)
2. Create a file named `.env` (with the dot at the start!)
3. Add this line exactly:
   ```
   VITE_N2YO_API_KEY=TE8ZZD-2N75SZ-QC6VU4-5LHA
   ```
4. Save the file in the project root
5. Restart your dev server

### ✅ Solution 7: Test in Code

You can temporarily add this to check if Vite sees the variable:

In `src/lib/satellite-api.ts`, temporarily add:
```typescript
console.log('API Key from env:', import.meta.env.VITE_N2YO_API_KEY);
console.log('All env vars:', import.meta.env);
```

### Still Not Working?

1. **Check if `.env` is in `.gitignore`** (it should be!)
2. **Try a different variable name** temporarily to test:
   ```env
   VITE_TEST_VAR=hello
   ```
   Then check if `import.meta.env.VITE_TEST_VAR` works
3. **Check for typos** in variable name - must be exactly `VITE_N2YO_API_KEY`
4. **Verify the API key itself works** - test it with curl or Postman

## Quick Fix Steps

1. ✅ Stop dev server
2. ✅ Check `.env` file exists in root
3. ✅ Verify format: `VITE_N2YO_API_KEY=your_key` (no spaces, no quotes)
4. ✅ Save the file
5. ✅ Start dev server: `npm run dev`
6. ✅ Check browser console for environment logs
7. ✅ Refresh the Catalog view

