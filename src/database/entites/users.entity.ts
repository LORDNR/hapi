import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { SharedProp } from "./sharedProp.entity"

enum UserType {
    admin = 'admin',
    user = 'user'
}

@Entity({ name: 'users' })
export class UserEntity extends SharedProp {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', { name: 'first_name', nullable: false })
    firstName!: string

    @Column('varchar', { name: 'last_name', nullable: false })
    lastName!: string

    @Column('date', { name: 'birth_of_date', nullable: true })
    birthOfDate!: Date

    @Column('varchar', { name: 'email', unique: true, nullable: false })
    email!: string

    @Column('text', { name: 'type', default: UserType.user })
    type!: UserType
}