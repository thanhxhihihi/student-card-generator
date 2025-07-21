@echo off
echo 🔍 Checking project structure...

REM Check required files
echo 📁 Checking files...
if not exist "package.json" (
    echo ❌ package.json not found!
    exit /b 1
)

if not exist "proxy-server.js" (
    echo ❌ proxy-server.js not found!
    exit /b 1
)

if not exist "thesinhvien.html" (
    echo ❌ thesinhvien.html not found!
    exit /b 1
)

echo ✅ All required files exist

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed or not in PATH
    exit /b 1
)

echo ✅ npm is available

REM Install dependencies if needed
if not exist "node_modules" (
    echo ⚠️ node_modules not found. Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
)

echo ✅ Dependencies are installed

echo.
echo 🎉 Project is ready for deployment!
echo.
echo Next steps:
echo 1. git init (if not already initialized)
echo 2. git add .
echo 3. git commit -m "Initial commit"
echo 4. git remote add origin YOUR_GITHUB_REPO_URL
echo 5. git push -u origin main
echo 6. Deploy on Render.com
echo.
echo Render.com Settings:
echo - Build Command: npm install
echo - Start Command: npm start  
echo - Environment: Node
echo.
pause
