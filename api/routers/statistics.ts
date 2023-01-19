import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { statisticsControllers } from '../controllers/statistics'
import { statisticsRouterSchemas } from '../schemas/statistics'

export async function statisticsRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify.get('/', { schema: statisticsRouterSchemas.get }, statisticsControllers.getStatistics)
}
