$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$urlFile = Join-Path $baseDir "public_url.txt"
$pidFile = Join-Path $baseDir "start_online.pid"
$logFile = Join-Path $baseDir "server_online.log"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         STATUS SERVICE PORTAL LEMBURAN ADMIN             " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Local Port 8089
$localStatus = $false
try {
    $res = Invoke-WebRequest -Uri "http://127.0.0.1:8089/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
        $localStatus = $true
    }
} catch {
    $localStatus = $false
}

if ($localStatus) {
    Write-Host "[OK] Server Lokal Backend (Port 8089) : AKTIF" -ForegroundColor Green
} else {
    Write-Host "[X]  Server Lokal Backend (Port 8089) : TIDAK AKTIF" -ForegroundColor Red
}

# Check Cloudflare Process
$cf = Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
if ($cf) {
    Write-Host "[OK] Tunnel Cloudflare                : AKTIF (PID: $($cf.Id -join ', '))" -ForegroundColor Green
} else {
    Write-Host "[X]  Tunnel Cloudflare                : TIDAK AKTIF" -ForegroundColor Red
}

# Check URL
Write-Host ""
if (Test-Path $urlFile) {
    $url = (Get-Content $urlFile -Raw).Trim()
    if ($url -match '^https://') {
        Write-Host "==========================================================" -ForegroundColor Yellow
        Write-Host ">>> LINK ONLINE AKTIF SAAT INI:" -ForegroundColor White
        Write-Host ">>> $url" -ForegroundColor Green
        Write-Host "==========================================================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Link untuk Admin Tiara:" -ForegroundColor Gray
        Write-Host "$url/?admin=tiara" -ForegroundColor Cyan
        Write-Host "Link untuk Admin Amin:" -ForegroundColor Gray
        Write-Host "$url/?admin=amin" -ForegroundColor Cyan
        Write-Host "Link untuk Admin Muhiddin:" -ForegroundColor Gray
        Write-Host "$url/?admin=muhiddin" -ForegroundColor Cyan
    } else {
        Write-Host "Link publik sedang diproses oleh Cloudflare..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Belum ada link publik yang terdaftar (tunnel belum aktif)." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Tips: Service ini berjalan di latar belakang (background)." -ForegroundColor Gray
Write-Host "Aplikasi Antigravity bebas ditutup tanpa mempengaruhi web." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
