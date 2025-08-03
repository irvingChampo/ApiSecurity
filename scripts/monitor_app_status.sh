#!/bin/bash

# ======================================================================
# === SCRIPT DE MONITOREO DE ESTADO DE LA APLICACIÓN ===
# ======================================================================

# --- CONFIGURACIÓN ---
# URL del endpoint de Health Check de nuestra API
APP_URL="http://localhost:5001/health" 

# ¡IMPORTANTE! Reemplaza esto con la URL de tu propio Webhook de Discord.
DISCORD_WEBHOOK_URL="TU_URL_DE_WEBHOOK_DE_DISCORD_AQUI" 

# --- RUTAS Y ARCHIVOS DE ESTADO ---
LOG_DIR="/var/log/security_cam_monitor"
STATUS_FILE="$LOG_DIR/api_last_active.timestamp" # Guarda el timestamp de la última vez que la API estuvo activa
CRON_DISABLED_FLAG="$LOG_DIR/cron_disabled.flag" # Archivo para indicar que el cron está deshabilitado
MONITOR_LOG="$LOG_DIR/monitor.log"               # Log de la actividad de este script

# --- FUNCIÓN PARA ENVIAR MENSAJE A DISCORD ---
send_discord_message() {
    local message="$1"
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{\"content\": \"$message\"}" \
         "$DISCORD_WEBHOOK_URL"
}

# --- FUNCIÓN PARA DESHABILITAR EL MONITOREO ---
disable_monitoring() {
    # Creamos un archivo "flag" para indicar que el monitoreo está pausado.
    # El script de post-deploy se encargará de borrar este archivo para reanudar.
    sudo touch "$CRON_DISABLED_FLAG"
    echo "$(date +"%Y-%m-%d %H:%M:%S") - Monitoreo deshabilitado debido a fallo." >> "$MONITOR_LOG"
}

# --- LÓGICA PRINCIPAL ---

# Asegurarse de que el directorio de logs exista
sudo mkdir -p "$LOG_DIR"
sudo chown -R "$USER":"$(id -gn)" "$LOG_DIR" # Asegura que el usuario pueda escribir

# Si el flag de deshabilitado existe, no hacemos nada.
if [ -f "$CRON_DISABLED_FLAG" ]; then
    exit 0
fi

# 1. Verificar el estado de la API
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")
CURRENT_TIMESTAMP=$(date +%s)

if [ "$RESPONSE_CODE" == "200" ]; then
    # La API está activa. Actualizamos el timestamp de "última vez vista activa".
    echo "$CURRENT_TIMESTAMP" > "$STATUS_FILE"
    echo "$(date +"%Y-%m-%d %H:%M:%S") - OK. La API está respondiendo." >> "$MONITOR_LOG"
else
    # La API ha fallado.
    echo "$(date +"%Y-%m-%d %H:%M:%S") - FALLO. La API no responde (HTTP Status: $RESPONSE_CODE)." >> "$MONITOR_LOG"

    if [ -f "$STATUS_FILE" ]; then
        LAST_ACTIVE_TIMESTAMP=$(cat "$STATUS_FILE")
        UPTIME_SECONDS=$((CURRENT_TIMESTAMP - LAST_ACTIVE_TIMESTAMP))

        # Convertir segundos a un formato legible
        HOURS=$((UPTIME_SECONDS / 3600))
        MINUTES=$(((UPTIME_SECONDS % 3600) / 60))
        SECONDS=$((UPTIME_SECONDS % 60))
        UPTIME_FORMATTED=$(printf "%02d horas, %02d minutos, %02d segundos" $HOURS $MINUTES $SECONDS)

        MESSAGE="⚠️ **ALERTA: API SecurityCam Caída** ⚠️\n"
        MESSAGE+="> **Tiempo activa (Uptime):** $UPTIME_FORMATTED\n"
        MESSAGE+="> **Detectado caído el:** $(date +"%Y-%m-%d %H:%M:%S") UTC (Estado HTTP: $RESPONSE_CODE)\n\n"
        MESSAGE+="> El monitoreo se ha detenido. Se reactivará en el próximo despliegue exitoso."

        send_discord_message "$MESSAGE"
        
        # Eliminar el archivo de estado para reiniciar el contador en el futuro.
        rm -f "$STATUS_FILE"
    else
        # No se encontró un estado previo, es posible que haya fallado al iniciar.
        MESSAGE="⚠️ **ALERTA: API SecurityCam Caída** ⚠️\n"
        MESSAGE+="> La aplicación no responde y no se pudo determinar su tiempo de actividad previo.\n"
        MESSAGE+="> **Detectado caído el:** $(date +"%Y-%m-%d %H:%M:%S") UTC (Estado HTTP: $RESPONSE_CODE)"
        send_discord_message "$MESSAGE"
    fi
    
    # Deshabilitar el monitoreo para evitar spam de alertas.
    disable_monitoring
fi