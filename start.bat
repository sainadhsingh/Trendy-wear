@echo off
echo Starting TRENDY WEAR E-Commerce Application...
echo.

start /b cmd /c "node server/index.js"
start /b cmd /c "npm run dev"

echo Waiting for servers to initialize...
timeout /t 3 >nul

start http://localhost:5173

echo.
echo TRENDY WEAR is running at http://localhost:5173
echo Press Ctrl+C or close this window to stop the servers.
pause
