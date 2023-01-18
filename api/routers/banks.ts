import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { bankControllers } from '../controllers/banks'
import { banksValidation } from '../validation/banks'

export async function banksRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', bankControllers.getBanks)
        .get('/:id', { schema: banksValidation.getById }, bankControllers.getBank)
        .post('/', { schema: banksValidation.post }, bankControllers.postBank)
        .put('/:id', { schema: banksValidation.put }, bankControllers.putBank)
        .delete('/:id', { schema: banksValidation.delete }, bankControllers.deleteBank)
}
