#!/bin/bas
# ======================================================================
# === SCRIPT DE POST-DESPLIEGUE (VERSIÓN SIMPLIFICADA Y ROBUSTA) ===
# ======================================================================
echo "==> Iniciando Post-Despliegue..."

# Exportar la ruta de Node.js para que los comandos estén disponibles
# Esto es crucial para que sudo y cron puedan encontrar npm y pm2
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Navega al directorio raíz del proyecto
PROJECT_DIR="/var/www/security-cam-project"
cd $PROJECT_DIR || { echo "ERROR: No se pudo encontrar el directorio del proyecto."; exit 1; }

# Instala todas las dependencias desde la raíz
echo "Instalando dependencias para la API..."
(cd irvingchampo-apisecurity && npm install)

echo "Instalando dependencias para el WebSocket..."
(cd irvingchampo-ws-servidor-securitycam- && npm install)

# Detiene cualquier proceso antiguo con el mismo nombre y lo elimina
echo "Reiniciando aplicaciones con PM2..."
pm2 delete SecurityCam-API || true
pm2 delete SecurityCam-WebSocket || true

# Inicia las aplicaciones usando el archivo de configuración
# PM2 es lo suficientemente inteligente como para manejar ts-node
pm2 start ecosystem.config.js

# Guarda la configuración para reinicios del servidor
pm2 save

echo "==> Post-Despliegue completado."

# --- Reactivación del Monitoreo ---
# (Esta parte se queda igual)
echo "Reactivando el cron job de monitoreo..."
MONITOR_SCRIPT="$PROJECT_DIR/scripts/monitor_app_status.sh"
CRON_ENTRY_FILE="/etc/cron.d/securitycam_api_monitor"
CRON_DISABLED_FLAG="/var/log/security_cam_monitor/cron_disabled.flag"
CRON_SCHEDULE="*/1 * * * *"

sudo rm -f "$CRON_DISABLED_FLAG"
echo "$CRON_SCHEDULE root bash $MONITOR_SCRIPT" | sudo tee "$CRON_ENTRY_FILE" > /dev/null
sudo chmod 644 "$CRON_ENTRY_FILE"
echo "Cron job de monitoreo activado."