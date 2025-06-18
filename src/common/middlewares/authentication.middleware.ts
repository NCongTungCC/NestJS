import * as jwt from 'jsonwebtoken';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Token } from '../../modules/auth/entities/token.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { JWT_SECRET } = process.env;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) throw new UnauthorizedException('Access token not found');
    try {
      const user = jwt.verify(accessToken, JWT_SECRET);
      req.user = user as any;

      const tokenExists = await Token.findOne({
        where: { token: accessToken },
      });

      if (!tokenExists) throw new UnauthorizedException('Token not found');

      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
