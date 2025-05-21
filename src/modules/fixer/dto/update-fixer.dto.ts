import { PartialType } from '@nestjs/swagger';
import { CreateFixerDto } from './create-fixer.dto';

export class UpdateFixerDto extends PartialType(CreateFixerDto) {} 