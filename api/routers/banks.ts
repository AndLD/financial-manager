import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { bankControllers } from '../controllers/banks'

export async function banksRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', bankControllers.getBanks)
        .get('/:id', bankControllers.getBank)
        .post('/', bankControllers.postBank)
        .put('/:id', bankControllers.putBank)
        .delete('/:id', bankControllers.deleteBank)
}
