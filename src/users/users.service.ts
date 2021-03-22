import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find out a user with username
   *
   * @param username
   */
  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }
}
