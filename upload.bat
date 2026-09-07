@echo off
echo ===================================
echo     GitHub Upload Script
echo ===================================
echo.

echo 1. Adding all changes to Git...
git add .
echo.

echo 2. Committing changes...
set /p commitMsg="Enter a commit message (or press Enter for 'Auto update'): "
if "%commitMsg%"=="" set commitMsg=Auto update
git commit -m "%commitMsg%"
echo.

echo 3. Configuring GitHub Remote...
:: This will add the remote if it doesn't exist, and ignore the error if it does
git remote add origin https://github.com/veniamutha/Donpackadhesives.git 2>nul
:: This ensures the URL is correct even if 'origin' already existed
git remote set-url origin https://github.com/veniamutha/Donpackadhesives.git

:: Ensure we are pushing to the 'main' branch
git branch -M main
echo.

echo 4. Pushing code to GitHub...
git push -u origin main
echo.

echo ===================================
echo     Done!
echo ===================================
pause
