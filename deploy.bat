@echo off
echo.
echo ============================
echo BrandSphere AI Deployment Tool
echo ============================
echo.
echo Starting deployment process...
echo.

:: 1. Test database connection with Neon
echo Testing Neon database connection...
call npm run test:neon
if %ERRORLEVEL% NEQ 0 (
  echo Database connection test failed! Check your connection settings.
  echo You can continue deployment anyway, but the app might not work correctly.
  pause
)

:: 2. Pull environment variables
echo.
echo Pulling latest environment variables from Vercel...
call vercel env pull .env.production.local

:: 3. Install dependencies if needed
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

:: 4. Generate Prisma client
echo.
echo Generating Prisma client...
call npm run prisma:generate

:: 5. Deploy with Neon serverless driver
echo.
echo Starting deployment with Neon serverless driver...
call npm run deploy:vercel

echo.
echo Deployment process completed!
echo.
pause 