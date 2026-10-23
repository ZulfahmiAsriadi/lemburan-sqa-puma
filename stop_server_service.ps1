Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-CimInstance Win32_Process | Where-Object { 
    $_.CommandLine -and ($_.CommandLine -like "*lemburan-admin*" -or $_.CommandLine -like "*server.py*" -or $_.CommandLine -like "*start_online.py*")
} | ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
}

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $baseDir "start_online.pid"
if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
