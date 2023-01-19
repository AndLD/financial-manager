import { FastifyReply, FastifyRequest } from 'fastify'
import { dataSource } from '../models'
import { Bank } from '../models/entities/Bank'
import { IPostBankBody, IPutBankBody } from '../utils/interfaces/bank'

async function getBanks(req: FastifyRequest, reply: FastifyReply) {
    const banks = await dataSource.getRepository(Bank).createQueryBuilder().select().orderBy('id').getMany()

    reply.send(banks)
}

async function getBank(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const bank = await dataSource.getRepository(Bank).findOneBy({ id: req.params.id })

    if (!bank) {
        return reply.status(404).send()
    }

    reply.send(bank)
}

async function postBank(req: FastifyRequest<{ Body: IPostBankBody }>, reply: FastifyReply) {
    const bank = await dataSource.getRepository(Bank).save(req.body)

    reply.send(bank)
}

async function putBank(req: FastifyRequest<{ Body: IPutBankBody; Params: { id: number } }>, reply: FastifyReply) {
    const result = await dataSource
        .getRepository(Bank)
        .createQueryBuilder()
        .update(req.body)
        .where('id = :id', { id: req.params.id })
        .returning('*')
        .updateEntity(true)
        .execute()

    const bank = result.raw[0]

    if (!bank) {
        return reply.status(404).send()
    }

    reply.send(bank)
}

async function deleteBank(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const result = await dataSource.getRepository(Bank).delete({ id: req.params.id })

    if (!result.affected) {
        return reply.status(404).send()
    }

    reply.send()
}

export const bankControllers = {
    getBanks,
    getBank,
    postBank,
    putBank,
    deleteBank
}
