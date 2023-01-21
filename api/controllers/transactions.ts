import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'
import { Transaction } from '../models/entities/Transaction'
import { TransactionCategory } from '../models/entities/TransactionCategory'
import { errors } from '../utils/constants'
import { IPostTransactionBody, ITransaction, ITransactionInfo, TransactionType } from '../utils/interfaces/transaction'
import { ITransactionCategory, ITransactionCategoryInfo } from '../utils/interfaces/transaction-category'

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

    const total = dataSource.getRepository(Transaction).count()

    const transactions = await dataSource
        .getRepository(Transaction)
        .createQueryBuilder()
        .select()
        .orderBy('timestamp', 'DESC')
        .limit(size)
        .offset((page - 1) * size)
        .getMany()

    const transactionInfos: ITransactionInfo[] = []

    if (transactions.length) {
        const transactionCategories = await dataSource
            .getRepository(TransactionCategory)
            .createQueryBuilder()
            .select()
            .where('transaction_id IN (:...transactionIds)', { transactionIds: transactions.map(({ id }) => id) })
            .getMany()

        for (const transaction of transactions) {
            const _transactionCategories: ITransactionCategoryInfo[] = []

            const transactionAmount = transactionCategories.reduce((previous, current, i) => {
                if (current.transactionId === transaction.id) {
                    _transactionCategories.push({
                        amount: transactionCategories[i].amount,
                        categoryId: transactionCategories[i].categoryId
                    })

                    return previous + current.amount
                }

                return previous
            }, 0)

            const transactionType = transactionAmount >= 0 ? TransactionType.PROFITABLE : TransactionType.CONSUMABLE

            const transactionInfo: ITransactionInfo = {
                ...transaction,
                amount: transactionAmount,
                type: transactionType,
                transactionCategories: _transactionCategories
            }

            transactionInfos.push(transactionInfo)
        }
    }

    const meta = {
        page,
        size,
        total: await total
    }

    reply.send({
        transactions: transactionInfos,
        meta
    })
}

async function postTransaction(req: FastifyRequest<{ Body: IPostTransactionBody }>, reply: FastifyReply) {
    if (!req.body.transactionCategories.length) {
        return reply.status(400).send({ message: 'TransactionCategories array should not be empty', statusCode: 400 })
    }

    await dataSource.transaction(async (transactionalManager) => {
        const insertResult = await dataSource
            .getRepository(Transaction)
            .createQueryBuilder()
            .insert()
            .values(req.body)
            .returning('*')
            .execute()

        const transaction = insertResult.generatedMaps[0] as ITransaction

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

        const transactionInfo = _getTransactionInfo(transaction, transactionCategories)

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

function _getTransactionInfo(transaction: ITransaction, transactionCategories: ITransactionCategory[]) {
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

    return transactionInfo
}

export const transactionControllers = {
    getTransactions,
    postTransaction,
    deleteTransaction
}
