import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  entities,
  migrations,
  synchronize,
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
import { NewsModule } from 'src/modules/news/news.module';
import { RequestConfirmServiceModule } from './modules/requestConfirmService/requestConfirmService.module';
import { ServiceReviewModule } from './modules/serviceReview/service-review.module';
import { HistoryActiveRequestModule } from './modules/historyActiveRequest/historyActiveRequest.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { SkillFixerModule } from './modules/skill-fixer/skill-fixer.module';
import { FixerModule } from './modules/fixer/fixer.module';
import { SearchModule } from './modules/search/search.module';
import { RevenueManagerModule } from './modules/revenue-manager/revenue-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false
        },
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
    NewsModule,
    RequestConfirmServiceModule,
    ServiceReviewModule,
    HistoryActiveRequestModule,
    NotificationModule,
    ActivityLogModule,
    SkillFixerModule,
    FixerModule,
    SearchModule,
    RevenueManagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
