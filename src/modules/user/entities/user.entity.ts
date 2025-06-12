import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

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
  password!: string;
}
