# Create temporary alias to VS Code
if (Test-Path "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe") {
    Set-Alias -Name code -Value "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe"
} elseif (Test-Path "$env:ProgramFiles\Microsoft VS Code\Code.exe") {
    Set-Alias -Name code -Value "$env:ProgramFiles\Microsoft VS Code\Code.exe"
}