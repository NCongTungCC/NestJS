import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Token } from 'src/modules/auth/entities/token.entity';
import { Role, Gender } from '../../../common/ultis/constants.ulti';
import { Borrow } from 'src/modules/borrow/entities/borrow.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column()
  @IsNotEmpty()
  email!: string;

  @Column({ type: 'enum', enum: Role })
  @IsNotEmpty()
  role!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @Column({ type: 'enum', enum: Gender })
  @IsNotEmpty()
  gender!: string;

  @Column()
  @IsNotEmpty()
  birthDate!: Date;

  @OneToMany(() => Token, (token) => token.userId)
  tokens!: Token[];

  @OneToMany(() => Borrow, (borrow) => borrow.userId, {
    cascade: true,
  })
  borrowedBooks: Borrow[];
}
