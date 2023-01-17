import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ICategory } from '../../utils/interfaces/category'

@Entity({ name: 'categories' })
export class Category implements ICategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}
