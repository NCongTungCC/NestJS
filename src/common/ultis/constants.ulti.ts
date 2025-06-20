export const LIMIT = 10;
export const PAGE = 1;

export const Role = {
  USER: 'user',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
};

export const ALLOWED_BOOK = ['title', 'author', 'year', 'category'];
export const ALLOWED_USER = ['name', 'email', 'role'];
export const STATUS_BORROW = ['pending', 'unreturned', 'overdue', 'returned'];
