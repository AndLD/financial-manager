import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { transactionControllers } from '../controllers/transactions'

export async function transactionsRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', transactionControllers.getTransactions)
        .get('/:id', transactionControllers.getTransaction)
        .post('/', transactionControllers.postTransaction)
        .delete('/:id', transactionControllers.deleteTransaction)
}
