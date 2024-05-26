import postgres from "postgres";

// Conexion a la base de datos local ejercicio1

// Localhost
const dbConnect = postgres('postgres://admin:fmCgLTDAWmeV5zOMfbNG9Pl2WLQZbWcc@dpg-cp8vgf5ds78s73cacr10-a.oregon-postgres.render.com\n/ejercicio1');

export default dbConnect;
