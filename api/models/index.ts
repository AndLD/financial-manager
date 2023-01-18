import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { Bank } from './entities/Bank'
import { Category } from './entities/Category'
import { Transaction } from './entities/Transaction'
import { TransactionCategory } from './entities/TransactionCategory'

export const dataSource = createDataSource()

export function createDataSource() {
    const port = process.env.POSTGRES_PORT

    return new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || '127.0.0.1',
        port: port ? parseInt(port) : 5432,
        username: process.env.POSTGRES_USER || 'root',
        password: process.env.POSTGRES_PASSWORD || '12345',
        database: process.env.POSTGRES_DB || 'fm',
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [Bank, Category, Transaction, TransactionCategory]
    })
}
