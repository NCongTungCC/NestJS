import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token } from './entities/token.entity';
import { TokenCleanupService } from './tokenclean.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenCleanupService],
})
export class AuthModule {}
