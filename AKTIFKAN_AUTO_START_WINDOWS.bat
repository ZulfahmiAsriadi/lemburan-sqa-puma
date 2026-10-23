@echo off
title Pasang Auto-Start Windows - Lemburan Admin
color 0A
cd /d "%~dp0"
echo =========================================================
echo   PASANG AUTO-START WINDOWS (PORTAL LEMBURAN ADMIN)
echo =========================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0register_startup.ps1"
echo.
echo Sekarang setiap kali laptop dinyalakan/restart, portal lemburan
echo akan otomatis aktif di latar belakang tanpa harus buka Antigravity.
echo.
pause
