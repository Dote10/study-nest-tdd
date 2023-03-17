import { OmitType } from '@nestjs/swagger';
import { User } from '../entity/users.entity';

export class UserUpdateDto extends OmitType(User, [
  'id',
  'password',
  'email',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}
