import { FastifyRequest, FastifyReply } from 'fastify'
import { dataSource } from '../models'
import { Transaction } from '../models/entities/Transaction'
import { errors } from '../utils/constants'
import { IPostTransactionBody } from '../utils/interfaces/transaction'

async function getTransactions(req: FastifyRequest, reply: FastifyReply) {
    const transactions = await dataSource.getRepository(Transaction).find()

    reply.send(transactions)
}

async function getTransaction(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const transaction = await dataSource.getRepository(Transaction).findOneBy({ id: req.params.id })

    if (!transaction) {
        return reply.status(404).send()
    }

    reply.send(transaction)
}

async function postTransaction(req: FastifyRequest<{ Body: IPostTransactionBody }>, reply: FastifyReply) {
    const transaction = await dataSource.getRepository(Transaction).save(req.body)

    reply.send(transaction)
}

async function deleteTransaction(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const result = await dataSource.getRepository(Transaction).delete({ id: req.params.id })

    if (!result.affected) {
        throw errors.DOC_NOT_FOUND
    }

    reply.send()
}

export const transactionControllers = {
    getTransactions,
    getTransaction,
    postTransaction,
    deleteTransaction
}
