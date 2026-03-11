$port = 55839
$hostname = "127.0.0.1"
$logFile = "test.log"
$errFile = "test.err"

# Remove previous logs
Remove-Item $logFile -ErrorAction SilentlyContinue
Remove-Item $errFile -ErrorAction SilentlyContinue

Write-Host "Starting opencode serve..."
$process = Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "opencode", "serve", "--port", "$port", "--hostname", "$hostname", "--log-level", "DEBUG", "--print-logs" -RedirectStandardOutput $logFile -RedirectStandardError $errFile -PassThru

$pid = $process.Id
Write-Host "Process ID: $pid"

# Wait for startup
Start-Sleep -Seconds 3

# Check if process still alive
if (!$process.HasExited) {
    Write-Host "Process still running."
    # Try health endpoint
    $healthUrl = "http://${hostname}:${port}/health"
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2
        Write-Host "Health check succeeded: $($response.StatusCode)"
    } catch {
        Write-Host "Health check failed: $_"
    }
    
    # Read logs
    if (Test-Path $logFile) {
        Write-Host "=== STDOUT ==="
        Get-Content $logFile
    }
    if (Test-Path $errFile) {
        Write-Host "=== STDERR ==="
        Get-Content $errFile
    }
    
    # Kill process
    Stop-Process -Id $pid -Force
    Write-Host "Process killed."
} else {
    Write-Host "Process exited already."
    if (Test-Path $logFile) {
        Get-Content $logFile
    }
    if (Test-Path $errFile) {
        Get-Content $errFile
    }
}