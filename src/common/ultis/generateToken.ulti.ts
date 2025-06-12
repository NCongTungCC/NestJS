import jwt from 'jsonwebtoken';
import { User } from 'src/modules/user/entities/user.entity';

export const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
