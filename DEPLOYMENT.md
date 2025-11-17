# Deployment Guide for CIDR Calculator Pro

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Deploy from the project directory:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: (select your account)
   - Link to existing project: `N`
   - Project name: `cidr-calculator-pro`
   - Directory: `./`
   - Override settings: `N`

4. Your app will be deployed! Vercel will provide:
   - Production URL: `https://cidr-calculator-pro.vercel.app`
   - Deployment dashboard link

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub (already done! ✅)

2. Visit [vercel.com/new](https://vercel.com/new)

3. Import your GitHub repository:
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

4. Configure project:
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

5. Click "Deploy"

6. Wait 1-2 minutes for deployment to complete

7. Access your live app at the provided URL!

## Environment Variables

No environment variables required! The app runs entirely on Next.js API routes with no external dependencies.

## Build Verification

Before deploying, ensure the build works locally:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000` to test.

## Post-Deployment Testing

Test all features on your live URL:

1. **CIDR to Range**: `192.168.1.0/24`
2. **Range to CIDR**: `10.0.0.0` → `10.0.3.255`
3. **Subnetting**: `172.16.0.0/16` with 4 subnets
4. **Mask Converter**: Convert `255.255.255.0`
5. **Overlap Checker**: Check `192.168.1.0/24` and `192.168.1.128/25`

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance

- **Build time**: ~30 seconds
- **Cold start**: <500ms
- **Response time**: <100ms
- **Bundle size**: Optimized with Next.js 15 + Turbopack

## Monitoring

Vercel provides built-in:
- Analytics
- Performance metrics
- Error tracking
- Deployment logs

Access via: `https://vercel.com/dashboard`

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### API routes not working
- Ensure all files in `app/api/` have `route.ts` naming
- Check Vercel deployment logs for errors

### TypeScript errors
```bash
# Type check locally
npm run build
```

## Success! 🎉

Your CIDR Calculator Pro is now live and ready to use!

Share the URL with your team for professional network planning and IP management.
