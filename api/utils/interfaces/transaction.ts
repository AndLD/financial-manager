import { IPostTransactionCategoryBody, ITransactionCategoryInfo } from './transaction-category'

export interface ITransaction {
    id: number
    bankId: number
    timestamp: string
}

export interface ITransactionInfo {
    id: number
    amount: number
    type: TransactionType
    bankId: number
    timestamp: string
    transactionCategories: ITransactionCategoryInfo[]
}

export interface IPostTransactionBody {
    bankId: number
    transactionCategories: IPostTransactionCategoryBody[]
}

export enum TransactionType {
    PROFITABLE = 'profitable',
    CONSUMABLE = 'consumable'
}
