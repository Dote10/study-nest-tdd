import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'study-nest-tdd' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '회원번호',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'email', comment: '이메일', length: 100 })
  email: string;

  @Column('varchar', { name: 'password', comment: '비밀번호', length: 300 })
  password: string;

  @Column('varchar', { name: 'nick_name', comment: '닉네임', length: 20 })
  nickName: string;
}
