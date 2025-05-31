# First, check if VS Code is installed in the default location
$vsCodePath = "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin"

# Alternative installation location
$vsCodePathAlt = "C:\Program Files\Microsoft VS Code\bin"

# Check which path exists
if (Test-Path $vsCodePath) {
    $pathToAdd = $vsCodePath
} elseif (Test-Path $vsCodePathAlt) {
    $pathToAdd = $vsCodePathAlt
} else {
    Write-Host "VS Code installation not found in default locations"
    return
}

# Add to PATH for current session
$env:Path += ";$pathToAdd"

# Add to PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike "*$pathToAdd*") {
    [Environment]::SetEnvironmentVariable(
        'Path',
        "$currentPath;$pathToAdd",
        'User'
    )
}