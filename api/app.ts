import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastify, { FastifyError } from 'fastify'
import 'reflect-metadata'
import { dataSource } from './models'
import { apiRouter } from './routers'
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

        app.register(apiRouter, { prefix: '/api' })

        app.setErrorHandler(function (error: FastifyError, _, reply) {
            this.log.error(error)
            reply.status(error.statusCode || 500).send({ message: error.message, statusCode: error.statusCode || 500 })
        })

        await app.ready()

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
