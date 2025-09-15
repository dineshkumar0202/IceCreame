#!/bin/bash
# MongoDB startup script for development

echo "Starting MongoDB..."

# Create data directory if it doesn't exist
sudo mkdir -p /data/db
sudo chown -R ubuntu:ubuntu /data/db

# Create log directory
sudo mkdir -p /var/log/mongodb
sudo touch /var/log/mongod.log
sudo chown ubuntu:ubuntu /var/log/mongod.log

# Start MongoDB
mongod --dbpath /data/db --logpath /var/log/mongod.log --bind_ip 127.0.0.1 --port 27017 &

# Wait a bit for MongoDB to start
sleep 3

# Check if MongoDB is running
if pgrep mongod > /dev/null; then
    echo "✅ MongoDB started successfully!"
    echo "MongoDB is running on localhost:27017"
    echo "Log file: /var/log/mongod.log"
else
    echo "❌ Failed to start MongoDB"
    echo "Check the log file: /var/log/mongod.log"
fi