@echo off
title Server Lemburan Admin Online (3 Tab)
color 0A
cd /d "%~dp0"
echo ===================================================
echo   PORTAL TIMESHEET LEMBURAN 3 ADMIN (ONLINE)
echo   Amin Syahar H. | Tiara Syahrani M. | Muhiddin
echo ===================================================
echo.
echo Sedang memulai server dan membuat link publik Cloudflare...
python start_online.py
pause
