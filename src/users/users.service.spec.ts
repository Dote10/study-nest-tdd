import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('./users.service');

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('spyOn userRepsoritory', async () => {
    const mockList = [
      {
        id: 1,
        email: 'test@email.com',
        password: '1234',
        nickName: '부기',
      },
    ];
    const userRepositoryFindSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(mockList);

    const result = await service.findAll();

    expect(userRepositoryFindSpy).toBeCalledTimes(1);
    expect(userRepositoryFindSpy).toHaveBeenCalled();
    expect(result).toBe(mockList);
  });
});
