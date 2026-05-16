@echo off
setlocal
cd /d "%~dp0"
start "" "http://127.0.0.1:5173/"
npm run dev -- --host 127.0.0.1 --port 5173 --clearScreen false
pause
