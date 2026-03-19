import { IsString, IsIn } from 'class-validator';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(ORDER_STATUSES)
  status: string;
}
