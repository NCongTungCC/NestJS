import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationMiddleware } from './common/middlewares/authentication.middleware';
import { UserController } from './modules/user/user.controller';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import { BookModule } from './modules/book/book.model';
import { BookController } from './modules/book/book.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BookModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs',
      entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'books', method: RequestMethod.GET })
      .forRoutes(UserController, BookController, {
        path: 'logout',
        method: RequestMethod.GET,
      });
  }
}
