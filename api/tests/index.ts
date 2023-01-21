import { SaveOptions } from 'typeorm'
import { startApp, stopApp } from '../app'
import { dataSource } from '../models'
import { Bank } from '../models/entities/Bank'
import { Category } from '../models/entities/Category'
import { Transaction } from '../models/entities/Transaction'
import { TransactionCategory } from '../models/entities/TransactionCategory'
import { Table } from '../utils/types'
import { testDataSource } from './utils/data-source'

function ensureStringIsTable(str: string): str is Table {
    return str in Table
}

const idsToCleanupAfterAll: {
    [key in Table]: number[]
} = {
    banks: [],
    categories: [],
    transactions: [],
    transaction_categories: []
}

beforeAll(async () => {
    await startApp()
    await testDataSource.initialize()

    for (const key in Table) {
        if (ensureStringIsTable(key)) {
            jest.spyOn(dataSource.getRepository(getEntityByTable(key)), 'save').mockImplementation(
                async (entity: any, options?: SaveOptions | undefined) => {
                    const result = await testDataSource.getRepository(getEntityByTable(key)).save(entity, options)

                    if (result.id) {
                        idsToCleanupAfterAll[key].push(result.id)
                    }

                    return result
                }
            )
        }
    }
})

function getEntityByTable(table: Table) {
    switch (table) {
        case Table.BANKS:
            return Bank
        case Table.CATEGORY:
            return Category
        case Table.TRANSACTIONS:
            return Transaction
        case Table.TRANSACTION_CATEGORIES:
            return TransactionCategory
    }
}

afterAll(async () => {
    let promises: Promise<any>[] = []

    console.log('idsToCleanupAfterAll', idsToCleanupAfterAll)

    // Clean up created entities from DB after all
    let key: Table
    for (key in idsToCleanupAfterAll) {
        if (idsToCleanupAfterAll[key].length) {
            const query = dataSource.createQueryBuilder().delete().from(key)
            idsToCleanupAfterAll[key].forEach((id) => query.where('id = :id', { id }))
            promises.push(query.execute())
        }
    }
    await Promise.all(promises)

    promises = [testDataSource.destroy(), stopApp()]
    await Promise.all(promises)
})
