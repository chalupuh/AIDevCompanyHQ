@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0bld-preflight.ps1"
exit /b %errorlevel%
