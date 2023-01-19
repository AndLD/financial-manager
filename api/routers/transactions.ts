import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { transactionControllers } from '../controllers/transactions'
import { transactionsRouterSchemas } from '../schemas/transactions'

export async function transactionsRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', { schema: transactionsRouterSchemas.get }, transactionControllers.getTransactions)
        .post('/', { schema: transactionsRouterSchemas.post }, transactionControllers.postTransaction)
        .delete('/:id', { schema: transactionsRouterSchemas.delete }, transactionControllers.deleteTransaction)
}
