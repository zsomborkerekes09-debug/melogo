Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("assets\icon.png")

$img192 = new-object System.Drawing.Bitmap($img, 192, 192)
$img192.Save("frontend\icon-192-v2.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img192.Dispose()

$img512 = new-object System.Drawing.Bitmap($img, 512, 512)
$img512.Save("frontend\icon-512-v2.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img512.Dispose()

$img.Dispose()
