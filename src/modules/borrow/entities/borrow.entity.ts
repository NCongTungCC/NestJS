import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { STATUS_BORROW } from '../../../common/ultis/constants.ulti';
import { User } from 'src/modules/user/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';

@Entity('borrow')
export class Borrow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  bookId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'enum', enum: STATUS_BORROW, default: 'unreturned' })
  status: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Book, (book) => book.id, {
    onDelete: 'CASCADE',
  })
  book: Book;
}
