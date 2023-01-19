import { OpenAPIV3 } from 'openapi-types'
import { error4xxSchema, error5xxSchema } from '.'
import { IEntityOperations } from '../utils/interfaces'

export const statisticsSchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    additionalProperties: {
        type: 'number'
    },
    example: {
        'Fast Food': -300,
        Fuel: -1525.75,
        Salary: 8000
    }
}

export const statisticsRouterSchemas: IEntityOperations = {
    get: {
        tags: ['statistics'],
        summary: 'Get statistics',
        querystring: {
            type: 'object',
            required: ['categoryIds', 'fromPeriod', 'toPeriod'],
            properties: {
                categoryIds: {
                    type: 'string'
                },
                fromPeriod: {
                    type: 'string',
                    format: 'date-time'
                },
                toPeriod: {
                    type: 'string',
                    format: 'date-time'
                }
            }
        },
        response: {
            200: statisticsSchema,
            '4xx': error4xxSchema,
            '5xx': error5xxSchema
        }
    }
}
