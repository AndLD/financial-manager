import { SwaggerOptions } from '@fastify/swagger'
import { FastifyRegisterOptions } from 'fastify'
import packageJson from './package.json'
import { bankSchema } from './schemas/banks'
import { categorySchema } from './schemas/categories'
import { transactionSchema } from './schemas/transactions'

export const swaggerSchema: FastifyRegisterOptions<SwaggerOptions> | undefined = {
    openapi: {
        openapi: '3.0.3',
        info: {
            title: 'Financial Manager API',
            description: packageJson.description,
            contact: {
                name: 'Andrii Larionov',
                email: 'andrey.larionov.me@gmail.com'
            },
            version: packageJson.version,
            license: {
                name: packageJson.license
            }
        },
        externalDocs: {
            url: packageJson.homepage,
            description: 'GitHub Repository'
        },
        servers: [{ url: 'http://localhost:8080' }],
        tags: [
            { name: 'bank', description: 'Bank related end-points' },
            { name: 'category', description: 'Category related end-points' },
            { name: 'transaction', description: 'Transaction related end-points' },
            { name: 'statistics', description: 'Statistics related end-points' }
        ],
        components: {
            schemas: {
                Bank: bankSchema,
                Category: categorySchema,
                Transaction: transactionSchema
            }
        }
    }
}
