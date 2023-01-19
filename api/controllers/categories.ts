import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'
import { Category } from '../models/entities/Category'
import { IPostCategoryBody, IPutCategoryBody } from '../utils/interfaces/category'

async function getCategories(req: FastifyRequest, reply: FastifyReply) {
    const categories = await dataSource.getRepository(Category).createQueryBuilder().select().orderBy('id').getMany()

    reply.send(categories)
}

async function getCategory(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const category = await dataSource.getRepository(Category).findOneBy({ id: req.params.id })

    if (!category) {
        return reply.status(404).send()
    }

    reply.send(category)
}

async function postCategory(req: FastifyRequest<{ Body: IPostCategoryBody }>, reply: FastifyReply) {
    const category = await dataSource.getRepository(Category).save(req.body)

    reply.send(category)
}

async function putCategory(
    req: FastifyRequest<{ Body: IPutCategoryBody; Params: { id: number } }>,
    reply: FastifyReply
) {
    const result = await dataSource
        .getRepository(Category)
        .createQueryBuilder()
        .update(req.body)
        .where('id = :id', { id: req.params.id })
        .returning('*')
        .updateEntity(true)
        .execute()

    const categorie = result.raw[0]

    if (!categorie) {
        return reply.status(404).send()
    }

    reply.send(categorie)
}

async function deleteCategory(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const result = await dataSource.getRepository(Category).delete({ id: req.params.id })

    if (!result.affected) {
        return reply.status(404).send()
    }

    reply.send()
}

export const categoryControllers = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    deleteCategory
}
