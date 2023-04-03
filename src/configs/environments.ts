import 'dotenv/config'

const environments = {
    PORT: process.env.PORT || 3000,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: Number(process.env.DB_PORT)

}

export default environments