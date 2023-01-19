import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { categoryControllers } from '../controllers/categories'
import { categoriesRouterSchemas } from '../schemas/categories'

export async function categoriesRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', { schema: categoriesRouterSchemas.get }, categoryControllers.getCategories)
        .get('/:id', { schema: categoriesRouterSchemas.getById }, categoryControllers.getCategory)
        .post('/', { schema: categoriesRouterSchemas.post }, categoryControllers.postCategory)
        .put('/:id', { schema: categoriesRouterSchemas.put }, categoryControllers.putCategory)
        .delete('/:id', { schema: categoriesRouterSchemas.delete }, categoryControllers.deleteCategory)
}
