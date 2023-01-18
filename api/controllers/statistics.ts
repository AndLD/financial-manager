import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'

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
        `SELECT category_id, SUM(amount) FROM transaction_categories WHERE category_id IN ($1) AND transaction_id IN (
            SELECT id FROM transactions WHERE timestamp > $2 AND timestamp < $3) GROUP BY category_id`,
        [categoryIds, fromPeriod, toPeriod]
    )

    reply.send(statistics)
}

export const statisticsControllers = {
    getStatistics
}
