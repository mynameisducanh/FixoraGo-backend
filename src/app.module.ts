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
import { OtpModule } from 'src/modules/otp/otp.module';
import { IconsServiceModule } from 'src/modules/iconsService/iconsService.module';
import { ServicesModule } from 'src/modules/services/services.module';
import { ListDetailServiceModule } from 'src/modules/listDetailService/listDetailService.module';
import { PriceServiceModule } from 'src/modules/pricesService/pricesService.module';
import { RequestServiceModule } from 'src/modules/requestService/requestService.module';
import { ChatModule } from 'src/modules/chat/chat.module';

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
    OtpModule,
    ServicesModule,
    IconsServiceModule,
    ListDetailServiceModule,
    PriceServiceModule,
    RequestServiceModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
