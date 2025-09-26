# Vercel Environment Variables Setup

## How to Configure Environment Variables on Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

3. **Add Environment Variables**
   Add these variables one by one:

   ```
   Name: VITE_API_URL
   Value: https://your-backend-domain.com/api
   Environment: Production (or All)
   ```

   ```
   Name: VITE_INFURA_API_KEY
   Value: 3e7de97412bd4e9d8adc98a6ed2e9a21
   Environment: Production (or All)
   ```

   ```
   Name: VITE_ENVIRONMENT
   Value: production
   Environment: Production
   ```

   ```
   Name: VITE_WALLETCONNECT_PROJECT_ID
   Value: d77f88a21bd9ea69547c2b23b71953ef
   Environment: Production (or All)
   ```

4. **Redeploy**
   - After adding variables, redeploy your application
   - Go to "Deployments" tab and click "Redeploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_API_URL
vercel env add VITE_INFURA_API_KEY
vercel env add VITE_ENVIRONMENT
vercel env add VITE_WALLETCONNECT_PROJECT_ID

# Deploy
vercel --prod
```

### Method 3: Using vercel.json (Not Recommended for Secrets)

```json
{
  "env": {
    "VITE_ENVIRONMENT": "production"
  }
}
```

**Note**: Don't put sensitive keys in vercel.json as it's committed to git.

## Environment-Specific Configuration

### Development
```
VITE_API_URL=http://localhost:5000/api
VITE_INFURA_API_KEY=3e7de97412bd4e9d8adc98a6ed2e9a21
VITE_ENVIRONMENT=development
VITE_WALLETCONNECT_PROJECT_ID=d77f88a21bd9ea69547c2b23b71953ef
```

### Production
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_INFURA_API_KEY=3e7de97412bd4e9d8adc98a6ed2e9a21
VITE_ENVIRONMENT=production
VITE_WALLETCONNECT_PROJECT_ID=d77f88a21bd9ea69547c2b23b71953ef
```

## Important Notes

1. **Vite Environment Variables**: Must start with `VITE_` to be accessible in the browser
2. **Security**: API keys for frontend are public - ensure they're restricted by domain/referrer
3. **Infura Security**: Configure your Infura project to only allow requests from your domain
4. **Redeploy**: Always redeploy after changing environment variables