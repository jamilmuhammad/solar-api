import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Survey } from '@nestjs/common';
import { SurveysService } from './services/surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetSurveyPaginationDto } from './dto/get-survey-pagination.dto';
import { RoleTypes } from 'src/config/auth/role/role.decorator';
import { RoleType } from 'src/config/auth/role/role.enum';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { RoleGuard } from 'src/config/auth/role/role.guard';
import { CreateSurveyLogDto } from './dto/create-survey-log.dto';
import { GetSurveyOneDto } from './dto/get-survey-one.dto';

@Controller({
  version: '1',
  path: 'surveys',
})
@ApiTags('v1/surveys')
export class SurveysController {

  constructor(private readonly surveysService: SurveysService) { }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SALESPERSON)
  @ApiBearerAuth()
  @Post(':id/log')
  logStart(@Param('id') id: string, @Body() dto: CreateSurveyLogDto, @Survey() req) {
    return this.surveysService.log(req.user, +id, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get()
  findAll(@Query() dto: GetSurveyPaginationDto) {
    return this.surveysService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get('status/count')
  getStatusCount() {
    return this.surveysService.getStatusCount();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.CUSTOMERSERVICE)
  @ApiBearerAuth()
  @Get('driver')
  findByDriver(@Query() dto: GetSurveyPaginationDto, @Survey() req) {
    return this.surveysService.findAll(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SALESPERSON, RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() dto: GetSurveyOneDto,
  ) {
    return this.surveysService.findOne(+id, new GetSurveyOneDto(dto));
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(+id, updateSurveyDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(+id);
  }
}
