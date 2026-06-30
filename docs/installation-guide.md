# Development Environment Setup Guide

## Objective

This guide provides step-by-step instructions for setting up a complete development environment for the WealthWise Finance Tracker project. Follow these instructions carefully to ensure all tools are properly configured.

## Prerequisites

- Windows 10/11, macOS, or Linux operating system
- Administrator privileges for software installation
- Stable internet connection for downloads
- At least 8GB RAM and 10GB free disk space

## Required Software Installation

### 1. Node.js Installation

Node.js is the JavaScript runtime that powers our backend API.

**Windows:**
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended for most users)
3. Run the installer (.msi file)
4. Follow the installation wizard, accepting default options
5. Ensure "Add to PATH" is checked

**macOS:**
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version
3. Run the installer (.pkg file)
4. Follow the installation steps

**Linux (Ubuntu/Debian):**
```bash
# Update package manager
sudo apt update

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Verification:**
```bash
# Should show version 18.x.x or higher
node --version

# Should show npm version 9.x.x or higher
npm --version
```

### 2. PostgreSQL Database Installation

PostgreSQL is our primary database system.

**Windows:**
1. Visit [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Download PostgreSQL 15 or later
3. Run the installer
4. Set a password for the 'postgres' user (remember this!)
5. Use default port 5432
6. Install pgAdmin when prompted (recommended)

**macOS:**
```bash
# Using Homebrew (recommended)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create a database user
createuser -s postgres
```

**Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user
sudo -u postgres createuser --superuser $USER
```

**Verification:**
```bash
# Check PostgreSQL version (should be 15.x or higher)
psql --version

# Connect to PostgreSQL (you may need to set up authentication first)
psql -U postgres -d postgres
```

**Initial Database Setup:**
```sql
-- Connect to PostgreSQL and run these commands
-- Create database for our project
CREATE DATABASE wealthwise_db;

-- Create a user for the application (optional, for security)
CREATE USER wealthwise_user WITH PASSWORD 'secure_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wealthwise_db TO wealthwise_user;

-- Exit PostgreSQL
\q
```

### 3. Git Installation and Configuration

Git is essential for version control and collaboration.

