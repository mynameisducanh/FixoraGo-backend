import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillFixerEntity } from '../../database/entities/skill-fixer.entity';
import { SkillFixerController } from './skill-fixer.controller';
import { SkillFixerService } from './skill-fixer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SkillFixerEntity]) , AuthModule],
  controllers: [SkillFixerController],
  providers: [SkillFixerService],
  exports: [SkillFixerService],
})
export class SkillFixerModule {} 