
module.exports = {
  apps: [
    {
      // --- Configuración para la API ---
      name: 'SecurityCam-API',       
      script: './irvingchampo-apisecurity/src/index.ts', 
      
      // PM2 usará ts-node para ejecutar el archivo TypeScript directamente.
      interpreter: 'node_modules/.bin/ts-node', 
      

      cwd: '/var/www/security-cam-project/irvingchampo-apisecurity',

      watch: false, 
      
   
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      // --- Configuración para el Servidor WebSocket ---
      name: 'SecurityCam-WebSocket',  
      script: './irvingchampo-ws-servidor-securitycam-/src/websocketServer.ts', 
      interpreter: 'node_modules/.bin/ts-node',
      cwd: '/var/www/security-cam-project/irvingchampo-ws-servidor-securitycam-',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};