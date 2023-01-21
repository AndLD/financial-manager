import { testRequest } from './utils/test-request'

const banksRoute = '/api/banks'

describe('Banks', () => {
    describe(`[POST ${banksRoute}] Add Bank`, () => {
        it('Should response 400, when name is not specified', async () => {
            await testRequest({
                method: 'POST',
                route: banksRoute,
                body: {},
                resBody: {
                    message: `body must have required property 'name'`,
                    statusCode: 400
                },
                resCode: 400
            })
        })
    })
})
