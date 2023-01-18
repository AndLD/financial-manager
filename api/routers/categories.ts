import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { categoryControllers } from '../controllers/categories'
import { categoriesValidation } from '../validation/categories'

export async function categoriesRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', categoryControllers.getCategories)
        .get('/:id', { schema: categoriesValidation.getById }, categoryControllers.getCategory)
        .post('/', { schema: categoriesValidation.post }, categoryControllers.postCategory)
        .put('/:id', { schema: categoriesValidation.put }, categoryControllers.putCategory)
        .delete('/:id', { schema: categoriesValidation.delete }, categoryControllers.deleteCategory)
}
