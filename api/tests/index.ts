import { ObjectLiteral, SaveOptions } from 'typeorm'
import { startApp, stopApp } from '../app'
import { dataSource } from '../models'
import { Bank } from '../models/entities/Bank'
import { Category } from '../models/entities/Category'
import { Transaction } from '../models/entities/Transaction'
import { TransactionCategory } from '../models/entities/TransactionCategory'
import { Table } from '../utils/types'
import { idsToCleanupAfterAll, testDataSource } from './utils/data-source'

function ensureStringIsTable(str: string): str is Table {
    return str in Table
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

// Clean up created entities from DB, close DB connection, stop server
afterAll(async () => {
    if (idsToCleanupAfterAll.transactions.length) {
        await deleteEntitiesFromTable(Table.TRANSACTIONS)
        idsToCleanupAfterAll.transactions = []
    }

    let promises: Promise<any>[] = []

    let key: Table
    for (key in idsToCleanupAfterAll) {
        if (idsToCleanupAfterAll[key].length) {
            deleteEntitiesFromTable(key, promises)
        }
    }
    await Promise.all(promises)

    promises = [testDataSource.destroy(), stopApp()]
    await Promise.all(promises)
})

function deleteEntitiesFromTable(table: Table, promises?: Promise<any>[]) {
    const query = dataSource.createQueryBuilder().delete().from(table)
    const whereElements: ObjectLiteral[] = []
    idsToCleanupAfterAll[table].forEach((id) => whereElements.push([`id = ${id}`]))

    const queryPromise = query.where(whereElements.join(' OR ')).execute()
    if (promises) {
        promises.push(queryPromise)
    }

    return queryPromise
}
