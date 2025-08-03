
# === SCRIPT DE POST-DESPLIEGUE ===


echo "==> Iniciando Post-Despliegue..."

# Navega al directorio raíz del proyecto en el servidor.
# Usaremos '/var/www/security-cam-project' como nuestro estándar.
cd /var/www/security-cam-project || { echo "ERROR: No se pudo encontrar el directorio del proyecto."; exit 1; }

# Instala/actualiza las dependencias para ambos proyectos.
echo "Instalando dependencias para la API..."
(cd irvingchampo-apisecurity && npm install)

echo "Instalando dependencias para el WebSocket..."
(cd irvingchampo-ws-servidor-securitycam- && npm install)


echo "Iniciando aplicaciones con PM2..."
pm2 start ecosystem.config.js


pm2 save

# --- Reactivación del Monitoreo ---
echo "Reactivando el cron job de monitoreo..."
MONITOR_SCRIPT="/var/www/security-cam-project/scripts/monitor_app_status.sh"
CRON_ENTRY_FILE="/etc/cron.d/securitycam_api_monitor"
CRON_DISABLED_FLAG="/var/log/security_cam_monitor/cron_disabled.flag"
CRON_SCHEDULE="*/1 * * * *" # Ejecutar cada minuto

# Elimina el flag que deshabilita el monitoreo, si existe.
sudo rm -f "$CRON_DISABLED_FLAG"


# El job se ejecutará como usuario 'root' para tener los permisos necesarios.
echo "$CRON_SCHEDULE root $MONITOR_SCRIPT" | sudo tee "$CRON_ENTRY_FILE" > /dev/null
sudo chmod 644 "$CRON_ENTRY_FILE" 

echo "Cron job de monitoreo activado."

echo "==> Post-Despliegue completado exitosamente."