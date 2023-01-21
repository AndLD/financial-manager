import { HTTPMethods } from 'fastify'
import supertest, { Response } from 'supertest'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080
const url = `http://${host}:${port}`

const server: any = supertest.agent(url)

export async function testRequest<T>(
    {
        method = 'GET',
        route,
        id,
        query,
        body,
        resBody: resBody,
        resCode = 200,
        auth
    }: {
        method?: HTTPMethods
        route: string
        id?: string | number
        query?: { [key: string]: string }
        body?: T
        resBody?: any
        resCode?: number
        auth?: string
    },
    callback?: (res: Response) => void
) {
    const url = `${route}${id ? `/${id}` : ''}${
        query && Object.keys(query).length
            ? `?${Object.keys(query)
                  .map((key) => `${key}=${query[key]}`)
                  .join('&')}`
            : ''
    }`

    const res: Response = await server[method.toLowerCase()](url)
        .set('Accept', /json/)
        .set('Authorization', auth ? auth : null)
        .send(body)
        .expect(resCode)

    resBody && expect(res.body).toEqual(expect.objectContaining(resBody))

    callback && callback(res)
}
