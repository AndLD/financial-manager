import { FastifySchema } from 'fastify'

export const statisticsValidation: {
    [key: string]: FastifySchema
} = {
    get: {
        querystring: {
            type: 'object',
            required: ['categoryIds', 'fromPeriod', 'toPeriod'],
            properties: {
                categoryIds: {
                    type: 'string'
                },
                fromPeriod: {
                    type: 'string'
                },
                toPeriod: {
                    type: 'string'
                }
            }
        }
    }
}
