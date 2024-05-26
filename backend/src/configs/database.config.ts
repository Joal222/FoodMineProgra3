import postgres from "postgres";

// Asegúrate de que la conexión a la base de datos incluye SSL
const dbConnect = postgres('postgres://admin:fmCgLTDAWmeV5zOMfbNG9Pl2WLQZbWcc@dpg-cp8vgf5ds78s73cacr10-a.oregon-postgres.render.com/ejercicio1', {
    ssl: {
        rejectUnauthorized: false // Esta opción permite conexiones a servidores con certificados autofirmados. En producción, considera usar `true`.
    }
});

export default dbConnect;
