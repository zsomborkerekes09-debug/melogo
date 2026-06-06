@echo off
title MelóGo Platform indítása...
echo ===================================================
echo             MelóGo Platform Launcher
echo ===================================================
echo.
echo [1/3] Függőségek ellenőrzése a backend könyvtárban...
cd /d "%~dp0\backend"

if not exist node_modules (
    echo [INFO] node_modules nem található, függőségek telepítése folyamatban...
    call npm install
) else (
    echo [OK] Függőségek rendben vannak.
)

echo.
echo [2/3] Backend API szerver indítása új ablakban...
start "MelóGo Backend Server" cmd /c "npm run start"

echo.
echo [3/3] Kétoldalú mobil szimulátor megnyitása a böngészőben...
timeout /t 2 /nobreak >nul
start "" "%~dp0\frontend\index.html"

echo.
echo ===================================================
echo [SIKER] A MelóGo elindult!
echo.
echo - A backend szerver fut a háttérben (külön ablakban).
echo - A böngésződben megnyílt a dual-telefon szimulátor.
echo.
echo Jó tesztelést! Nyomj meg egy billentyűt a kilépéshez.
echo ===================================================
pause >nul
