import "reflect-metadata"
import { DataSource } from "typeorm"

import configs from "../configs"
import { UserEntity } from './entites'

export const initDB = new DataSource({
    type: "postgres",
    host: "localhost",
    port: configs.environments.DB_PORT,
    username: configs.environments.DB_USER,
    password: configs.environments.DB_PASS,
    database: configs.environments.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [UserEntity]
})