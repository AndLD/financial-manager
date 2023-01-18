export interface IBank {
    id: number
    name: string
    balance: number
}

export interface IPostBankBody {
    name: string
    balance: number
}

export interface IPutBankBody {
    name?: string
    balance?: number
}
