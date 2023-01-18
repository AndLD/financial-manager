import { FastifyRequest, FastifyReply } from 'fastify'
import { dataSource } from '../models'
import { Transaction } from '../models/entities/Transaction'
import { TransactionCategory } from '../models/entities/TransactionCategory'

interface IGetStatisticsQuery {
    categoryIds: string
    fromPeriod: string
    toPeriod: string
}

async function getStatistics(req: FastifyRequest<{ Querystring: IGetStatisticsQuery }>, reply: FastifyReply) {
    const categoryIds = req.query.categoryIds?.split(',')?.map((str) => parseInt(str))
    const { fromPeriod, toPeriod } = req.query

    // const transactionCategories = await dataSource
    //     .getRepository(TransactionCategory)
    //     .createQueryBuilder()
    //     .select('SUM(amount)')
    //     .whereInIds(categoryIds.map((categoryId) => ({ categoryId })))
    //     .groupBy('transactionId')

    // const transactions = await dataSource
    //     .getRepository(Transaction)
    //     .createQueryBuilder()
    //     .select('id')
    //     .addSelect()
    //     .where('timestamp > :fromPeriod AND timestamp < :toPeriod', { fromPeriod, toPeriod })
    //     .execute()

    const statistics = await dataSource.query(
        `SELECT SUM(amount) FROM transaction_categories WHERE transactionId IN (
            SELECT id FROM transactions WHERE timestamp > $1 AND timestamp < $2) GROUP BY categoryId`,
        [fromPeriod, toPeriod]
    )

    reply.send(statistics)
}

export const statisticsControllers = {
    getStatistics
}
