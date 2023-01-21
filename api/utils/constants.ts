export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost'

export const errors = {
    BAD_HTTP_METHOD: { message: 'Unexpected http request method', statusCode: 405 },
    USER_HAS_NO_RIGHTS: {
        message: 'User does not have enough permissions',
        statusCode: 403
    },
    DOC_NOT_FOUND: { message: 'The document does not exist', statusCode: 404 },
    UNAUTHORIZED: { message: 'Unauthorized', statusCode: 401 },
    EMAIL_NOT_MATCHES_PATTERN: { message: 'Email invalid', statusCode: 400 },
    ENTITY_ALREADY_EXISTS: { message: 'Entity already exists', statusCode: 400 },
    ENTITY_USED: { message: 'Entity already in use', statusCode: 400 },
    FORBIDDEN: { message: 'Forbidden', statusCode: 403 },
    BAD_REQUEST: { message: 'Bad request', statusCode: 400 },
    INTERNAL_SERVER_ERROR: { message: 'Internal server error', statusCode: 500 },
    WRONG_ACTION: { message: 'Wrong action', statusCode: 403 },
    ARRAY_CONTAINS_NOT_UNIQUE: { message: 'Array contains not unique', statusCode: 400 }
}

export const consoleColors = {
    fgRed: '\x1b[31m'
}
