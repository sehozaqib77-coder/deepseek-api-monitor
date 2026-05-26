Set ws = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")

strDir = fs.GetParentFolderName(WScript.ScriptFullName) & "\"
strNode = "C:\Users\15798\AppData\Local\hermes\node\node.exe"

' Kill old server
ws.Run "cmd /c for /f ""tokens=5"" %a in ('netstat -ano ^| findstr "":38899 "" ^| findstr ""LISTENING""') do taskkill /f /pid %a >nul 2>&1", 0, True

' Start server
ws.Run """" & strNode & """ """ & strDir & "launcher.js""", 0, False

WScript.Sleep 3000

' Open native frameless window via HTA (mshta.exe - NOT a browser)
ws.Run """C:\Windows\System32\mshta.exe"" """ & strDir & "monitor.hta""", 0, False

' Keep alive (sleep forever)
Do While True
    WScript.Sleep 60000
Loop
