
# === SCRIPT DE PRE-DESPLIEGUE ===# 

echo "==> Iniciando Pre-Despliegue..."

# Detiene y elimina todas las aplicaciones gestionadas por PM2.
# Esto asegura un reinicio limpio y elimina procesos antiguos.
# El '|| true' asegura que el script no falle si no hay procesos corriendo.
echo "Deteniendo todos los servicios gestionados por PM2..."
pm2 stop all || true
pm2 delete all || true

# Opcional: Limpiar logs antiguos de PM2 para mantener el disco limpio.
pm2 flush

echo "==> Pre-Despliegue completado."