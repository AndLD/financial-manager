import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ITransaction } from '../../utils/interfaces/transaction'

@Entity({ name: 'transactions' })
export class Transaction implements ITransaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    bankId: number
}
