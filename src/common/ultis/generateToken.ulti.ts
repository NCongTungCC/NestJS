import * as jwt from 'jsonwebtoken';
import { User } from 'src/modules/user/entities/user.entity';

export const generateToken = (user: User) => {
  const { JWT_SECRET } = process.env;
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });
};
