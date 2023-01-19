import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ITransaction } from '../../utils/interfaces/transaction'

@Entity({ name: 'transactions' })
export class Transaction implements ITransaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'bank_id' })
    bankId: number

    @Column()
    timestamp: string
}
