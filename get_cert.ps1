Add-Type -AssemblyName System.IO.Compression.FileSystem
$apkPath = "C:\Users\zsomb\Downloads\1.apk"
$zip = [System.IO.Compression.ZipFile]::OpenRead($apkPath)
$rsaEntry = $zip.Entries | Where-Object { $_.FullName -like "META-INF/*.RSA" -or $_.FullName -like "META-INF/*.DSA" } | Select-Object -First 1

if ($rsaEntry) {
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($rsaEntry, $tempFile, $true)
    
    Add-Type -AssemblyName System.Security
    $pkcs = New-Object System.Security.Cryptography.Pkcs.SignedCms
    $bytes = [System.IO.File]::ReadAllBytes($tempFile)
    $pkcs.Decode($bytes)
    
    foreach ($cert in $pkcs.Certificates) {
        $hashBytes = $cert.GetCertHash([System.Security.Cryptography.HashAlgorithmName]::SHA256)
        $hashString = [BitConverter]::ToString($hashBytes).Replace('-', ':')
        Write-Output "SHA256 Fingerprint: $hashString"
    }
    
    Remove-Item $tempFile
} else {
    Write-Output "No RSA/DSA file found in $apkPath."
}
$zip.Dispose()
