import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { statisticsControllers } from '../controllers/statistics'
import { statisticsValidation } from '../validation/statistics'

export async function statisticsRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify.get('/', { schema: statisticsValidation.get }, statisticsControllers.getStatistics)
}
