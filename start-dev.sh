#!/bin/bash

echo "🚀 Starting LinkedIn Analytics Development Server..."
echo "📁 Project Directory: $(pwd)"
echo "🔍 Node Version: $(node --version)"
echo "📦 NPM Version: $(npm --version)"

echo "🧹 Cleaning up old builds..."
rm -rf dist .vite-cache

echo "✅ Starting Vite development server..."
exec npm run dev