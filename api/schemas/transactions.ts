import { OpenAPIV3 } from 'openapi-types'
import { error4xxSchema, error5xxSchema } from '.'
import { IEntityOperations } from '../utils/interfaces'
import { TransactionType } from '../utils/interfaces/transaction'

export const transactionSchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['id', 'bankId', 'amount', 'timestamp', 'type', 'transactionCategories'],
    properties: {
        id: { type: 'integer' },
        bankId: {
            type: 'integer'
        },
        amount: {
            type: 'number'
        },
        type: {
            type: 'string',
            enum: [TransactionType.CONSUMABLE, TransactionType.PROFITABLE]
        },
        timestamp: {
            type: 'string',
            format: 'date-time'
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
                        type: 'integer'
                    }
                }
            }
        }
    },
    example: {
        bankId: 1,
        id: 13,
        amount: 340,
        type: 'profitable',
        transactionCategories: [
            {
                amount: 340,
                categoryId: 1
            }
        ]
    }
}

export const transactionsRouterSchemas: IEntityOperations = {
    get: {
        tags: ['transaction'],
        summary: 'Get transactions by pagination',
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
        },
        response: {
            200: {
                type: 'object',
                required: ['transactions', 'meta'],
                properties: {
                    transactions: {
                        type: 'array',
                        items: transactionSchema
                    },
                    meta: {
                        type: 'object',
                        required: ['page', 'size', 'total'],
                        properties: {
                            page: {
                                type: 'integer'
                            },
                            size: {
                                type: 'integer'
                            },
                            total: {
                                type: 'integer'
                            }
                        }
                    }
                }
            },
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    post: {
        tags: ['transaction'],
        summary: 'Add transaction',
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
        },
        response: {
            200: transactionSchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    delete: {
        tags: ['transaction'],
        summary: 'Delete transaction by id',
        params: {
            id: {
                type: 'number'
            }
        },
        response: {
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    }
}
