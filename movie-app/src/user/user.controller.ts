import { Controller, Post, Body, HttpCode, HttpStatus , Param} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Patch, UseGuards, Req, ForbiddenException } from '@nestjs/common'; // ensure imports
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

@Post('signup')
async signup(@Body() signupDto: SignupDto) {
  console.log('Received signup DTO:', signupDto);
  const user = await this.userService.signup(signupDto);
  return { message: 'User created successfully', userId: user.id };
}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto);
    const token = this.authService.generateToken(user);
    return { access_token: token };
  }
  @Patch('admin/:id')
@UseGuards(AuthGuard('jwt'), RolesGuard) // JWT first, then RolesGuard
async adminUpdateUser(
  @Param('id') id: string,
  @Body() updateDto: UpdateProfileDto,
) {
  const updatedUser = await this.userService.updateProfile(+id, updateDto);
  const { password, ...result } = updatedUser;
  return result;
}
  @Patch('profile')
@UseGuards(AuthGuard('jwt'))
async updateProfile(@Req() req: any, @Body() updateDto: UpdateProfileDto) {
  const userId = req.user.userId; // from JWT payload
  const updatedUser = await this.userService.updateProfile(userId, updateDto);
  // Remove password from response
  const { password, ...result } = updatedUser;
  return result;
}

@Patch('change-password')
@UseGuards(AuthGuard('jwt'))
async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
  const userId = req.user.userId;
  await this.userService.changePassword(userId, changePasswordDto);
  return { message: 'Password changed successfully' };
}
}