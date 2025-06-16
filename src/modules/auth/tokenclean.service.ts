import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Token } from './entities/token.entity';
import * as cron from 'node-cron';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    cron.schedule('0 */30 9-17 * * *', async () => {
      await this.deleteExpiredTokens();
    });
  }

  async deleteExpiredTokens() {
    const now = new Date();
    const result = await this.tokenRepository.delete({
      expiresAt: LessThan(now),
    });
    this.logger.log(`Deleted ${result.affected} expired tokens`);
  }
}
