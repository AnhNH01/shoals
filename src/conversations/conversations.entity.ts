import { Message } from "src/messages/messages.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    name: string

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[]

    @ManyToMany(() => User, (user) => user.conversations)
    users: User[]

}