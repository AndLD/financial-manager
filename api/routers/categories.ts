import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { categoryControllers } from '../controllers/categories'

export async function categoriesRouter(fastify: FastifyInstance, _: FastifyPluginOptions) {
    fastify
        .get('/', categoryControllers.getCategories)
        .get('/:id', categoryControllers.getCategory)
        .post('/', categoryControllers.postCategory)
        .put('/:id', categoryControllers.putCategory)
        .delete('/:id', categoryControllers.deleteCategory)
}
