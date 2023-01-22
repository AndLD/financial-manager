import { createDataSource } from '../../models'
import { Table } from '../../utils/types'

export const testDataSource = createDataSource('test')

export const idsToCleanupAfterAll: {
    [key in Table]: number[]
} = {
    banks: [],
    categories: [],
    transactions: [],
    transaction_categories: []
}
