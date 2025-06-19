import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Borrow } from './entities/borrow.entity';
import * as cron from 'node-cron';

@Injectable()
export class SetupDueBookService {
  private readonly logger = new Logger(SetupDueBookService.name);

  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepository: Repository<Borrow>,
  ) {
    cron.schedule('0 30 11 * * 1-5', async () => {
      await this.updateStatusBorrow();
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
}
