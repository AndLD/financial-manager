import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify, { FastifyError } from 'fastify'
import 'reflect-metadata'
import { dataSource } from './models'
import { apiRouter } from './routers'
import { swaggerSchema } from './swagger'
import { FRONTEND_URL } from './utils/constants'

export const app = fastify({
    logger: true
})

export function startApp() {
    return new Promise<void>(async (resolve) => {
        app.register(fastifyHelmet)

        const corsOptions = {
            origin: FRONTEND_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
        app.register(fastifyCors, corsOptions)

        await app.register(fastifySwagger, swaggerSchema)
        await app.register(fastifySwaggerUi, {
            prefix: '/swagger'
        })

        app.register(apiRouter, { prefix: '/api' })

        app.setErrorHandler(function (error: FastifyError, _, reply) {
            this.log.error(error)
            reply.status(error.statusCode || 500).send({ message: error.message, statusCode: error.statusCode || 500 })
        })

        await app.ready()
        app.swagger()

        await dataSource.initialize()

        app.listen({ host: '127.0.0.1', port: 8080 }, (err) => {
            if (err) {
                app.log.error(err)
                process.exit(1)
            }

            resolve()
        })
    })
}

export async function stopApp() {
    await app.close()
    if (dataSource.isInitialized) {
        await dataSource.destroy()
    }
}
