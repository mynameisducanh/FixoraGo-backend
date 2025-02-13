import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  database,
  entities,
  host,
  migrations,
  password,
  port,
  synchronize,
  type,
  username,
} from './common/config/ormconfig';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TokenModule } from 'src/modules/tokens/token.module';
import { StaffModule } from 'src/modules/staffs/staffs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from 'src/common/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      useFactory: () => ({
        type,
        host,
        port,
        username,
        password,
        database,
        entities,
        synchronize,
        migrations,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    StaffModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
