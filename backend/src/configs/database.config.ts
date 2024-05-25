import postgres from "postgres";

// Conexion a la base de datos local ejercicio1

// Localhost
const dbConnect = postgres('postgres://postgres:@Gosto22@localhost:5432/ejercicio1');

export default dbConnect;
