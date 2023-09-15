import { Exclude } from 'class-transformer';
import { Conversation } from 'src/conversations/conversations.entity';
import { Message } from 'src/messages/messages.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    messages: Message[] 
    
   @ManyToMany(() => Conversation, (conversation) => conversation.users)
   @JoinTable()
   conversations: Conversation[]
}