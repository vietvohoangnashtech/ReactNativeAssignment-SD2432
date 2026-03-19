import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      userId,
      items: JSON.stringify(createOrderDto.items),
      totalAmount: createOrderDto.totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      status: 'pending',
    });
    return this.ordersRepository.save(order);
  }

  async getOrders(userId: number, role: string): Promise<Order[]> {
    const orders =
      role === 'admin'
        ? await this.ordersRepository.find({ order: { createdAt: 'DESC' } })
        : await this.ordersRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
          });

    return orders.map((o) => ({
      ...o,
      items: JSON.parse(o.items as string),
    })) as Order[];
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    order.status = updateOrderStatusDto.status;
    const saved = await this.ordersRepository.save(order);
    return { ...saved, items: JSON.parse(saved.items as string) } as Order;
  }

  async getPaymentMethods(): Promise<string[]> {
    return ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'];
  }
}
