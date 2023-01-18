import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { banksRouter } from './banks'
import { categoriesRouter } from './categories'
import { statisticsRouter } from './statistics'
import { transactionsRouter } from './transactions'

export async function apiRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify.register(banksRouter, { prefix: '/banks' })
    fastify.register(transactionsRouter, { prefix: '/transactions' })
    fastify.register(categoriesRouter, { prefix: '/categories' })
    fastify.register(statisticsRouter, { prefix: '/statistics' })
}
