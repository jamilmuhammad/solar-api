import { Module } from '@nestjs/common';
import { SurveysService } from './services/surveys.service';
import { SurveysController } from './surveys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysEntity } from './entities/survey.entity';
import { SurveyLogsEntity } from './entities/survey-log.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      SurveysEntity,
      SurveyLogsEntity,
    ]),
    NotificationsModule,
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule { }
