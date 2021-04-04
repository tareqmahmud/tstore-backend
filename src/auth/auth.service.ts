import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserType } from '../users/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials with username and password
   *
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Check is user available or not
    const user = await this.usersService.findOne(email);

    // If user available and password matched then logged in
    if (user && (await user.validatePassword(password))) {
      // Fetch all the user data except password -> Security
      const { password, ...userResult } = user;

      return userResult;
    }

    // Otherwise invalid username or password
    throw new UnauthorizedException('Invalid email or password');
  }

  /**
   * Method to login and generate jwt token
   *
   * @param user
   */
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(userSignupDto: UserSignupDto): Promise<UserType> {
    return this.usersService.createNewUser(userSignupDto);
  }
}
