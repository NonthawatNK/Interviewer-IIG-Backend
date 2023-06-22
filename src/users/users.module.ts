import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { Password } from 'src/typeorm/entities/password';

@Module({
  imports : [TypeOrmModule.forFeature([User , Profile ,Password])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
