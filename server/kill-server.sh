#!/bin/bash

echo "🔍 Looking for Node.js processes..."

# Find and display Node processes related to the server
echo "Current Node processes:"
ps aux | grep -E "(node|nodemon)" | grep -v grep

echo ""
echo "🛑 Killing Node.js server processes..."

# Kill nodemon processes
pkill -f nodemon && echo "✅ Killed nodemon processes" || echo "ℹ️  No nodemon processes found"

# Kill node processes running server.js
pkill -f "node.*server.js" && echo "✅ Killed node server processes" || echo "ℹ️  No node server processes found"

# Kill any node processes on port 5000 (if we had the tools)
# fuser -k 5000/tcp 2>/dev/null && echo "✅ Killed processes on port 5000" || echo "ℹ️  No processes found on port 5000"

echo ""
echo "✅ Cleanup complete! You can now try starting your server again."
echo "Run: npm run dev"