**Windows:**
1. Visit [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download Git for Windows
3. Run the installer
4. Use recommended settings (Git Bash, default text editor)

**macOS:**
```bash
# Using Homebrew
brew install git

# Or download from https://git-scm.com/download/mac
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

**Git Configuration:**
```bash
# Set your name and email (required)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default text editor (optional)
git config --global core.editor "code --wait"  # For VS Code

# Verify configuration
git config --list
```

### 4. VS Code Installation and Configuration

VS Code is our recommended code editor with excellent extensions.

**Installation:**
1. Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download for your operating system
3. Run the installer
4. Launch VS Code

**Essential Extensions:**
Install these extensions for optimal development experience:

```bash
# Install via command line (after VS Code is installed)
code --install-extension ms-vscode.vscode-json
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension rangav.vscode-thunder-client
code --install-extension ms-vscode.vscode-git
```

**Manual Extension Installation:**
1. Open VS Code
2. Click Extensions icon (Ctrl+Shift+X)
3. Search and install:
   - **ES7+ React/Redux/React-Native snippets** - Code snippets
   - **Prettier - Code formatter** - Automatic code formatting
   - **ESLint** - JavaScript linting
   - **Thunder Client** - API testing (Postman alternative)
   - **PostgreSQL** - Database management
   - **Auto Rename Tag** - HTML/JSX tag management
   - **Tailwind CSS IntelliSense** - CSS framework support
   - **GitLens** - Enhanced Git capabilities

**VS Code Settings Configuration:**
Create or update VS Code settings (Ctrl+Shift+P → "Preferences: Open Settings (JSON)"):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "files.associations": {
    "*.env": "dotenv"
  }
}
```

### 5. API Testing Tools

**Option A: Postman (Recommended)**
1. Visit [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Download Postman for your operating system
3. Install and create a free account
4. Learn basic usage: creating collections, sending requests

**Option B: Thunder Client (VS Code Extension)**
- Already included in the VS Code extensions list above
- Lightweight alternative built into VS Code
- Perfect for simple API testing

### 6. Additional Development Tools

**Terminal Enhancement (Optional but Recommended):**

**Windows - Windows Terminal:**
1. Install from Microsoft Store: "Windows Terminal"
2. Configure Git Bash as default profile

**macOS - iTerm2:**
```bash
brew install --cask iterm2
```

**Package Manager Alternatives:**

**Windows - Chocolatey (Optional):**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install tools via Chocolatey
choco install nodejs postgresql git vscode postman
```

**macOS - Homebrew (Highly Recommended):**
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install development tools
brew install node postgresql git
brew install --cask visual-studio-code postman
```

## Environment Verification

### Complete System Check

Create a verification script to test all installations:

**Windows (create `verify-setup.bat`):**
```batch
@echo off
echo Verifying Development Environment...
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    exit /b 1
)

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found
    exit /b 1
)

echo Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL not found
    exit /b 1
)

echo Checking Git...
git --version
if %errorlevel% neq 0 (
    echo ERROR: Git not found
    exit /b 1
)

echo.
echo All tools installed successfully!
echo Environment ready for development.
```

**macOS/Linux (create `verify-setup.sh`):**
```bash
#!/bin/bash

echo "Verifying Development Environment..."
echo

# Function to check if command exists
check_command() {
    if command -v $1 >/dev/null 2>&1; then
        echo "✅ $1 is installed: $($1 --version | head -n1)"
    else
        echo "❌ $1 is NOT installed"
        return 1
    fi
}

# Check all required tools
check_command node
check_command npm
check_command psql
check_command git
check_command code

echo
echo "🎉 Environment verification complete!"
echo "Ready to start development."
```

**Make script executable (macOS/Linux):**
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

### Database Connection Test

Test PostgreSQL connection:

```bash
# Test database connection
psql -U postgres -d postgres -c "SELECT version();"

# If successful, test creating our project database
createdb wealthwise_test_db
psql -d wealthwise_test_db -c "CREATE TABLE test (id SERIAL PRIMARY KEY, name VARCHAR(50));"
psql -d wealthwise_test_db -c "INSERT INTO test (name) VALUES ('Environment Setup');"
psql -d wealthwise_test_db -c "SELECT * FROM test;"
dropdb wealthwise_test_db
```

### Node.js and npm Test

Test Node.js environment:

```bash
# Create a test directory
mkdir nodejs-test
cd nodejs-test

# Initialize npm project
npm init -y

# Install a test package
npm install express

# Create simple test file
echo "const express = require('express'); console.log('Node.js environment working!');" > test.js

# Run test
node test.js

# Clean up
cd ..
rm -rf nodejs-test
```

## Project Initialization

### GitHub Repository Setup

1. **Create GitHub Account** (if you don't have one):
   - Visit [https://github.com](https://github.com)
   - Sign up for a free account
   - Verify your email address

2. **Create Repository:**
   - Click "New repository"
   - Name: `wealthwise-finance-tracker`
   - Description: "PERN Stack personal finance tracker - Codveda Internship Project"
   - Choose Public or Private
   - Initialize with README: No (we'll add our own)
   - Click "Create repository"

3. **Clone and Setup:**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/wealthwise-finance-tracker.git
   cd wealthwise-finance-tracker

   # Copy project files from our working directory
   # (You'll do this after we create the project structure)
   
   # Make initial commit
   git add .
   git commit -m "feat: initial project setup and environment configuration"
   git push origin main
   ```

### SSH Key Setup (Recommended)

For secure Git operations without password prompts:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to SSH agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
# Windows
clip < ~/.ssh/id_ed25519.pub

# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Linux
cat ~/.ssh/id_ed25519.pub
```

Then add the SSH key to your GitHub account:
1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste the public key and save

## Environment Configuration Files

### Create Global Git Configuration

```bash
# Create .gitignore_global for common files to ignore
git config --global core.excludesfile ~/.gitignore_global

# Create the global gitignore file
cat > ~/.gitignore_global << EOF
# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Log files
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env.local
.env.*.local
EOF
```

### VS Code Workspace Configuration

Create workspace settings for the project:

**Create `.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "**/node_modules": true,
    "**/coverage": true,
    "**/.env": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/coverage": true
  },
  "eslint.workingDirectories": ["level-1-basic/task-2-rest-api", "level-2-intermediate"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

**Create `.vscode/extensions.json`:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "rangav.vscode-thunder-client",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

## Troubleshooting Common Issues

### Node.js Issues

**Problem**: Node.js not found after installation
```bash
# Solution: Add Node.js to PATH
export PATH=$PATH:/usr/local/bin/node  # Linux/macOS
# Windows: Add to System Environment Variables
```

**Problem**: npm permission errors (macOS/Linux)
```bash
# Solution: Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### PostgreSQL Issues

**Problem**: PostgreSQL connection refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Start PostgreSQL if stopped
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS
```

**Problem**: Authentication failed for user
```bash
# Reset postgres user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'newpassword';"
```

### Git Issues

**Problem**: Git credentials not working
```bash
# Clear cached credentials
git config --global --unset credential.helper

# Set up credential helper
git config --global credential.helper store  # Stores credentials in plain text
# OR
git config --global credential.helper manager-core  # Windows Credential Manager
```

## Next Steps

After completing the environment setup:

1. ✅ **Verify all tools are working** using the verification scripts
2. ✅ **Create and configure GitHub repository**
3. ✅ **Set up project structure** (completed in this task)
4. ▶️ **Proceed to Task 2**: Build Simple REST API
5. **Continue with Task 3**: HTML, CSS & JavaScript Frontend

## Resources and Documentation

### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [VS Code Documentation](https://code.visualstudio.com/docs)

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web technologies
- [freeCodeCamp](https://www.freecodecamp.org/) - Full-stack development
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) - Database learning

### Community Support
- [Stack Overflow](https://stackoverflow.com/) - Programming questions
- [GitHub Discussions](https://github.com/features/discussions) - Project collaboration
- [Node.js Discord](https://discord.gg/nodejs) - Node.js community

---

**Environment Setup Complete! 🎉**

Your development environment is now ready for building the WealthWise Finance Tracker application. Proceed to the next task to start building the REST API backend.