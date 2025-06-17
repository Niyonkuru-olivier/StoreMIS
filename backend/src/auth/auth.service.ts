import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private configService: ConfigService,
  ) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    if (!emailUser || !emailPassword) {
      throw new Error('Email configuration is missing. Please check your .env file.');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');

    const token = Math.random().toString(36).substr(2, 8);
    user.resetToken = token;
    await this.userRepo.save(user);

    try {
      await this.sendResetEmail(email, token);
      return { message: 'Password reset link sent to your email.' };
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw new InternalServerErrorException('Failed to send reset email. Please try again later.');
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email, resetToken: token } });
    if (!user) throw new UnauthorizedException('Invalid token or email');

    const passwordErrors = this.validatePasswordStrength(newPassword);
    if (passwordErrors.length > 0)
      throw new UnauthorizedException(`Password issue(s): ${passwordErrors.join(', ')}`);

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) throw new UnauthorizedException('New password must be different from old password');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = '';
    await this.userRepo.save(user);

    return { message: 'Password successfully reset' };
  }

  async validateUser(email: string, password: string, role: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email, role } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.status !== 'Activated') {
      throw new UnauthorizedException('You are Deactivated. Please contact Admin.');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return { message: `${role} login successful` };
  }

  private validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];
    if (password.length < 8) errors.push('minimum 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('one special character');
    return errors;
  }

  private async sendResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      throw new Error('FRONTEND_URL is not configured in environment variables');
    }

    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${to}`;
    const emailUser = this.configService.get<string>('EMAIL_USER');

    if (!emailUser) {
      throw new Error('EMAIL_USER is not configured in environment variables');
    }

    await this.transporter.sendMail({
      from: emailUser,
      to,
      subject: 'Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  }
}
