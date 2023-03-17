import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserUpdateDto } from './dto/user-update.dto';
import * as request from 'supertest';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// const repositoryMock = mock<Repository<any>>();
// const qbuilderMock = mock<SelectQueryBuilder<any>>();

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  // jest.mock('typeorm', () => {
  //   qbuilderMock.where.mockReturnThis();
  //   qbuilderMock.select.mockReturnThis();
  //   repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

  //   return {
  //     getRepository: () => repositoryMock,

  //     BaseEntity: class Mock {},
  //     ObjectType: () => this,
  //     Entity: () => this,
  //     InputType: () => this,
  //     Index: () => this,
  //     PrimaryGeneratedColumn: () => this,
  //     Column: () => this,
  //     CreateDateColumn: () => this,
  //     UpdateDateColumn: () => this,
  //     OneToMany: () => this,
  //     ManyToOne: () => this,
  //   };
  // });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn().mockReturnThis(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository<User>>(
      getRepositoryToken(User),
    );
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
        name: '부기묘',
        nickName: '부기',
        memo: '고양이',
      },
    ];
    const userRepositoryFindSpy = jest
      .spyOn(usersRepository, 'find')
      .mockResolvedValue(mockList);

    const result = await usersRepository.find();

    expect(userRepositoryFindSpy).toBeCalledTimes(1);
    expect(userRepositoryFindSpy).toHaveBeenCalled();
    expect(result).toBe(mockList);
  });

  it('생성되지 않은 유저의 id가 주어진다면 유저를 찾을수 없다는 예외를 던진다.', async () => {
    const id = 5;

    const userUpdateDto = {
      name: '이미나',
      nickName: '팔몬',
      memo: '순수의 문장',
    };

    const spyOnFn = jest
      .spyOn(usersRepository, 'findOne')
      .mockResolvedValue(undefined);

    const result = async () => {
      return await service.updateUser(id, userUpdateDto);
    };

    await expect(result).rejects.toThrowError(
      new NotFoundException('존재하지 않는 회원번호 입니다.'),
    );
  });

  it('이미 생성된 유저의 id가 주어진다면 해당 id의 유저를 수정하고 유저를 반환한다.', async () => {
    const userId = 1;
    const userUpdateDto = {
      name: '부기묘',
      nickName: '부기',
      memo: '고양이',
    };

    const requestDto = new UserUpdateDto();
    Object.assign(requestDto, userUpdateDto);

    const creatingUser = new User();
    Object.assign(creatingUser, userUpdateDto);

    const existingUser = new User();
    Object.assign(existingUser, {
      id: userId,
      name: '장한솔',
      nickName: '텐타몬',
      memo: '지식의 문장',
    });

    const savedUser = new User();
    Object.assign(savedUser, {
      id: userId,
      ...creatingUser,
    });

    const userRepositoryFindOnSpy = jest
      .spyOn(usersRepository, 'findOne')
      .mockResolvedValue(existingUser);
    //create 메서드
    jest.spyOn(usersRepository, 'create').mockReturnValue(creatingUser);
    //update 메서드
    const userRepositorySaveSpy = jest
      .spyOn(usersRepository, 'update')
      .mockResolvedValue(savedUser);

    const result = await service.updateUser(userId, requestDto);

    expect(userRepositoryFindOnSpy).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(userRepositorySaveSpy).toHaveBeenCalledWith(userId, creatingUser);
    expect(result).toEqual(savedUser);
  });
});
