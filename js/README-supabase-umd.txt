La app intenta cargar `js/supabase.umd.js` como fallback local si el CDN está bloqueado.

Para descargar el bundle UMD y guardarlo en esta carpeta, ejecuta (PowerShell):

Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.umd.js" -OutFile ".\js\supabase.umd.js"

O con curl (Windows o WSL):

curl -L -o js/supabase.umd.js "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.umd.js"

Después de guardar el archivo, recarga http://localhost:8000/login.html y revisa la consola; deberías ver: "Supabase inicializado desde copia local UMD".

Si no quieres descargar el archivo, intenta abrir la página en modo incógnito o deshabilitar extensiones de privacidad/adblock que podrían bloquear el CDN. Si necesitas, puedo añadir el archivo al repositorio por ti (indicame si estás de acuerdo).