export interface IBank {
    id: number
    name: string
    balance: number
}

export interface IPostBankBody {
    name: string
}

export interface IPutBankBody {
    name?: string
}
