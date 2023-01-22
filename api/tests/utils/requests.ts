import { Bank } from '../../models/entities/Bank'
import { IPostTransactionBody, TransactionType } from '../../utils/interfaces/transaction'
import {
    BANKS_ROUTE,
    CATEGORIES_ROUTE,
    TEST_BANK_NAME,
    TEST_CATEGORY_NAME,
    TRANSACTIONS_CATEGORY_AMOUNT,
    TRANSACTIONS_CATEGORY_AMOUNT_2,
    TRANSACTIONS_ROUTE
} from './constants'
import { testDataSource } from './data-source'
import { testRequest } from './test-request'

type RequestCallback = (id: number) => void

export async function postBank({ name, callback }: { name?: string; callback: RequestCallback }) {
    await testRequest(
        {
            method: 'POST',
            route: BANKS_ROUTE,
            body: {
                name: name || TEST_BANK_NAME
            },
            resCode: 200
        },
        (res) => {
            expect(parseInt(res.body.id?.toString())).not.toBeNaN()
            expect(res.body.id).toBeGreaterThan(0)

            expect(res.body.name).toBe(name || TEST_BANK_NAME)

            expect(res.body.balance).toBe(0)

            callback(res.body.id)
        }
    )
}

export async function postCategory({ name, callback }: { name?: string; callback: RequestCallback }) {
    await testRequest(
        {
            method: 'POST',
            route: CATEGORIES_ROUTE,
            body: {
                name: name || TEST_CATEGORY_NAME
            },
            resCode: 200
        },
        (res) => {
            expect(parseInt(res.body.id?.toString())).not.toBeNaN()
            expect(res.body.id).toBeGreaterThan(0)

            expect(res.body.name).toBe(name || TEST_CATEGORY_NAME)

            callback(res.body.id)
        }
    )
}

export async function postTransaction({
    bankId,
    categoryIds,
    callback
}: {
    bankId: number
    categoryIds: number[]
    callback: RequestCallback
}) {
    await testRequest<IPostTransactionBody>(
        {
            method: 'POST',
            route: TRANSACTIONS_ROUTE,
            body: {
                bankId,
                transactionCategories: [
                    {
                        categoryId: categoryIds[0],
                        amount: TRANSACTIONS_CATEGORY_AMOUNT
                    },
                    {
                        categoryId: categoryIds[1],
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
                bankId,
                transactionCategories: [
                    {
                        categoryId: categoryIds[0],
                        amount: TRANSACTIONS_CATEGORY_AMOUNT
                    },
                    {
                        categoryId: categoryIds[1],
                        amount: TRANSACTIONS_CATEGORY_AMOUNT_2
                    }
                ]
            },
            resCode: 200
        },
        async (res) => {
            const bank = await testDataSource.getRepository(Bank).findOneBy({ id: bankId })
            expect(bank?.balance).toBe(TRANSACTIONS_CATEGORY_AMOUNT + TRANSACTIONS_CATEGORY_AMOUNT_2)

            callback(res.body.id)
        }
    )
}
