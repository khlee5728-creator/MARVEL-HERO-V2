@echo off
echo Starting video optimization...
echo.

set INPUT_DIR=public\assets\characters
set OUTPUT_DIR=public\assets\characters
set VIDEO_DIR=public\assets\videos

echo Optimizing character videos...
for %%f in (%INPUT_DIR%\*.mp4) do (
    echo Processing %%~nxf...
    ffmpeg -i "%%f" -c:v libx264 -preset slow -crf 28 -vf "scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" -c:a aac -b:a 96k -movflags +faststart -y "%%~dpnf_optimized.mp4" 2>nul
    if exist "%%~dpnf_optimized.mp4" (
        move /y "%%~dpnf_optimized.mp4" "%%f" >nul
        echo   Done: %%~nxf
    )
)

echo.
echo Optimizing loading-intro.mp4...
if exist "%VIDEO_DIR%\loading-intro.mp4" (
    ffmpeg -i "%VIDEO_DIR%\loading-intro.mp4" -c:v libx264 -preset slow -crf 28 -vf "scale='min(1280,iw)':'min(1280,ih)':force_original_aspect_ratio=decrease" -c:a aac -b:a 128k -movflags +faststart -y "%VIDEO_DIR%\loading-intro_optimized.mp4" 2>nul
    if exist "%VIDEO_DIR%\loading-intro_optimized.mp4" (
        move /y "%VIDEO_DIR%\loading-intro_optimized.mp4" "%VIDEO_DIR%\loading-intro.mp4" >nul
        echo   Done: loading-intro.mp4
    )
)

echo.
echo Video optimization complete!
