import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
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

    if (!accessToken) {
      return res.status(401).json({
        code: 401,
        status: 'Error',
        message: 'No access token provided',
      });
    }

    try {
      const user = jwt.verify(accessToken, JWT_SECRET);
      req.user = user as any;

      const tokenExists = await Token.findOne({
        where: { token: accessToken },
      });

      if (!tokenExists) {
        return res.status(401).json({
          code: 401,
          status: 'Error',
          message: 'Token not found',
        });
      }

      next();
    } catch (err) {
      return res.status(403).json({
        code: 403,
        status: 'Error',
        message: 'Invalid token',
      });
    }
  }
}
