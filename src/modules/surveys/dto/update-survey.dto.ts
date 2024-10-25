import { PartialType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-survey.dto';

export class UpdateRequestDto extends PartialType(CreateRequestDto) { }
