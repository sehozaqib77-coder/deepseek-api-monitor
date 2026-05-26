@echo off
title DeepSeek Monitor

:: Kill any existing server on port 38899
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":38899 " ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: Start the Node server (hidden window)
start /min "" "C:\Users\15798\AppData\Local\hermes\node\node.exe" "%~dp0deepseek-monitor-server.js"

:: Wait for server to be ready
timeout /t 3 /nobreak >nul

:: Open the floating HTA widget (frameless desktop overlay)
start "" mshta "%~dp0monitor.hta"
