@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 set "PATH=%LOCALAPPDATA%\fidan-tools\node-v22.16.0-win-x64;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js LTS, then run this file again.
  pause
  exit /b 1
)
cd /d "%~dp0"
if not exist node_modules\vite\bin\vite.js call npm.cmd install
if errorlevel 1 exit /b 1
call npm.cmd run dev
