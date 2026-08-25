# ============================================================
#  FIX SCRIPT - Installs Maven + Tomcat + Eclipse
#  Java is already installed - this only fixes what failed
#  RIGHT-CLICK -> Run with PowerShell (as Administrator)
# ============================================================

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FIX SCRIPT - Maven + Tomcat + Eclipse  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Helper: Add to system PATH permanently
function Add-ToPath($newPath) {
    $current = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($current -notlike "*$newPath*") {
        [System.Environment]::SetEnvironmentVariable("Path", "$current;$newPath", "Machine")
        Write-Host "  [+] Added to PATH: $newPath" -ForegroundColor Green
    } else {
        Write-Host "  [=] Already in PATH: $newPath" -ForegroundColor Yellow
    }
}

New-Item -ItemType Directory -Path "C:\Tools" -Force | Out-Null

# ─────────────────────────────────────────────
# FIX 1: Download Apache Maven 3.9.9 directly
# ─────────────────────────────────────────────
Write-Host "[FIX 1] Downloading Apache Maven 3.9.9..." -ForegroundColor Magenta
$mvnDir = "C:\Tools\apache-maven-3.9.9"

if (-not (Test-Path "$mvnDir\bin\mvn.cmd")) {
    $mvnUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
    $mvnZip = "C:\Tools\maven.zip"

    Write-Host "  Downloading Maven (~10 MB)..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $mvnUrl -OutFile $mvnZip -UseBasicParsing

    Write-Host "  Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $mvnZip -DestinationPath "C:\Tools" -Force
    Remove-Item $mvnZip -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Maven extracted to: $mvnDir" -ForegroundColor Green
} else {
    Write-Host "  [=] Maven already at $mvnDir" -ForegroundColor Yellow
}

[System.Environment]::SetEnvironmentVariable("MAVEN_HOME", $mvnDir, "Machine")
[System.Environment]::SetEnvironmentVariable("M2_HOME", $mvnDir, "Machine")
Add-ToPath "$mvnDir\bin"
Write-Host "  [+] MAVEN_HOME = $mvnDir" -ForegroundColor Green

# ─────────────────────────────────────────────
# FIX 2: Download Apache Tomcat 10.1 (correct version)
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "[FIX 2] Downloading Apache Tomcat 10.1.40..." -ForegroundColor Magenta
$tomcatDir = "C:\Tomcat10"

if (-not (Test-Path "$tomcatDir\bin\startup.bat")) {
    # Try multiple versions in case one is not available
    $tomcatUrls = @(
        "https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.40/bin/apache-tomcat-10.1.40-windows-x64.zip",
        "https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.39/bin/apache-tomcat-10.1.39-windows-x64.zip",
        "https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.35/bin/apache-tomcat-10.1.35-windows-x64.zip"
    )

    $tomcatZip = "C:\Tools\tomcat.zip"
    $downloaded = $false

    foreach ($url in $tomcatUrls) {
        Write-Host "  Trying: $url" -ForegroundColor Yellow
        try {
            Invoke-WebRequest -Uri $url -OutFile $tomcatZip -UseBasicParsing -ErrorAction Stop
            $downloaded = $true
            Write-Host "  [OK] Download successful!" -ForegroundColor Green
            break
        } catch {
            Write-Host "  [SKIP] Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    if ($downloaded) {
        Write-Host "  Extracting Tomcat..." -ForegroundColor Yellow
        if (Test-Path "C:\Tools\tomcat_temp") { Remove-Item "C:\Tools\tomcat_temp" -Recurse -Force }
        Expand-Archive -Path $tomcatZip -DestinationPath "C:\Tools\tomcat_temp" -Force
        $extracted = (Get-ChildItem "C:\Tools\tomcat_temp" | Select-Object -First 1).FullName
        if (Test-Path $tomcatDir) { Remove-Item $tomcatDir -Recurse -Force }
        Move-Item $extracted $tomcatDir
        Remove-Item $tomcatZip -Force -ErrorAction SilentlyContinue
        Remove-Item "C:\Tools\tomcat_temp" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Tomcat installed at: $tomcatDir" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] All Tomcat URLs failed. Download manually from tomcat.apache.org" -ForegroundColor Red
    }
} else {
    Write-Host "  [=] Tomcat already at $tomcatDir" -ForegroundColor Yellow
}

[System.Environment]::SetEnvironmentVariable("CATALINA_HOME", $tomcatDir, "Machine")
Add-ToPath "$tomcatDir\bin"
Write-Host "  [+] CATALINA_HOME = $tomcatDir" -ForegroundColor Green

# ─────────────────────────────────────────────
# FIX 3: Eclipse - Open download page in browser
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "[FIX 3] Eclipse IDE (must be downloaded manually)..." -ForegroundColor Magenta
Write-Host ""
Write-Host "  Opening Eclipse download page in your browser..." -ForegroundColor Yellow
Start-Process "https://www.eclipse.org/downloads/packages/release/2024-12/r/eclipse-ide-enterprise-java-and-web-developers"
Write-Host ""
Write-Host "  Instructions:" -ForegroundColor White
Write-Host "  1. Click the Windows x86_64 download button" -ForegroundColor Yellow
Write-Host "  2. Extract the ZIP to C:\eclipse" -ForegroundColor Yellow
Write-Host "  3. Run C:\eclipse\eclipse.exe" -ForegroundColor Yellow
Write-Host "  4. Choose workspace: C:\eclipse-workspace" -ForegroundColor Yellow

# ─────────────────────────────────────────────
# Final Summary
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ALL FIXES APPLIED!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Environment Variables Now Set:" -ForegroundColor White
Write-Host "  JAVA_HOME     = C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot" -ForegroundColor Green
Write-Host "  MAVEN_HOME    = $mvnDir" -ForegroundColor Green
Write-Host "  CATALINA_HOME = $tomcatDir" -ForegroundColor Green
Write-Host ""
Write-Host "  RESTART your computer, then open PowerShell and run:" -ForegroundColor Red
Write-Host "    java -version   -> should say 21.x.x" -ForegroundColor Yellow
Write-Host "    mvn -version    -> should say 3.9.9" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
