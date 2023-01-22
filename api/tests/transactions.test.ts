import { Bank } from '../models/entities/Bank'
import { IPostTransactionBody, TransactionType } from '../utils/interfaces/transaction'
import {
    NOT_EXISTENT_TRANSACTION_ID,
    TRANSACTIONS_CATEGORY_AMOUNT,
    TRANSACTIONS_CATEGORY_AMOUNT_2,
    TRANSACTIONS_ROUTE
} from './utils/constants'
import { idsToCleanupAfterAll, testDataSource } from './utils/data-source'
import { useState } from './utils/hooks'
import { postBank, postCategory } from './utils/requests'
import { testRequest } from './utils/test-request'

describe('Transactions', () => {
    const [transactionIdState, setTransactionId] = useState<number | null>(null)
    const [bankIdState, setBankId] = useState<number | null>(null)
    const [categoryIdsState, setCategoryIds] = useState<number[]>([])

    describe(`[POST ${TRANSACTIONS_ROUTE}] Add Transaction`, () => {
        beforeAll(async () => {
            const promises = []

            // Add Bank
            promises.push(postBank({ callback: setBankId }))
            // Add 2 Categories
            const postCategoryCallback = (id: number) => {
                setCategoryIds([...categoryIdsState.state, id])
            }

            promises.push(
                postCategory({
                    name: 'First Category',
                    callback: postCategoryCallback
                }),
                postCategory({
                    name: 'Second Category',
                    callback: postCategoryCallback
                })
            )

            await Promise.all(promises)

            idsToCleanupAfterAll['banks'].push(bankIdState.state)
            idsToCleanupAfterAll['categories'].push(...categoryIdsState.state)
        })

        it('Should response 200', async () => {
            await testRequest<IPostTransactionBody>(
                {
                    method: 'POST',
                    route: TRANSACTIONS_ROUTE,
                    body: {
                        bankId: bankIdState.state,
                        transactionCategories: [
                            {
                                categoryId: categoryIdsState.state[0],
                                amount: TRANSACTIONS_CATEGORY_AMOUNT
                            },
                            {
                                categoryId: categoryIdsState.state[1],
                                amount: TRANSACTIONS_CATEGORY_AMOUNT_2
                            }
                        ]
                    },
                    resBody: {
                        id: expect.any(Number),
                        amount: TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2,
                        type:
                            TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2 >= 0
                                ? TransactionType.PROFITABLE
                                : TransactionType.CONSUMABLE,
                        bankId: bankIdState.state,
                        transactionCategories: [
                            {
                                categoryId: categoryIdsState.state[0],
                                amount: TRANSACTIONS_CATEGORY_AMOUNT
                            },
                            {
                                categoryId: categoryIdsState.state[1],
                                amount: TRANSACTIONS_CATEGORY_AMOUNT_2
                            }
                        ]
                    },
                    resCode: 200
                },
                async (res) => {
                    const bank = await testDataSource.getRepository(Bank).findOneBy({ id: bankIdState.state })
                    expect(bank?.balance).toBe(TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2)

                    setTransactionId(res.body.id)
                }
            )
        })

        it('Should response 400, when transactionCategories array is empty', async () => {
            await testRequest<IPostTransactionBody>({
                method: 'POST',
                route: TRANSACTIONS_ROUTE,
                body: {
                    bankId: bankIdState.state,
                    transactionCategories: []
                },
                resCode: 400
            })
        })

        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'POST',
                route: TRANSACTIONS_ROUTE,
                body: {
                    transactionCategories: [
                        {
                            categoryId: categoryIdsState.state[0],
                            amount: TRANSACTIONS_CATEGORY_AMOUNT
                        },
                        {
                            categoryId: categoryIdsState.state[1],
                            amount: TRANSACTIONS_CATEGORY_AMOUNT_2
                        }
                    ]
                },
                resBody: {
                    message: `body must have required property 'bankId'`,
                    statusCode: 400
                },
                resCode: 400
            })
        })
    })

    describe(`[GET ${TRANSACTIONS_ROUTE}] Get all Transactions`, () => {
        it("Should response 400, when 'page' query property not specified", async () => {
            await testRequest({
                method: 'GET',
                route: TRANSACTIONS_ROUTE,
                resCode: 400,
                resBody: {
                    message: `querystring must have required property 'page'`,
                    statusCode: 400
                }
            })
        })

        it("Should response 400, when 'page' query property is less than 0", async () => {
            await testRequest({
                method: 'GET',
                route: TRANSACTIONS_ROUTE,
                query: {
                    page: -1
                },
                resCode: 400,
                resBody: { message: 'Pagination parameters should be positive numbers', statusCode: 400 }
            })
        })

        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'GET',
                    route: TRANSACTIONS_ROUTE,
                    query: {
                        page: 1
                    },
                    resCode: 200
                },
                (res) => {
                    expect(Array.isArray(res.body.transactions)).toBe(true)
                    expect(res.body.transactions).toEqual(
                        expect.arrayContaining([
                            {
                                id: transactionIdState.state,
                                amount: TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2,
                                timestamp: expect.any(String),
                                type:
                                    TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2 >= 0
                                        ? TransactionType.PROFITABLE
                                        : TransactionType.CONSUMABLE,
                                bankId: bankIdState.state,
                                transactionCategories: [
                                    {
                                        categoryId: categoryIdsState.state[0],
                                        amount: TRANSACTIONS_CATEGORY_AMOUNT
                                    },
                                    {
                                        categoryId: categoryIdsState.state[1],
                                        amount: TRANSACTIONS_CATEGORY_AMOUNT_2
                                    }
                                ]
                            }
                        ])
                    )

                    expect(res.body.meta).toEqual({
                        page: 1,
                        size: expect.any(Number),
                        total: expect.any(Number)
                    })
                }
            )
        })
    })

    describe(`[DELETE ${TRANSACTIONS_ROUTE}/:id]`, () => {
        it('Should response 404, when does not exist', async () => {
            await testRequest(
                {
                    method: 'DELETE',
                    route: TRANSACTIONS_ROUTE,
                    id: NOT_EXISTENT_TRANSACTION_ID,
                    resCode: 404
                },
                async () => {
                    const bank = await testDataSource.getRepository(Bank).findOneBy({ id: bankIdState.state })
                    expect(bank?.balance).toBe(TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2)
                }
            )
        })

        it('Should response 200', async () => {
            await testRequest(
                {
                    method: 'DELETE',
                    route: TRANSACTIONS_ROUTE,
                    id: transactionIdState.state,
                    resCode: 200
                },
                async () => {
                    const bank = await testDataSource.getRepository(Bank).findOneBy({ id: bankIdState.state })
                    expect(bank?.balance).toBe(0)
                }
            )
        })
    })
})
