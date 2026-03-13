import { Injectable, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
  console.log('1. Raw signupDto:', signupDto);

  const { email, password, name, city, dateOfBirth } = signupDto;
  console.log('2. Destructured:', { email, name, city, dateOfBirth, password });

  // Check if user exists
  const existing = await this.userRepository.findOne({ where: { email } });
  if (existing) throw new ConflictException('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('3. Hashed password generated');

  // Convert dateOfBirth string to Date object
  const birthDate = new Date(dateOfBirth);
  console.log('4. Converted birthDate:', birthDate);

  // Create user object
  const userData = {
    email,
    password: hashedPassword,
    name,
    city,
    dateOfBirth: birthDate,
  };
  console.log('5. User data to be created:', userData);

  const user = this.userRepository.create(userData);
  console.log('6. User entity after create():', user);

  return this.userRepository.save(user);
}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async updateProfile(userId: number, updateDto: UpdateProfileDto): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // If email is being updated, check it's not already taken
  if (updateDto.email && updateDto.email !== user.email) {
    const existing = await this.userRepository.findOne({ where: { email: updateDto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
  }

  // Convert dateOfBirth string to Date if provided
  let dateOfBirth: Date | undefined;
  if (updateDto.dateOfBirth) {
    dateOfBirth = new Date(updateDto.dateOfBirth);
  }

  // Update only provided fields
  const updatedUser = {
    ...user,
    ...updateDto,
    dateOfBirth: dateOfBirth || user.dateOfBirth,
  };

  // Save
  await this.userRepository.save(updatedUser);
  return updatedUser;
}

async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Verify old password
  const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
  if (!isMatch) {
    throw new ForbiddenException('Old password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

  // Update password
  user.password = hashedPassword;
  await this.userRepository.save(user);
}
}