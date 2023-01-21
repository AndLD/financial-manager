import { OpenAPIV3 } from 'openapi-types'
import { error4xxSchema, error5xxSchema } from '.'
import { IEntityOperations } from '../utils/interfaces'

export const bankSchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['id', 'name', 'balance'],
    properties: {
        id: { type: 'integer' },
        name: {
            type: 'string'
        },
        balance: {
            type: 'number'
        }
    },
    example: {
        id: 1,
        name: 'Privat24',
        balance: 2000
    }
}

export const banksRouterSchemas: IEntityOperations = {
    get: {
        tags: ['bank'],
        summary: 'Get all banks',
        response: {
            200: {
                type: 'array',
                items: bankSchema
            }
        }
    },
    getById: {
        tags: ['bank'],
        summary: 'Get bank by id',
        params: {
            id: {
                type: 'number'
            }
        },
        response: {
            200: bankSchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    post: {
        tags: ['bank'],
        summary: 'Add bank',
        body: {
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string'
                }
            }
        },
        response: {
            200: bankSchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    put: {
        tags: ['bank'],
        summary: 'Update bank by id',
        body: {
            type: 'object',
            required: ['name'],
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
        },
        response: {
            200: bankSchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    delete: {
        tags: ['bank'],
        summary: 'Delete bank by id',
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
