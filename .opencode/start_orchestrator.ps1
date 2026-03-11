$logFile = "orchestrator.log"
$errorLogFile = "orchestrator.err"
$port = 55839
$hostname = "127.0.0.1"

Write-Host "Starting opencode orchestrator on $hostname`:$port..."

# Start process using cmd /c because opencode is a batch file
$process = Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "opencode", "serve", "--port", "$port", "--hostname", "$hostname", "--log-level", "INFO" -RedirectStandardOutput $logFile -RedirectStandardError $errorLogFile -PassThru

$procId = $process.Id
Write-Host "Started with PID $procId"

# Wait for server to start
Start-Sleep -Seconds 5

# Test health endpoint
$healthUrl = "http://${hostname}:${port}/health"
try {
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 3
    Write-Host "Health check successful: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
    $healthy = $true
} catch {
    Write-Host "Health check failed: $_"
    $healthy = $false
}

if ($healthy) {
    Write-Host "Orchestrator is running. Keeping process alive."
    # Leave process running
    Write-Host "Process ID $procId"
    $procId | Out-File "orchestrator.pid"
} else {
    Write-Host "Orchestrator failed to start. Killing process."
    Stop-Process -Id $procId -Force
    Write-Host "Logs:"
    Get-Content $logFile -Tail 20
    Get-Content $errorLogFile -Tail 20
}