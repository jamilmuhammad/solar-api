import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './services/leads.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetOrderPaginationDto } from './dto/get-order-pagination.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { RoleGuard } from 'src/config/auth/role/role.guard';
import { RoleTypes } from 'src/config/auth/role/role.decorator';
import { RoleType } from 'src/config/auth/role/role.enum';
import { OrderApprovalStatusEnum } from './enums/order.status.enum';
import { EmptyDto } from './dto/empty.dto';
import { CreateOrderCustomerDto } from './dto/create-order.customer.dto';
import { RejectOrderDto } from './dto/reject-order.dto';
import { BasicOrJwtAuthGuard } from 'src/config/guard/basic-jwt-auth.guard';
import { SentryHelper } from 'src/config/helper/logging/sentry.helper';

@Controller({
  version: '1',
  path: 'orders',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @ApiTags('v1/orders/transactions')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createAdminOrder(dto);
  }

  @ApiTags('v1/orders/transactions')
  @UseGuards(BasicOrJwtAuthGuard)
  @ApiBearerAuth()
  @ApiBasicAuth()
  @Post('customer')
  createCustomerOrder(
    @Body() dto: CreateOrderCustomerDto,
    @Request() req: any,
  ) {
    return this.ordersService.createCustomerOrder(
      dto,
      req?.user,
    );
  }

  @ApiTags('v1/orders/transactions')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN, RoleType.CUSTOMER, RoleType.OWNER)
  @ApiBearerAuth()
  @Post('calculate-price')
  calculatePrice(@Body() dto: CreateOrderDto) {
    return this.ordersService.calculatePrice(dto);
  }

  @ApiTags('v1/orders/transactions')
  @UseGuards(BasicOrJwtAuthGuard)
  @ApiBearerAuth()
  @ApiBasicAuth()
  @Post('calculate-price/customer')
  customerCalculatePrice(@Body() dto: CreateOrderCustomerDto) {
    return this.ordersService.calculatePrice(dto);
  }

  @ApiTags('v1/orders/approval')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Post(':id/accept')
  accept(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(+id, dto, OrderApprovalStatusEnum.ACCEPTED);
  }

  @ApiTags('v1/orders/approval')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectOrderDto) {
    return this.ordersService.reject(+id, dto);
  }

  @ApiTags('v1/orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN, RoleType.CUSTOMER)
  @ApiBearerAuth()
  @Get()
  findAll(
    @Query() dto: GetOrderPaginationDto,
    @Request() req: any,
  ) {
    return this.ordersService.findAll(req.user, new GetOrderPaginationDto(dto));
  }

  @ApiTags('v1/orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN, RoleType.CUSTOMER, RoleType.OWNER)
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.ordersService.findOne(+id, true, req.user);
  }

  @ApiTags('v1/orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Get('status/count')
  getStatusCount() {
    return this.ordersService.getStatusCount();
  }

  @ApiTags('v1/orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(+id, dto);
  }

  @ApiTags('v1/orders')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleTypes(RoleType.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @ApiTags('v1/orders/pg-callback')
  @Post('pg/callback/invoice-paid')
  async pgCallback(
    @Body() dto: EmptyDto,
  ) {
    const body: any = dto;
    const data = process.env.NODE_ENV === 'production' ? body : body.data;
    SentryHelper.captureEvent(undefined, 'pgCallback-controller', { body });
    return this.ordersService.pgCallback(data?.invoice?.id, data?.invoice?.number);
  }

  @ApiTags('v1/orders/pg-callback')
  @Post('pg/callback/payment')
  async pgPayment(
    @Body() dto: EmptyDto,
  ) {
    const body: any = dto;
    SentryHelper.captureEvent(undefined, 'pgPayment-controller', { body });
    return this.ordersService.pgCallback(body?.transaction_id);
  }
}
