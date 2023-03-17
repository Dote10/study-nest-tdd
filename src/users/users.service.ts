import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async updateUser(id: number, userUpdateRequestDto: UserUpdateDto) {
    const userId = await this.usersRepository.findOne({ where: { id } });

    if (!userId) {
      throw new NotFoundException('존재하지 않는 회원번호 입니다.');
    }

    const { name, nickName, memo } = userUpdateRequestDto;

    const user = this.usersRepository.create({ name, nickName, memo });

    return await this.usersRepository.update(id, user);
  }
}
