@echo off
echo BrandSphereAI Deployment Script
echo =============================
echo This script will deploy your optimized dashboard to Vercel
echo.

echo Step 1: Making sure all changes are committed to git...
git add .
git commit -m "Dashboard optimization and deployment" --allow-empty

echo.
echo Step 2: Deploying to Vercel...
echo You may need to authenticate if you haven't already
vercel --prod

echo.
echo If the deployment was successful, your site should be live!
echo Visit your Vercel dashboard to see the deployment status and URL.
echo.
echo Press any key to exit...
pause > nul 