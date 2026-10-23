@echo off
title Upload Project Lemburan ke GitHub
color 0B
cd /d "%~dp0"
echo =========================================================
echo       UPLOAD REPOSITORI LEMBURAN ADMIN KE GITHUB
echo =========================================================
echo.
echo Pastikan Anda sudah membuat repository baru di https://github.com/new
echo.
set /p REPO_URL="Masukkan URL GitHub Repository Anda (contoh: https://github.com/username/lemburan-admin.git): "

if "%REPO_URL%"=="" (
    echo URL tidak boleh kosong!
    pause
    exit /b
)

echo.
echo Sedang menghubungkan remote origin...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
echo Sedang mengunggah (push) file ke GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo =========================================================
    echo [BERHASIL] File proyek sudah terunggah ke GitHub!
    echo Sekarang buka https://render.com lalu hubungkan repository ini
    echo untuk mendapatkan web online 24 jam tanpa perlu laptop hidup.
    echo =========================================================
) else (
    echo [GAGAL] Terjadi kesalahan saat push ke GitHub.
    echo Pastikan Anda sudah login akun GitHub di komputer ini.
)
echo.
pause
