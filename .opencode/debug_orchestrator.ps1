$port = 55839
$hostname = "127.0.0.1"

Write-Host "Running opencode serve with --print-logs..."

# Start job
$job = Start-Job -ScriptBlock {
    param($port, $hostname)
    cmd /c "opencode serve --port $port --hostname $hostname --log-level DEBUG --print-logs 2>&1"
} -ArgumentList $port, $hostname

Start-Sleep -Seconds 5

# Stop job
Stop-Job -Job $job -PassThru | Remove-Job -Force

# Get output
$output = Receive-Job -Job $job
Write-Host "Output:"
$output | Out-Host