#!/bin/bash

# System Design Platform Backend - Quick Setup Script

echo "╔════════════════════════════════════════════════════╗"
echo "║   System Design Platform - Backend Setup          ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please install PostgreSQL v12+ to use the database features."
else
    echo "✓ PostgreSQL version: $(psql --version)"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created. Please edit it with your configuration."
else
    echo "✓ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   Setup Complete!                                  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Create PostgreSQL database: CREATE DATABASE systemdesign_db;"
echo "3. Initialize database tables: npm run init-db"
echo "4. Start the development server: npm run dev"
echo ""
echo "API Documentation will be available at: http://localhost:5000/api-docs"
echo ""
