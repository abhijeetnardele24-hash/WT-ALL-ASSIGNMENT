@echo off
echo ========================================================
echo   FIXING ECLIPSE INSTALLATION (Bypassing Path Limits)
echo ========================================================
echo.

set ZIP_PATH=C:\Users\Abhijeet Nardele\Downloads\eclipse-jee-2024-12-R-win32-x86_64.zip
set DEST_DIR=C:\

if not exist "%ZIP_PATH%" (
    echo [ERROR] Could not find the Eclipse ZIP file in Downloads!
    echo Please make sure the file is named: eclipse-jee-2024-12-R-win32-x86_64.zip
    pause
    exit /b 1
)

echo [1/3] Found the ZIP file in Downloads.
echo [2/3] Extracting directly to C:\ to fix missing files...
echo       (This might take a minute, please wait...)

REM Using Windows built-in tar command which ignores the 260 character path limit
tar.exe -xf "%ZIP_PATH%" -C C:\

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Extraction failed!
    pause
    exit /b 1
)

echo [3/3] Extraction complete!
echo.
echo ========================================================
echo   SUCCESS! Eclipse is now installed correctly at:
echo   C:\eclipse
echo ========================================================
echo.
echo Press any key to open the Eclipse folder now...
pause >nul

start "" "C:\eclipse"
exit
