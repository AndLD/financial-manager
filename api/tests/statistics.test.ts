import { errors } from '../utils/constants'
import { STATISTICS_ROUTE, TRANSACTIONS_CATEGORY_AMOUNT, TRANSACTIONS_CATEGORY_AMOUNT_2 } from './utils/constants'
import { idsToCleanupAfterAll } from './utils/data-source'
import { useState } from './utils/hooks'
import { postBank, postCategory, postTransaction } from './utils/requests'
import { testRequest } from './utils/test-request'

describe('Statistics', () => {
    const [transactionIdState, setTransactionId] = useState<number | null>(null)
    const [bankIdState, setBankId] = useState<number | null>(null)
    const [categoryIdsState, setCategoryIds] = useState<number[]>([])

    const TEST_BANK_NAME = 'Statistics Bank'
    const FIRST_CATEGORY_NAME = 'StatCat1'
    const SECOND_CATEGORY_NAME = 'StatCat2'

    describe(`[GET ${STATISTICS_ROUTE}] Get Statistics`, () => {
        beforeAll(async () => {
            const promises = []

            // Add Bank
            promises.push(postBank({ name: TEST_BANK_NAME, callback: setBankId }))

            // Add 2 Categories
            const postCategoryCallback = (id: number) => {
                setCategoryIds([...categoryIdsState.state, id])
            }
            promises.push(
                postCategory({
                    name: FIRST_CATEGORY_NAME,
                    callback: postCategoryCallback
                }),
                postCategory({
                    name: SECOND_CATEGORY_NAME,
                    callback: postCategoryCallback
                })
            )

            await Promise.all(promises)

            await postTransaction({
                bankId: bankIdState.state,
                categoryIds: categoryIdsState.state,
                callback: setTransactionId
            })

            idsToCleanupAfterAll['banks'].push(bankIdState.state)
            idsToCleanupAfterAll['categories'].push(...categoryIdsState.state)
            idsToCleanupAfterAll['transactions'].push(transactionIdState.state)
        })

        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(','),
                        fromPeriod: new Date(Date.now() - 60000).toISOString(),
                        toPeriod: new Date(Date.now() + 60000).toISOString()
                    },
                    resCode: 200
                },
                (res) => {
                    expect(res.body[FIRST_CATEGORY_NAME]).toBe(TRANSACTIONS_CATEGORY_AMOUNT)
                    expect(res.body[SECOND_CATEGORY_NAME]).toBe(TRANSACTIONS_CATEGORY_AMOUNT_2)
                }
            )
        })

        it('Should response 200 with empty body if period specified in query params already expired', async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(','),
                        fromPeriod: new Date(Date.now() - 60000).toISOString(),
                        toPeriod: new Date(Date.now() - 30000).toISOString()
                    },
                    resCode: 200
                },
                (res) => {
                    expect(res.body[FIRST_CATEGORY_NAME]).toBeUndefined()
                    expect(res.body[SECOND_CATEGORY_NAME]).toBeUndefined()
                }
            )
        })

        it("Should response 400, when query param 'categoryIds' not found", async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        fromPeriod: new Date(Date.now() - 60000).toISOString(),
                        toPeriod: new Date(Date.now() + 60000).toISOString()
                    },
                    resCode: 400
                },
                (res) => {
                    expect(res.body).toEqual({
                        message: "querystring must have required property 'categoryIds'",
                        statusCode: 400
                    })
                }
            )
        })

        it("Should response 400, when query param 'fromPeriod' not found", async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(','),
                        toPeriod: new Date(Date.now() + 60000).toISOString()
                    },
                    resCode: 400
                },
                (res) => {
                    expect(res.body).toEqual({
                        message: "querystring must have required property 'fromPeriod'",
                        statusCode: 400
                    })
                }
            )
        })

        it("Should response 400, when query param 'toPeriod' not found", async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(','),
                        fromPeriod: new Date(Date.now() - 60000).toISOString()
                    },
                    resCode: 400
                },
                (res) => {
                    expect(res.body).toEqual({
                        message: "querystring must have required property 'toPeriod'",
                        statusCode: 400
                    })
                }
            )
        })

        it("Should response 400, when query param 'fromPeriod' is greater than 'toPeriod'", async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(','),
                        fromPeriod: new Date(Date.now() - 30000).toISOString(),
                        toPeriod: new Date(Date.now() - 60000).toISOString()
                    },
                    resCode: 400
                },
                (res) => {
                    expect(res.body).toEqual(errors.INVALID_DATE_PERIOD)
                }
            )
        })

        it("Should response 400, when query param 'categoryIds' unable to split into numeric array", async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: STATISTICS_ROUTE,
                    query: {
                        categoryIds: categoryIdsState.state?.join(',') + ',invalidId',
                        fromPeriod: new Date(Date.now() - 60000).toISOString(),
                        toPeriod: new Date(Date.now() - 30000).toISOString()
                    },
                    resCode: 400
                },
                (res) => {
                    expect(res.body).toEqual(errors.INVALID_CATEGORY_IDS)
                }
            )
        })
    })
})
