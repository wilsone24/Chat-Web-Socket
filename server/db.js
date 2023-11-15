import {createPool} from 'mysql2/promise'

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'WmEo.1739',
    port: 3306,
    database: 'company_chat' 
})
