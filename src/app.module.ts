import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Profile } from './typeorm/entities/Profile';
import { Password } from './typeorm/entities/password';

@Module({
  imports: [TypeOrmModule.forRoot({

    type : 'mysql',
    host : 'localhost',
    port : 3306,
    username: 'root',
    database :'iig',
    entities :[
      User,
      Profile,
      Password
    ],
    synchronize : true ,


  }),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
