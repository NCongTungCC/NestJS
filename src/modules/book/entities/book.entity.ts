import { Borrow } from 'src/modules/borrow/entities/borrow.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  discripton!: string;

  @Column()
  year!: number;

  @Column({ nullable: true })
  image?: string;

  @Column()
  totalBooks!: number;

  @Column()
  availableBooks!: number;

  @Column()
  category!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Borrow, (borrow) => borrow.bookId, {
    cascade: true,
  })
  borrowedBooks: Borrow[];
}
