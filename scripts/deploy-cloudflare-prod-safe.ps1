$ErrorActionPreference = "Stop"

$hyperdriveLocalVariable = "CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE"
$connectionString = $null
$exitCode = 1

Write-Host "Paste the production Neon connection string for this deploy only."
Write-Host "Input is hidden. The value will be set only for this PowerShell process and child deploy process."
$secureConnectionString = Read-Host -AsSecureString "Production Neon connection string"

$bstr = [IntPtr]::Zero
try {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureConnectionString)
  $connectionString = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

if ([string]::IsNullOrWhiteSpace($connectionString)) {
  Write-Error "Production Neon connection string was empty. Deploy was not started."
  exit 1
}

if ($connectionString -notmatch "^postgres(ql)?://") {
  Write-Error "Production Neon connection string must start with postgres:// or postgresql://. Deploy was not started."
  exit 1
}

try {
  Set-Item -Path "Env:$hyperdriveLocalVariable" -Value $connectionString
  & npm run deploy:cloudflare
  if ($null -ne $LASTEXITCODE) {
    $exitCode = $LASTEXITCODE
  } else {
    $exitCode = 0
  }
} finally {
  Remove-Item -Path "Env:$hyperdriveLocalVariable" -ErrorAction SilentlyContinue
  $connectionString = $null
  if ($null -ne $secureConnectionString) {
    $secureConnectionString.Dispose()
  }
  [GC]::Collect()
}

exit $exitCode
