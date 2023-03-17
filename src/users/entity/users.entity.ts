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

  @Column('varchar', { name: 'name', comment: '이름', length: 20 })
  name: string;

  @Column('varchar', { name: 'nick_name', comment: '닉네임', length: 20 })
  nickName: string;

  @Column('varchar', { name: 'memo', comment: '메모', length: 300 })
  memo: string;

  @Column('datetime', {
    name: 'created_at',
    comment: '회원가입한 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '정보 수정한 날짜',
  })
  updatedAt: Date | null;

  @Column('datetime', {
    name: 'deleted_at',
    nullable: true,
    comment: '탈퇴 날짜',
  })
  deletedAt: Date | null;
}
