import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials with username and password
   *
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string): Promise<any> {
    // Check is user available or not
    const user = await this.usersService.findOne(username);

    // If user available and password matched then logged in
    if (user && user.validatePassword(password)) {
      // Fetch all the user data except password -> Security
      const { password, ...userResult } = user;

      return userResult;
    }

    // Otherwise invalid username or password
    return null;
  }

  /**
   * Method to login and generate jwt token
   *
   * @param user
   */
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
