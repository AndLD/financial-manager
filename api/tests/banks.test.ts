import { BANKS_ROUTE, NEW_TEST_BANK_NAME, NOT_EXISTENT_BANK_ID, TEST_BANK_NAME } from './utils/constants'
import { useState } from './utils/hooks'
import { postBank } from './utils/requests'
import { testRequest } from './utils/test-request'

describe('Banks', () => {
    const [idState, setId] = useState<number | null>(null)

    describe(`[POST ${BANKS_ROUTE}] Add Bank`, () => {
        it('Should response 200', async () =>
            await postBank({
                callback: setId
            }))

        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'POST',
                route: BANKS_ROUTE,
                body: {},
                resBody: {
                    message: `body must have required property 'name'`,
                    statusCode: 400
                },
                resCode: 400
            })
        })
    })

    describe(`[GET ${BANKS_ROUTE}] Get all Banks`, () => {
        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: BANKS_ROUTE,
                    resCode: 200
                },
                (res) => {
                    expect(Array.isArray(res.body)).toBe(true)
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            {
                                id: idState.state,
                                name: TEST_BANK_NAME,
                                balance: 0
                            }
                        ])
                    )
                }
            )
        })
    })

    describe(`[GET ${BANKS_ROUTE}/:id] Get Bank by id`, () => {
        it('Should response 200', async () => {
            await testRequest({
                method: 'GET',
                route: BANKS_ROUTE,
                id: idState.state,
                resCode: 200,
                resBody: {
                    id: idState.state,
                    name: TEST_BANK_NAME,
                    balance: 0
                }
            })
        })

        it('Should response 404, when does not exist', async () => {
            await testRequest({
                method: 'GET',
                route: BANKS_ROUTE,
                id: NOT_EXISTENT_BANK_ID,
                resCode: 404
            })
        })
    })

    describe(`[PUT ${BANKS_ROUTE}/:id] Update Bank`, () => {
        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'PUT',
                    route: BANKS_ROUTE,
                    id: idState.state,
                    body: {
                        name: NEW_TEST_BANK_NAME
                    },
                    resCode: 200
                },
                (res) => {
                    expect(parseInt(res.body.id?.toString())).not.toBeNaN()
                    expect(res.body.id).toBeGreaterThan(0)

                    expect(res.body.name).toBe(NEW_TEST_BANK_NAME)

                    expect(res.body.balance).toBe(0)
                }
            )
        })

        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'PUT',
                route: BANKS_ROUTE,
                id: idState.state,
                body: {},
                resBody: {
                    message: `body must have required property 'name'`,
                    statusCode: 400
                },
                resCode: 400
            })
        })

        it('Should response 404', async () => {
            await testRequest({
                method: 'PUT',
                route: BANKS_ROUTE,
                id: NOT_EXISTENT_BANK_ID,
                body: {
                    name: NEW_TEST_BANK_NAME
                },
                resCode: 404
            })
        })
    })

    describe(`[DELETE ${BANKS_ROUTE}/:id]`, () => {
        it('Should response 200', async () => {
            await testRequest({
                method: 'DELETE',
                route: BANKS_ROUTE,
                id: idState.state,
                resCode: 200
            })
        })

        it('Should response 404, when does not exist', async () => {
            await testRequest({
                method: 'DELETE',
                route: BANKS_ROUTE,
                id: NOT_EXISTENT_BANK_ID,
                resCode: 404
            })
        })
    })
})
