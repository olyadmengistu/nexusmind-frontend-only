@echo off
echo 🚀 Nexus Mind GitHub Deployment Script
echo =====================================

REM Navigate to project directory
cd /d "C:\Users\to\Downloads\nexusmind---the-problem-solving-network"

REM Check if Git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Complete Nexus Mind platform with mobile responsive design"
    echo ✅ Git repository initialized!
) else (
    echo 📦 Git repository already exists
)

REM Check if remote origin exists
git remote show origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Connecting to GitHub...
    echo Please enter your GitHub username:
    set /p username="Username: "
    git remote add origin https://github.com/%username%/nexusmind---the-problem-solving-network.git
    git branch -M main
    echo ✅ Connected to GitHub!
) else (
    echo 🔗 GitHub already connected!
)

REM Add all changes
echo 📤 Adding all files to Git...
git add .
git commit -m "Update: Mobile responsive design and production-ready configuration" || echo "No changes to commit"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

echo ✅ SUCCESS! Your Nexus Mind platform is now on GitHub!
echo 🌐 Repository: https://github.com/your-username/nexusmind---the-problem-solving-network
echo 
echo Next steps:
echo 1. Deploy frontend on Vercel
echo 2. Deploy backend on Render
echo 
pause
