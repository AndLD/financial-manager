import { FastifySchema } from 'fastify'

export const transactionsValidation: {
    [key: string]: FastifySchema
} = {
    get: {
        querystring: {
            type: 'object',
            required: ['page'],
            properties: {
                page: {
                    type: 'number'
                },
                size: {
                    type: 'number'
                }
            }
        }
    },
    post: {
        body: {
            type: 'object',
            required: ['bankId', 'transactionCategories'],
            properties: {
                bankId: {
                    type: 'number'
                },
                transactionCategories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['amount', 'categoryId'],
                        properties: {
                            amount: {
                                type: 'number'
                            },
                            categoryId: {
                                type: 'number'
                            }
                        }
                    }
                }
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
