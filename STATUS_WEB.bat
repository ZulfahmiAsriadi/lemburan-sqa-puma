@echo off
title Status Server Lemburan Admin
color 0B
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0check_status.ps1"
echo.
pause
