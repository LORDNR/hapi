import "reflect-metadata"
import { Connection, createConnection } from "typeorm"
import configs from "../configs"


export const initDB = async (): Promise<Connection> => {
    const con = await createConnection({
        type: 'postgres',
        // host: "localhost",
        port: configs.environments.DB_PORT,
        username: configs.environments.DB_USER,
        password: configs.environments.DB_PASS,
        database: configs.environments.DB_DATABASE,
    })
    await con.synchronize(true)
    return con
}



// const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "root",
//     password: "admin",
//     database: "test",
//     synchronize: true,
//     logging: false,
// })

// AppDataSource.initialize()
//     .then(() => {
//         console.log('you can start to work with your database.');

//     })
//     .catch((error) => console.log(error))