#!/bin/bash

echo "🔍 Checking project structure..."

# Check required files
echo "📁 Checking files..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "proxy-server.js" ]; then
    echo "❌ proxy-server.js not found!"
    exit 1
fi

if [ ! -f "thesinhvien.html" ]; then
    echo "❌ thesinhvien.html not found!"
    exit 1
fi

echo "✅ All required files exist"

# Check package.json structure
echo "📦 Checking package.json..."
if ! grep -q '"start".*"node proxy-server.js"' package.json; then
    echo "❌ Missing or incorrect start script in package.json"
    exit 1
fi

if ! grep -q '"engines"' package.json; then
    echo "❌ Missing engines field in package.json"
    exit 1
fi

echo "✅ package.json looks good"

# Check proxy-server.js
echo "🌐 Checking proxy-server.js..."
if ! grep -q "process.env.PORT" proxy-server.js; then
    echo "❌ PORT environment variable not used in proxy-server.js"
    exit 1
fi

echo "✅ proxy-server.js configured for deployment"

# Test dependencies
echo "📋 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️ node_modules not found. Installing dependencies..."
    npm install
fi

echo "🧪 Testing local server..."
echo "Starting server for 5 seconds..."
timeout 5s npm start &
SERVER_PID=$!

sleep 2

# Test if server is responding
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Project is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. git init (if not already initialized)"
echo "2. git add ."
echo "3. git commit -m 'Initial commit'"
echo "4. git remote add origin YOUR_GITHUB_REPO_URL"
echo "5. git push -u origin main"
echo "6. Deploy on Render.com"
echo ""
echo "Render.com Settings:"
echo "- Build Command: npm install"
echo "- Start Command: npm start"
echo "- Environment: Node"
