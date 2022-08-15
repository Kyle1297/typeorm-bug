import { User } from 'src/server/app/users/user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
