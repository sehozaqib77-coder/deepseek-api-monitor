@echo off
title ds-monitor-stop

:: Kill server on port 38899
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":38899 " ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: Kill background wscript (launcher.vbs)
taskkill /f /fi "IMAGENAME eq wscript.exe" /fi "WINDOWTITLE eq ds-mon*" >nul 2>&1

:: Close Edge app windows with our URL
powershell -Command "Get-Process msedge | Where-Object {$_.CommandLine -like '*38899*'} | Stop-Process -Force" >nul 2>&1

echo DeepSeek Monitor stopped.
timeout /t 2 /nobreak >nul
