import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserType } from './types/user.type';
import { NewUserDto } from './dto/new-user.dto';
import { PasswordHelper } from './utils/password.helper';

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

  /**
   * User service for create new user
   *
   * @param newUserDto
   */
  async createNewUser(newUserDto: NewUserDto): Promise<UserType> {
    // Check unique username and email

    // If existing username is available then throw bad request
    const existingUsername = await this.usersRepository.findOne({
      where: { username: newUserDto.username },
    });

    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // If existing email is available then throw bad request
    const existingEmail = await this.usersRepository.findOne({
      where: { email: newUserDto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // If username and email isn't available then encrypt password
    const newUser = new User();
    newUser.firstName = newUserDto.firstName ? newUserDto.firstName : null;
    newUser.lastName = newUserDto.lastName ? newUserDto.lastName : null;
    newUser.username = newUserDto.username;
    newUser.email = newUserDto.email;
    newUser.password = await PasswordHelper.encryptPassword(
      newUserDto.password,
    );
    newUser.isActive = true;

    try {
      await this.usersRepository.insert(newUser);

      // Extract password from the object
      const { password, ...user } = newUser;

      // And finally save the user
      return user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
