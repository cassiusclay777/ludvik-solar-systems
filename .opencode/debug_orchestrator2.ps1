$port = 55839
$hostname = "127.0.0.1"
$logFile = "orchestrator_debug.log"
$errorFile = "orchestrator_debug.err"

Write-Host "Starting opencode serve with debug logging..."

# Start process
$process = Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "opencode", "serve", "--port", "$port", "--hostname", "$hostname", "--log-level", "DEBUG", "--print-logs" -RedirectStandardOutput $logFile -RedirectStandardError $errorFile -PassThru

Write-Host "Process ID: $($process.Id)"

# Wait for server to potentially start
Start-Sleep -Seconds 2

# Try to connect to health endpoint
$healthUrl = "http://${hostname}:${port}/health"
try {
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2
    Write-Host "Health check succeeded: $($response.StatusCode)"
} catch {
    Write-Host "Health check failed: $_"
}

# Wait a bit more to capture logs
Start-Sleep -Seconds 3

# Kill process
Stop-Process -Id $process.Id -Force

Write-Host "Process killed. Logs:"
if (Test-Path $logFile) {
    Write-Host "=== STDOUT ==="
    Get-Content $logFile
}
if (Test-Path $errorFile) {
    Write-Host "=== STDERR ==="
    Get-Content $errorFile
}