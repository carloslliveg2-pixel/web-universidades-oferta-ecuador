const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a tu base de datos restaurada
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'UNI PRUEBA 1', // Nombre de tu base de datos restaurada
    password: '20142003', // Tu contraseña
    port: 5432,
});

// Prueba la conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar a la base de datos:', err.stack);
    }
    console.log('¡Conectado exitosamente a la base de datos de Universidades!');
    release();
});

// Para que sirva tus archivos estáticos (index.html, CSS, imágenes, etc.) desde la carpeta actual
app.use(express.static(__dirname));

// Ruta para probar los datos de la base de datos (tabla carrera)
// Ruta para obtener carreras unidas con sus universidades
// Ruta para obtener las carreras y su universidad relacionada
// Ruta para obtener todas las carreras directamente de la tabla
// Ruta para inspeccionar la estructura de la tabla 'carrera'
app.get('/api/debug-carrera', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM carrera LIMIT 1');
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/carreras', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.nombre_carrera AS carrera,
                c.titulo AS titulo,
                c.semestres AS semestres,
                c.sede AS sede,
                u.nombre_u AS universidad,
                c.nombre_facu AS facultad
            FROM carrera c
            LEFT JOIN facultad f ON c.idfacultad = f.idfacultad
            LEFT JOIN universidad u ON f.iduniversidad = u.iduniversidad
        `;
        
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error al consultar la base de datos');
    }
});

// ¡ESTO ES LO QUE FALTABA! Iniciar el servidor web
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});