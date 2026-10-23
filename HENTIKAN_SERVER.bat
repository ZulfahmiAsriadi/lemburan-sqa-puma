@echo off
title Hentikan Server Lemburan Admin
color 0C
cd /d "%~dp0"
echo =========================================================
echo       MENGHENTIKAN SERVICE PORTAL LEMBURAN ADMIN
echo =========================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop_server_service.ps1"
echo [OK] Seluruh service server dan tunnel telah dinonaktifkan.
echo.
pause
