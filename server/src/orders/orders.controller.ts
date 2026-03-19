import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JwtPayload } from '../auth/dtos/jwtpayload.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('payment-methods')
  getPaymentMethods() {
    return this.ordersService.getPaymentMethods();
  }

  @Post()
  createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user as JwtPayload;
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Get()
  getOrders(@Req() req: any) {
    const user = req.user as JwtPayload;
    return this.ordersService.getOrders(user.id, user.role || 'user');
  }

  @Patch(':orderId/status')
  updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
  }
}
