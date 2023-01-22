import { FastifySchema } from 'fastify'

export interface IEntityOperations {
    get: FastifySchema
    getById?: FastifySchema
    post?: FastifySchema
    put?: FastifySchema
    delete?: FastifySchema
}
