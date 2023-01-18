import { FastifySchema } from 'fastify'

export const banksValidation: {
    [key: string]: FastifySchema
} = {
    getById: {
        params: {
            id: {
                type: 'number'
            }
        }
    },
    post: {
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string'
                }
            }
        }
    },
    put: {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        },
        params: {
            id: {
                type: 'number'
            }
        }
    },
    delete: {
        params: {
            id: {
                type: 'number'
            }
        }
    }
}
