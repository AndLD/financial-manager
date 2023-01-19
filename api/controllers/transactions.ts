import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'
import { Transaction } from '../models/entities/Transaction'
import { TransactionCategory } from '../models/entities/TransactionCategory'
import { errors } from '../utils/constants'
import { IPostTransactionBody, ITransactionInfo, TransactionType } from '../utils/interfaces/transaction'

interface IGetTransactionsQuery {
    page: number
    size?: number
}

async function getTransactions(req: FastifyRequest<{ Querystring: IGetTransactionsQuery }>, reply: FastifyReply) {
    const page = req.query.page
    const size = req.query.size || 10

    if (page <= 0 || size <= 0) {
        return reply.status(400).send({ message: 'Pagination parameters should be positive numbers', statusCode: 400 })
    }

    const transactions = dataSource
        .getRepository(Transaction)
        .createQueryBuilder()
        .select()
        .orderBy('timestamp', 'DESC')
        .limit(size)
        .offset((page - 1) * size)
        .getMany()

    const total = dataSource.getRepository(Transaction).count()

    await Promise.all([transactions, total])

    const meta = {
        page,
        size,
        total: await total
    }

    reply.send({
        transactions: await transactions,
        meta
    })
}

async function postTransaction(req: FastifyRequest<{ Body: IPostTransactionBody }>, reply: FastifyReply) {
    await dataSource.transaction(async (transactionalManager) => {
        const transaction = await transactionalManager.getRepository(Transaction).save({ bankId: req.body.bankId })

        const promises = []

        for (const transactionCategory of req.body.transactionCategories) {
            promises.push(
                transactionalManager.getRepository(TransactionCategory).save({
                    ...transactionCategory,
                    transactionId: transaction.id
                })
            )
        }

        const transactionCategories = await Promise.all(promises)

        const transactionAmount = transactionCategories
            .map(({ amount }) => amount)
            .reduce((previous, current) => previous + current, 0)

        const transactionType = transactionAmount >= 0 ? TransactionType.PROFITABLE : TransactionType.CONSUMABLE

        const transactionInfo: ITransactionInfo = {
            ...transaction,
            amount: transactionAmount,
            type: transactionType,
            transactionCategories: transactionCategories.map(({ amount, categoryId }) => ({ amount, categoryId }))
        }

        reply.send(transactionInfo)
    })
}

async function deleteTransaction(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const result = await dataSource.getRepository(Transaction).delete({ id: req.params.id })

    if (!result.affected) {
        throw errors.DOC_NOT_FOUND
    }

    reply.send()
}

export const transactionControllers = {
    getTransactions,
    postTransaction,
    deleteTransaction
}
