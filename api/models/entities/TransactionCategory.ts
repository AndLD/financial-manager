import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ITransactionCategory } from '../../utils/interfaces/transaction-category'

@Entity({ name: 'transaction-categories' })
export class TransactionCategory implements ITransactionCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: number

    @Column({ name: 'category_id' })
    categoryId: number

    @Column({ name: 'transaction_id' })
    transactionId: number
}
