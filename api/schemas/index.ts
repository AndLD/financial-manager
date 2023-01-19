import { OpenAPIV3 } from 'openapi-types'

export const error4xxSchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['message', 'statusCode'],
    properties: {
        message: {
            type: 'string'
        },
        statusCode: {
            type: 'number'
        }
    },
    example: {
        message: 'Invalid id',
        statusCode: 400
    }
}

export const error5xxSchema: OpenAPIV3.SchemaObject = {
    type: 'object',
    required: ['message', 'statusCode'],
    properties: {
        message: {
            type: 'string'
        },
        statusCode: {
            type: 'number'
        }
    },
    example: {
        message: 'insert or update on table "transactions" violates foreign key constraint "transactions_bank_id_fkey"',
        statusCode: 500
    }
}
