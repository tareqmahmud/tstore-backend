import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  verifyEmail: boolean;

  @Column({ nullable: true })
  verifyEmailToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetTokenExpireIn: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'USER' })
  userType: string;

  /**
   * Method to check is password valid or not
   *
   * @param userPassword
   */
  async validatePassword(userPassword: string): Promise<boolean> {
    return bcrypt.compare(userPassword, this.password);
  }
}
