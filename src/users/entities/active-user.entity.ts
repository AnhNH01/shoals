import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActiveUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  socketId: string;
}
