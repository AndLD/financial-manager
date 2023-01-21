import { FastifySchema } from 'fastify'
import { Table } from '../types'

export interface IEntityOperations {
    get: FastifySchema
    getById?: FastifySchema
    post?: FastifySchema
    put?: FastifySchema
    delete?: FastifySchema
}

export const idsToCleanupAfterAll: {
    [key in Table]: number[]
} = {
    banks: [],
    categories: [],
    transactions: [],
    transaction_categories: []
}
