Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strJarPath = strScriptPath & "\target\bookerino-desktop.jar"

' Check if JAR exists
If Not objFSO.FileExists(strJarPath) Then
    MsgBox "JAR file not found at: " & strJarPath & vbCrLf & vbCrLf & "Please run 'mvn clean package' first to build the application.", vbCritical, "Bookerino - Error"
    WScript.Quit
End If

' Set DATABASE_URL if not set
If objShell.Environment("PROCESS").Item("DATABASE_URL") = "" Then
    objShell.Environment("PROCESS").Item("DATABASE_URL") = "jdbc:sqlite:./bookerino.db"
End If

' Launch using javaw (no console window)
objShell.CurrentDirectory = strScriptPath
objShell.Run "javaw.exe -jar """ & strJarPath & """", 0, False

' Exit immediately - no window shown
WScript.Quit

