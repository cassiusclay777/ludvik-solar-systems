$exePath = "C:/Users/Patri/AppData/Roaming/npm/node_modules/opencode-ai/node_modules/opencode-windows-x64/bin/opencode.exe"
$port = 55839
$hostname = "127.0.0.1"
$logFile = "exe.log"
$errFile = "exe.err"

Remove-Item $logFile -ErrorAction SilentlyContinue
Remove-Item $errFile -ErrorAction SilentlyContinue

Write-Host "Starting opencode exe directly..."
$process = Start-Process -NoNewWindow -FilePath $exePath -ArgumentList "serve", "--port", "$port", "--hostname", "$hostname", "--log-level", "DEBUG", "--print-logs" -RedirectStandardOutput $logFile -RedirectStandardError $errFile -PassThru

$procId = $process.Id
Write-Host "Process ID: $procId"

Start-Sleep -Seconds 3

if (!$process.HasExited) {
    Write-Host "Process still running."
    $healthUrl = "http://${hostname}:${port}/health"
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2
        Write-Host "Health check succeeded: $($response.StatusCode)"
    } catch {
        Write-Host "Health check failed: $_"
    }
    
    if (Test-Path $logFile) {
        Write-Host "=== STDOUT ==="
        Get-Content $logFile
    }
    if (Test-Path $errFile) {
        Write-Host "=== STDERR ==="
        Get-Content $errFile
    }
    
    Stop-Process -Id $procId -Force
    Write-Host "Process killed."
} else {
    Write-Host "Process exited."
    if (Test-Path $logFile) { Get-Content $logFile }
    if (Test-Path $errFile) { Get-Content $errFile }
}