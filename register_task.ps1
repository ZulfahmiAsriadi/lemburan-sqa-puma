$taskName = "LemburanAdminServer"
$pythonPath = "C:\Python314\pythonw.exe"
$scriptPath = "c:\Users\Zulfahmi Asriadi\.gemini\antigravity-ide\scratch\lemburan-admin\start_online.py"
$workDir = "c:\Users\Zulfahmi Asriadi\.gemini\antigravity-ide\scratch\lemburan-admin"

$action = New-ScheduledTaskAction -Execute $pythonPath -Argument "`"$scriptPath`"" -WorkingDirectory $workDir
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

# Unregister if already exists
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Register task
$task = Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Service Portal Lemburan Admin SQA PUMA Online"

Write-Host "[OK] Task $taskName berhasil didaftarkan di Windows Task Scheduler!" -ForegroundColor Green

# Start task right now
Start-ScheduledTask -TaskName $taskName
Write-Host "[OK] Task $taskName berhasil dijalankan di background!" -ForegroundColor Green
