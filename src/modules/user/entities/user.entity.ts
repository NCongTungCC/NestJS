import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Token } from 'src/modules/auth/entities/token.entity';

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

  @Column()
  @IsNotEmpty()
  role!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @OneToMany(() => Token, (token) => token.userId)
  tokens!: Token[];
}
