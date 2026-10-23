$startup = [Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startup "LemburanAdminOnline.lnk"
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($shortcutPath)
$sc.TargetPath = "wscript.exe"
$sc.Arguments = "`"c:\Users\Zulfahmi Asriadi\.gemini\antigravity-ide\scratch\lemburan-admin\JALANKAN_BACKGROUND.vbs`""
$sc.WorkingDirectory = "c:\Users\Zulfahmi Asriadi\.gemini\antigravity-ide\scratch\lemburan-admin"
$sc.Save()

if (Test-Path $shortcutPath) {
    Write-Host "[OK] Startup shortcut created: $shortcutPath" -ForegroundColor Green
} else {
    Write-Host "[ERR] Failed to create shortcut." -ForegroundColor Red
}
