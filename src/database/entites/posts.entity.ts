import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { SharedProp } from "./sharedProp.entity"
import { UserEntity } from "./users.entity"

@Entity({ name: 'posts' })
export class PostEntity extends SharedProp {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', { name: 'title', nullable: false })
    title!: string

    @Column('text', { name: 'body', nullable: false })
    body!: string

    @Column('uuid', { name: 'user_id', nullable: false })
    userId!: string

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity

}