$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptPath = Join-Path $baseDir "start_online.py"

$proc = Start-Process -FilePath "C:\Python314\pythonw.exe" -ArgumentList "`"$scriptPath`"" -WorkingDirectory $baseDir -PassThru
Start-Sleep -Seconds 2

if ($proc -and -not $proc.HasExited) {
    Write-Host "[OK] Service berhasil dijalankan di background (PID: $($proc.Id))" -ForegroundColor Green
} else {
    Write-Host "[WARN] Service proses selesai atau keluar." -ForegroundColor Yellow
}
