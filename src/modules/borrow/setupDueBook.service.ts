import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Borrow } from './entities/borrow.entity';
import * as cron from 'node-cron';
import { sendOverdueBooksEmail } from 'src/common/ultis/sendEmail.ulti';

@Injectable()
export class SetupDueBookService {
  private readonly logger = new Logger(SetupDueBookService.name);

  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepository: Repository<Borrow>,
  ) {
    cron.schedule('0 */30 9-17 * * *', async () => {
      await this.updateStatusBorrow();
      await this.sendOverdueBooksEmail();
    });
  }

  async updateStatusBorrow() {
    const now = new Date();
    const result = await this.borrowRepository.update(
      { dueDate: LessThan(now), status: 'borrowed' },
      { status: 'overdue' },
    );
    this.logger.log(`Updated ${result.affected} borrow records to overdue`);
  }

  async sendOverdueBooksEmail() {
    const overdueBooks = await this.borrowRepository.find({
      where: { status: 'overdue' },
      relations: ['book', 'user'],
    });

    if (overdueBooks.length === 0) return;
    for (const borrow of overdueBooks) {
      await sendOverdueBooksEmail({
        to: borrow.user.email,
        userName: borrow.user.name,
        books: [
          {
            title: borrow.book.title,
            dueDate: borrow.dueDate,
          },
        ],
      });
    }
  }
}
