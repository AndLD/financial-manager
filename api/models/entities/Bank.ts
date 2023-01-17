import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IBank } from '../../utils/interfaces/bank'

@Entity({ name: 'banks' })
export class Bank implements IBank {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    balance: number
}
