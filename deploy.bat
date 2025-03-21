@echo off
echo -----------------------------------------------
echo Deploying BrandSphere to Vercel (Debug Version)
echo -----------------------------------------------

:: Set environment variables for deployment
set VERCEL_PROJECT_ID=prj_9HrTlV4HZhQtxHcWfTZgHPDVsMjR
set VERCEL_ORG_ID=team_vdvx9Ku6liQpWFNDhcPy5GkG
set NEXTJS_IGNORE_ESLINT=1
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_SOURCEMAPS=1
set NODE_OPTIONS=--max-old-space-size=4096

:: Force node version
echo Ensuring correct Node.js version...
call nvm use 18.17.0 || echo Node version change failed, continuing with current version

:: Clean cache
echo Cleaning Vercel cache...
call vercel env pull .env.local
call vercel env pull .env.production.local
call rmdir /s /q .vercel\cache 2>nul
call rmdir /s /q .next 2>nul
call rmdir /s /q node_modules\.cache 2>nul

:: Install dependencies
echo Installing dependencies...
call npm install

:: Run the deployment with verbose mode
echo Starting deployment (with build logs)...
call vercel deploy --prod --debug --yes

echo -----------------------------------------------
echo If deployment failed, try these troubleshooting steps:
echo 1. Check the Vercel logs with: vercel logs
echo 2. Try deploying with just: vercel --prod
echo 3. Visit the Vercel dashboard and check the build logs
echo ----------------------------------------------- 