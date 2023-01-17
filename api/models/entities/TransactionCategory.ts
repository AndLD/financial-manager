import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'transaction-categories' })
export class TransactionCategory implements ITransactionCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: number

    @Column()
    categoryId: number

    @Column()
    transactionId: number
}
