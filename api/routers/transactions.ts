import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { transactionControllers } from '../controllers/transactions'
import { transactionsValidation } from '../validation/transactions'

export async function transactionsRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', { schema: transactionsValidation.get }, transactionControllers.getTransactions)
        .post('/', { schema: transactionsValidation.post }, transactionControllers.postTransaction)
        .delete('/:id', { schema: transactionsValidation.delete }, transactionControllers.deleteTransaction)
}
