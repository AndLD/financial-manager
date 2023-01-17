import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Bank } from './entities/Bank'
import { Category } from './entities/Category'
import { Transaction } from './entities/Transaction'
import { TransactionCategory } from './entities/TransactionCategory'

const port = process.env.POSTGRES_PORT

export const dataSource = createDataSource()

export function createDataSource() {
    return new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: port ? parseInt(port) : 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [Bank, Category, Transaction, TransactionCategory]
    })
}
