export interface ITransaction {
    id: number
    bankId: number
}

export interface ITransactionInfo {
    id: number
    amount: number
    type: TransactionType
    bankId: number
}

export enum TransactionType {
    PROFITABLE = 'profitable',
    CONSUMABLE = 'consumable'
}
