import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProfileDto } from './dtos/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new Error('User not found!');
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      role: user.role,
    };
  }

  async updateProfile(userId: number, profileDto: ProfileDto) {
    return this.usersService.updateUser(userId, profileDto);
  }
}
