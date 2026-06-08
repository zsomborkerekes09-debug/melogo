@echo off
color 0A
title MeloGo - Vercel Feltoltes

cd /d "C:\Users\zsomb\.gemini\antigravity\scratch\melogo"

echo ====================================================
echo       MeloGo - Vercel Bejelentkezes es Feltoltes
echo ====================================================
echo.
echo Eloszor ellenorizzuk a Vercel bejelentkezest...
echo Ha felugrik a bongeszo, vagy keri az emailedet, kerlek jelentkezz be!
echo.

call npx vercel login

echo.
echo ====================================================
echo Bejelentkezes ellenorizve! 
echo Most elindul a weboldal feltoltese a webre...
echo ====================================================
echo.

call npx vercel --prod

echo.
echo ====================================================
echo Kesz! A weboldalad frissitve lett a weben.
echo ====================================================
echo.
pause
