export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export const errors = {
    BAD_HTTP_METHOD: { msg: 'Unexpected http request method', code: 405 },
    USER_HAS_NO_RIGHTS: {
        msg: 'User does not have enough permissions',
        code: 403
    },
    DOC_NOT_FOUND: { msg: 'The document does not exist', code: 404 },
    UNAUTHORIZED: { msg: 'Unauthorized', code: 401 },
    EMAIL_NOT_MATCHES_PATTERN: { msg: 'Email invalid', code: 400 },
    ENTITY_ALREADY_EXISTS: { msg: 'Entity already exists', code: 400 },
    ENTITY_USED: { msg: 'Entity already in use', code: 400 },
    FORBIDDEN: { msg: 'Forbidden', code: 403 },
    BAD_REQUEST: { msg: 'Bad request', code: 400 },
    INTERNAL_SERVER_ERROR: { msg: 'Internal server error', code: 500 },
    WRONG_ACTION: { msg: 'Wrong action', code: 403 },
    ARRAY_CONTAINS_NOT_UNIQUE: { msg: 'Array contains not unique', code: 400 }
}
