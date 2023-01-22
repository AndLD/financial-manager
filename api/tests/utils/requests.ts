import { BANKS_ROUTE, CATEGORIES_ROUTE, TEST_BANK_NAME, TEST_CATEGORY_NAME } from './constants'
import { testRequest } from './test-request'

export async function postBank({ name, callback }: { name?: string; callback: (id: number) => void }) {
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

export async function postCategory({ name, callback }: { name?: string; callback: (id: number) => void }) {
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
