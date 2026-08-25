@echo off
echo =====================================================
echo  Deploy Electricity Bill App to Tomcat (Like htdocs)
echo =====================================================
echo.

set TOMCAT=C:\Tomcat10
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot
set PROJECT=C:\Users\Abhijeet Nardele\OneDrive\Desktop\WT Assignment\electricity-bill
set WEBAPPS=%TOMCAT%\webapps\electricity-bill

REM ── STEP 1: Create folder structure in Tomcat webapps ──
echo [STEP 1] Creating folder in Tomcat webapps (like htdocs)...
if exist "%WEBAPPS%" rmdir /s /q "%WEBAPPS%"
mkdir "%WEBAPPS%"
mkdir "%WEBAPPS%\WEB-INF"
mkdir "%WEBAPPS%\WEB-INF\classes\com\ebill"
mkdir "%WEBAPPS%\WEB-INF\lib"
echo [OK] Folder created: %WEBAPPS%
echo.

REM ── STEP 2: Copy JSP files and web.xml ──
echo [STEP 2] Copying JSP files and web.xml...
copy /Y "%PROJECT%\src\main\webapp\index.jsp"          "%WEBAPPS%\index.jsp"
copy /Y "%PROJECT%\src\main\webapp\result.jsp"         "%WEBAPPS%\result.jsp"
copy /Y "%PROJECT%\src\main\webapp\WEB-INF\web.xml"    "%WEBAPPS%\WEB-INF\web.xml"
echo [OK] JSP files copied!
echo.

REM ── STEP 3: Copy JSTL jars from Maven local repo (needed for JSP tags) ──
echo [STEP 3] Copying required JAR libraries...
set M2=%USERPROFILE%\.m2\repository

REM Try to copy JSTL jars if Maven was run before
if exist "%M2%\org\glassfish\web\jakarta.servlet.jsp.jstl\3.0.1\jakarta.servlet.jsp.jstl-3.0.1.jar" (
    copy /Y "%M2%\org\glassfish\web\jakarta.servlet.jsp.jstl\3.0.1\jakarta.servlet.jsp.jstl-3.0.1.jar" "%WEBAPPS%\WEB-INF\lib\"
    copy /Y "%M2%\jakarta.servlet.jsp.jstl\jakarta.servlet.jsp.jstl-api\3.0.0\jakarta.servlet.jsp.jstl-api-3.0.0.jar" "%WEBAPPS%\WEB-INF\lib\"
    echo [OK] JSTL JARs copied!
) else (
    echo [INFO] JSTL JARs not found - will download via Maven first...
    "C:\Tools\apache-maven-3.9.9\bin\mvn.cmd" dependency:resolve -f "%PROJECT%\pom.xml" -q
    copy /Y "%M2%\org\glassfish\web\jakarta.servlet.jsp.jstl\3.0.1\jakarta.servlet.jsp.jstl-3.0.1.jar" "%WEBAPPS%\WEB-INF\lib\" 2>nul
    copy /Y "%M2%\jakarta.servlet.jsp.jstl\jakarta.servlet.jsp.jstl-api\3.0.0\jakarta.servlet.jsp.jstl-api-3.0.0.jar" "%WEBAPPS%\WEB-INF\lib\" 2>nul
)
echo.

REM ── STEP 4: Compile the Servlet .java → .class ──
echo [STEP 4] Compiling BillServlet.java...
"%JAVA_HOME%\bin\javac.exe" ^
    -cp "%TOMCAT%\lib\servlet-api.jar;%TOMCAT%\lib\jsp-api.jar;%WEBAPPS%\WEB-INF\lib\*" ^
    -d "%WEBAPPS%\WEB-INF\classes" ^
    "%PROJECT%\src\main\java\com\ebill\BillServlet.java"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Compilation failed! Check the errors above.
    pause
    exit /b 1
)
echo [OK] BillServlet.class compiled successfully!
echo.

REM ── STEP 5: Stop Tomcat, Deploy, Start Tomcat ──
echo [STEP 5] Restarting Tomcat server...
call "%TOMCAT%\bin\shutdown.bat" 2>nul
timeout /t 4 /nobreak >nul

echo [OK] Starting Tomcat...
start "Tomcat" "%TOMCAT%\bin\startup.bat"
timeout /t 8 /nobreak >nul

REM ── STEP 6: Open in browser ──
echo [STEP 6] Opening app in browser...
start "" "http://localhost:8080/electricity-bill/"

echo.
echo =====================================================
echo  SUCCESS! App is running at:
echo  http://localhost:8080/electricity-bill/
echo =====================================================
echo.
echo  Your folder is now at:
echo  C:\Tomcat10\webapps\electricity-bill\   (like htdocs!)
echo.
echo  To stop Tomcat: close the Tomcat window
echo  or run: C:\Tomcat10\bin\shutdown.bat
echo.
pause
