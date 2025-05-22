import { PartialType } from '@nestjs/swagger';
import { CreateSkillFixerDto } from './create-skill-fixer.dto';

export class UpdateSkillFixerDto extends PartialType(CreateSkillFixerDto) {} 