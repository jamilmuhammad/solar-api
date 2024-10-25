import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCustomerPaginationDto } from './dto/get-customer-pagination.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { RoleGuard } from 'src/config/auth/role/role.guard';
import { RoleTypes } from 'src/config/auth/role/role.decorator';
import { RoleType } from 'src/config/auth/role/role.enum';
import { CustomersService } from './customers.service';
import { RejectCustomerDto } from './dto/reject-customer.dto';

@Controller({
  version: '1',
  path: 'customers',
})
@ApiTags('v1/customers')
export class CustomersController {

  constructor(private readonly customersService: CustomersService) { }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get()
  findAll(@Query() dto: GetCustomerPaginationDto) {
    return this.customersService.findAll(new GetCustomerPaginationDto(dto));
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Get('status/count')
  getStatusCount() {
    return this.customersService.getStatusCount();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Put(':id/verify')
  verify(@Param('id') id: string) {
    return this.customersService.verify(+id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.SUPERADMIN)
  @ApiBearerAuth()
  @Put(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: RejectCustomerDto,
  ) {
    return this.customersService.reject(+id, dto.reason);
  }
}
