import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { bankControllers } from '../controllers/banks'
import { banksRouterSchemas } from '../schemas/banks'

export async function banksRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', { schema: banksRouterSchemas.get }, bankControllers.getBanks)
        .get('/:id', { schema: banksRouterSchemas.getById }, bankControllers.getBank)
        .post('/', { schema: banksRouterSchemas.post }, bankControllers.postBank)
        .put('/:id', { schema: banksRouterSchemas.put }, bankControllers.putBank)
        .delete('/:id', { schema: banksRouterSchemas.delete }, bankControllers.deleteBank)
}
