import { FastifySchema } from 'fastify'

export const statisticsValidation: {
    [key: string]: FastifySchema
} = {
    get: {
        querystring: {
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
