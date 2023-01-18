import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ITransactionCategory } from '../../utils/interfaces/transaction-category'

@Entity({ name: 'transaction_categories' })
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
