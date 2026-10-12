@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo ERROR: Node.js 18 or newer is required. Install Node.js and add it to PATH.& exit /b 1)
where npm >nul 2>nul || (echo ERROR: npm was not found. Repair or reinstall Node.js.& exit /b 1)
if not exist package-lock.json (
  echo Installing frontend dependencies...
  call npm install
  if errorlevel 1 (echo ERROR: npm install failed.& exit /b 1)
)
if not exist node_modules (
  call npm ci
  if errorlevel 1 (echo ERROR: npm ci failed.& exit /b 1)
)
call npm run dev
if errorlevel 1 echo ERROR: Frontend stopped with an error. Review the npm and Vite messages above.
exit /b %ERRORLEVEL%
