import {
    CATEGORIES_ROUTE,
    NEW_TEST_CATEGORY_NAME,
    NOT_EXISTENT_CATEGORY_ID,
    TEST_CATEGORY_NAME
} from './utils/constants'
import { useState } from './utils/hooks'
import { testRequest } from './utils/test-request'

describe('Categories', () => {
    const [idState, setId] = useState<string | null>(null)

    describe(`[POST ${CATEGORIES_ROUTE}] Add Category`, () => {
        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'POST',
                    route: CATEGORIES_ROUTE,
                    body: {
                        name: TEST_CATEGORY_NAME
                    },
                    resCode: 200
                },
                (res) => {
                    expect(parseInt(res.body.id?.toString())).not.toBeNaN()
                    expect(res.body.id).toBeGreaterThan(0)

                    expect(res.body.name).toBe(TEST_CATEGORY_NAME)

                    setId(res.body.id)
                }
            )
        })

        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'POST',
                route: CATEGORIES_ROUTE,
                body: {},
                resBody: {
                    message: `body must have required property 'name'`,
                    statusCode: 400
                },
                resCode: 400
            })
        })

        it('Should response 400, when name already exists', async () => {
            await testRequest({
                method: 'POST',
                route: CATEGORIES_ROUTE,
                body: {
                    name: TEST_CATEGORY_NAME
                },
                resCode: 400
            })
        })
    })

    describe(`[GET ${CATEGORIES_ROUTE}] Get all Categories`, () => {
        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: CATEGORIES_ROUTE,
                    resCode: 200
                },
                (res) => {
                    expect(Array.isArray(res.body)).toBe(true)
                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            {
                                id: idState.state,
                                name: TEST_CATEGORY_NAME
                            }
                        ])
                    )
                }
            )
        })
    })

    describe(`[GET ${CATEGORIES_ROUTE}/:id] Get Category by id`, () => {
        it('Should response 200', async () => {
            await testRequest({
                method: 'GET',
                route: CATEGORIES_ROUTE,
                id: idState.state,
                resCode: 200,
                resBody: {
                    id: idState.state,
                    name: TEST_CATEGORY_NAME
                }
            })
        })

        it('Should response 404, when does not exist', async () => {
            await testRequest({
                method: 'GET',
                route: CATEGORIES_ROUTE,
                id: NOT_EXISTENT_CATEGORY_ID,
                resCode: 404
            })
        })
    })

    describe(`[PUT ${CATEGORIES_ROUTE}/:id] Update Category`, () => {
        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'PUT',
                    route: CATEGORIES_ROUTE,
                    id: idState.state,
                    body: {
                        name: NEW_TEST_CATEGORY_NAME
                    },
                    resCode: 200
                },
                (res) => {
                    expect(parseInt(res.body.id?.toString())).not.toBeNaN()
                    expect(res.body.id).toBeGreaterThan(0)

                    expect(res.body.name).toBe(NEW_TEST_CATEGORY_NAME)
                }
            )
        })

        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'PUT',
                route: CATEGORIES_ROUTE,
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
                route: CATEGORIES_ROUTE,
                id: NOT_EXISTENT_CATEGORY_ID,
                body: {
                    name: NEW_TEST_CATEGORY_NAME
                },
                resCode: 404
            })
        })
    })

    describe(`[DELETE ${CATEGORIES_ROUTE}/:id]`, () => {
        it('Should response 200', async () => {
            await testRequest({
                method: 'DELETE',
                route: CATEGORIES_ROUTE,
                id: idState.state,
                resCode: 200
            })
        })

        it('Should response 404, when does not exist', async () => {
            await testRequest({
                method: 'DELETE',
                route: CATEGORIES_ROUTE,
                id: NOT_EXISTENT_CATEGORY_ID,
                resCode: 404
            })
        })
    })
})
