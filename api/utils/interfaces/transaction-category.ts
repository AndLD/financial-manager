export interface ITransactionCategory {
    id: number
    amount: number
    categoryId: number
    transactionId: number
}

export interface ITransactionCategoryInfo {
    amount: number
    categoryId: number
}

export interface IPostTransactionCategoryBody {
    amount: number
    categoryId: number
}
