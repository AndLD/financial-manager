export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost'

export const errors = {
    INVALID_DATE_PERIOD: {
        message: "Query param 'fromPeriod' is greater than 'toPeriod'",
        statusCode: 400
    },
    INVALID_CATEGORY_IDS: { message: 'Invalid categoryIds!', statusCode: 400 },
    INVALID_PAGINATION: { message: 'Pagination parameters should be positive numbers', statusCode: 400 },
    TRANSACTION_CATEGORIES_EMPTY: { message: 'TransactionCategories array should not be empty', statusCode: 400 }
}

export const consoleColors = {
    fgRed: '\x1b[31m'
}
