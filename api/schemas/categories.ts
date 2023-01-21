import { OpenAPIV3 } from 'openapi-types'
import { error4xxSchema, error5xxSchema } from '.'
import { IEntityOperations } from '../utils/interfaces'

export const categorySchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
        id: { type: 'integer' },
        name: {
            type: 'string'
        }
    },
    example: {
        id: 1,
        name: 'Fast Food'
    }
}

export const categoriesRouterSchemas: IEntityOperations = {
    get: {
        tags: ['category'],
        summary: 'Get all categories',
        response: {
            200: {
                type: 'array',
                items: categorySchema
            }
        }
    },
    getById: {
        tags: ['category'],
        summary: 'Get category by id',
        params: {
            id: {
                type: 'number'
            }
        },
        response: {
            200: categorySchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    post: {
        tags: ['category'],
        summary: 'Add category',
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
            200: categorySchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    put: {
        tags: ['category'],
        summary: 'Update category by id',
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
            200: categorySchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    },
    delete: {
        tags: ['category'],
        summary: 'Delete category by id',
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
