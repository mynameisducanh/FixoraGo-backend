import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { ListDetailServiceEntity } from 'src/database/entities/list-detail-service.entity';
import { RequestServiceEntity } from 'src/database/entities/request-service.entity';
import { CloudService } from 'src/helpers/cloud.helper';
import { HistoryActiveRequestModule } from 'src/modules/historyActiveRequest/historyActiveRequest.module';
import { ListDetailServiceController } from 'src/modules/listDetailService/listDetailService.controller';
import { ListDetailServiceService } from 'src/modules/listDetailService/listDetailService.service';
import { RequestServiceController } from 'src/modules/requestService/requestService.controller';
import { RequestServiceService } from 'src/modules/requestService/requestService.service';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { UsersModule } from 'src/modules/users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RequestServiceEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    HistoryActiveRequestModule,
    ChatModule,
    NotificationModule,
    forwardRef(() => UsersModule),
  ],
  providers: [RequestServiceService, CloudService, ChatGateway],
  controllers: [RequestServiceController],
  exports: [RequestServiceService],
})
export class RequestServiceModule {}
