Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strDir
strCmd = "C:\Python314\pythonw.exe start_online.py"
WshShell.Run strCmd, 0, False
