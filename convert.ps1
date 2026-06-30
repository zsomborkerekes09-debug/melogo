Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("frontend\app_icon_final.jpg")
$img.Save("assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save("assets\splash.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
