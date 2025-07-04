// app.js o index.js principal

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const pool = require('./config/db');
const appInsights = require('applicationinsights');

const app = express();

// Inicializar Application Insights
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/actividades', require('./routes/activity'));

// Verificar conexión y limpieza
pool.getConnection()
  .then(async () => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // 🔒 Limpiar usuarios marcados como online
    await pool.query('UPDATE users SET is_online = 0');

    // 🧼 Limpiar sesiones activas
    await pool.query('DELETE FROM sessions');

    console.log('🧹 Usuarios desconectados y sesiones eliminadas al iniciar el servidor.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
const limpiarTokensExpirados = require('./jobs/cleanExpiredTokens');
limpiarTokensExpirados(); // primera ejecución
setInterval(limpiarTokensExpirados, 15 * 60 * 1000); // cada 15 minutos
