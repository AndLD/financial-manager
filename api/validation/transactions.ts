import { FastifySchema } from 'fastify'

export const transactionsValidation: {
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
