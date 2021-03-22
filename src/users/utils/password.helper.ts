import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  public static async encryptPassword(password, salt = 10) {
    return bcrypt.hash(password, salt);
  }
}
