# Installing Git on Windows

## Option 1: Install Git using Git for Windows (Recommended)

### Step 1: Download Git
1. Go to: https://git-scm.com/download/win
2. The download will start automatically (it detects your system)
3. Or click the "Download for Windows" button

### Step 2: Run the Installer
1. Double-click the downloaded installer file (`Git-*.exe`)
2. Follow the installation wizard:
   - **Important**: Accept the license agreement
   - **Important**: Choose installation location (default is fine: `C:\Program Files\Git`)
   - **Important**: Select components - leave defaults checked:
     - ✅ Git Bash Here
     - ✅ Git GUI Here
     - ✅ Associate .git* configuration files with the default text editor
     - ✅ Associate .sh files to be run with Bash
   - **Important**: Choose default editor - Select "Use Visual Studio Code as Git's default editor" or "Nano" (simpler)
   - **Important**: Adjust your PATH environment:
     - ✅ **Select "Git from the command line and also from 3rd-party software"** (RECOMMENDED)
   - **Important**: Choose HTTPS transport backend - leave default "Use the OpenSSL library"
   - **Important**: Configure line ending conversions:
     - ✅ **Select "Checkout Windows-style, commit Unix-style line endings"** (RECOMMENDED)
   - **Important**: Choose terminal emulator:
     - ✅ Select "Use Windows' default console window" (or MinTTY if you prefer)
   - **Important**: Configure extra options:
     - ✅ Enable file system caching
     - ✅ Enable Git Credential Manager
   - Click "Install"

### Step 3: Verify Installation
1. Open a **new** Command Prompt or PowerShell window (important: close and reopen)
2. Type:
   ```bash
   git --version
   ```
3. You should see something like: `git version 2.x.x`

### Step 4: Configure Git (First Time Setup)
1. Open Command Prompt, PowerShell, or Git Bash
2. Set your name:
   ```bash
   git config --global user.name "Your Name"
   ```
3. Set your email:
   ```bash
   git config --global user.email "your.email@example.com"
   ```
4. Verify configuration:
   ```bash
   git config --list
   ```

---

## Option 2: Install Git using Winget (Windows Package Manager)

If you have Windows 10/11 with winget installed:

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   winget install --id Git.Git -e --source winget
   ```
3. Restart your terminal/PowerShell
4. Verify: `git --version`

---

## Option 3: Install Git using Chocolatey (If you have Chocolatey)

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   choco install git -y
   ```
3. Restart your terminal/PowerShell
4. Verify: `git --version`

---

## After Installation: Initialize Your Repository

Once Git is installed, navigate to your project directory and run:

```bash
cd "C:\Users\victor.sabo\Git\VinuChian Projects\quote-translator"
git init
git add .
git commit -m "Ready for Vercel deployment"
```

## Quick Test

After installation, test Git:
```bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Troubleshooting

### Git not recognized after installation:
- **Restart your terminal/PowerShell** (close and reopen)
- **Restart your computer** if needed
- Verify PATH: Open System Properties > Environment Variables, ensure Git's `bin` directory is in PATH

### Need to restart VS Code:
- Close and reopen VS Code after installing Git
- Or restart your computer to ensure PATH updates are recognized

---

## Next Steps After Git Installation

1. ✅ Install Git (see above)
2. ✅ Configure Git (name and email)
3. ✅ Initialize repository: `git init`
4. ✅ Add files: `git add .`
5. ✅ Commit: `git commit -m "Ready for Vercel deployment"`
6. ✅ Create repository on GitHub/GitLab/Bitbucket
7. ✅ Add remote: `git remote add origin <your-repo-url>`
8. ✅ Push: `git push -u origin main`
9. ✅ Deploy to Vercel

---

## Support

- Git Documentation: https://git-scm.com/doc
- Git for Windows: https://git-scm.com/download/win

