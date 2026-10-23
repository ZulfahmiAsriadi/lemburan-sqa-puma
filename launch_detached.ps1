$baseDir = "c:\Users\Zulfahmi Asriadi\.gemini\antigravity-ide\scratch\lemburan-admin"
$sh = New-Object -ComObject Shell.Application
# 0 = Hidden window
$sh.ShellExecute("C:\Python314\python.exe", "start_online.py", $baseDir, "open", 0)
Write-Host "[OK] Dispatched start_online.py to Desktop Shell.Application successfully." -ForegroundColor Green
