# ============================================================
#  Inicia la API (Fase 2) con el servidor embebido de PHP.
#  NO usa XAMPP/htdocs: corre desde la propia carpeta del proyecto.
#
#  Uso:  powershell -ExecutionPolicy Bypass -File backend/serve.ps1
#  URL:  http://127.0.0.1:8000
# ============================================================
$php = 'C:\xampp\php\php.exe'
$docroot = Join-Path $PSScriptRoot 'public'
$router = Join-Path $docroot 'index.php'

Write-Host "API Clinica Mascotas -> http://127.0.0.1:8000" -ForegroundColor Cyan
& $php -S 127.0.0.1:8000 -t $docroot $router
