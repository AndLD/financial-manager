import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'
import { errors } from '../utils/constants'

interface IGetStatisticsQuery {
    categoryIds: string
    fromPeriod: string
    toPeriod: string
}

async function getStatistics(req: FastifyRequest<{ Querystring: IGetStatisticsQuery }>, reply: FastifyReply) {
    if (new Date(req.query.fromPeriod) > new Date(req.query.toPeriod)) {
        throw errors.INVALID_DATE_PERIOD
    }

    const categoryIds = req.query.categoryIds

    for (const categoryId of categoryIds.split(',')) {
        if (isNaN(parseInt(categoryId))) {
            throw errors.INVALID_CATEGORY_IDS
        }
    }

    const { fromPeriod, toPeriod } = req.query

    const rawStatistics = await dataSource.query(
        `SELECT name AS category, SUM(amount) AS amount FROM transaction_categories
        LEFT JOIN categories ON categories.id = category_id
        WHERE category_id IN (${categoryIds}) 
        AND transaction_id IN (
            SELECT id FROM transactions WHERE timestamp > $1 AND timestamp < $2
        ) GROUP BY categories.name`,
        [fromPeriod, toPeriod]
    )

    const statistics: {
        [key: string]: number
    } = {}

    for (const row of rawStatistics) {
        statistics[row.category] = row.amount
    }

    reply.send(statistics)
}

export const statisticsControllers = {
    getStatistics
}
