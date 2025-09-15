#!/bin/bash
# Complete application startup script

echo "🚀 Starting Ice Cream Shop Application..."

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "📦 Starting MongoDB..."
    sudo mkdir -p /data/db
    sudo chown -R ubuntu:ubuntu /data/db
    sudo rm -f /var/log/mongod.log
    sudo touch /var/log/mongod.log
    sudo chown ubuntu:ubuntu /var/log/mongod.log
    
    mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017 &
    sleep 3
    
    if pgrep mongod > /dev/null; then
        echo "✅ MongoDB started successfully!"
    else
        echo "❌ Failed to start MongoDB"
        exit 1
    fi
else
    echo "✅ MongoDB is already running"
fi

# Start the backend server
echo "🔧 Starting Backend Server..."
cd /workspace/server
npm run dev &
SERVER_PID=$!
sleep 2

# Start the frontend client
echo "🎨 Starting Frontend Client..."
cd /workspace/client
npm run dev &
CLIENT_PID=$!

echo ""
echo "🎉 Application started successfully!"
echo ""
echo "📍 Services:"
echo "   🗄️  MongoDB:  mongodb://127.0.0.1:27017"
echo "   🔧 Backend:   http://localhost:5000"
echo "   🎨 Frontend:  http://localhost:5173"
echo ""
echo "⏹️  To stop all services, press Ctrl+C or run:"
echo "   pkill -f 'mongod\\|nodemon\\|vite'"
echo ""

# Keep the script running
wait